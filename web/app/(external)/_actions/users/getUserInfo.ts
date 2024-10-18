"use server";

import { ironSessionConfig, UserSession } from "@/app/ironSession";
import prisma from "@/prisma";
import { User } from "@prisma/client";
import { PrivyClient } from "@privy-io/server-auth";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SolanaService } from "@/app/(external)/_lib/solana";
import { uuidToBase64 } from "@/app/(external)/_lib/uuidToBase64";

export async function getUserInfo(accessToken: string | null) {
  if (!accessToken) {
    return;
  }

  const privy = new PrivyClient(
    process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    process.env.PRIVY_APP_SECRET
  );

  let userId = "";
  try {
    const verified = await privy.verifyAuthToken(accessToken);
    userId = verified.userId;
  } catch (err) {
    console.error("[Get User Info] Failed to verify auth token.", err);
    return;
  }

  let user = await prisma.user.findFirst({
    where: {
      privyId: userId,
    },
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "",
        privyId: userId,
      },
    });
  }

  if (!user.inited) {
    prepareSpendingAccount(user).catch((err) => {
      console.error(
        "[Prepare Spending Account] Failed to create spending account.",
        err
      );
    });
  }

  const session = await getIronSession<UserSession>(
    cookies(),
    ironSessionConfig
  );

  if (!session.userId || session.userId !== user.id) {
    session.userId = user.id;
    await session.save();
  }

  const userSpendingAccount = SolanaService.getSpendingAccountAddress(
    uuidToBase64(user.id)
  );

  return { ...user, spendingAccount: userSpendingAccount.toBase58() };
}

async function prepareSpendingAccount(user: User) {
  const solana = new SolanaService();
  if (await solana.checkSpendingAccountCreated(uuidToBase64(user.id))) {
    await prisma.user.update({
      where: { id: user.id },
      data: { inited: true },
    });
  }

  solana.createSpendingAccount(uuidToBase64(user.id));
  await solana.send();
}
