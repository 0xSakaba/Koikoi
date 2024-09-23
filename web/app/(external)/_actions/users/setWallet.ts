"use server";

import { ironSessionConfig, UserSession } from "@/app/ironSession";
import prisma from "@/prisma";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export async function setWallet(pubkey: string) {
  const session = await getIronSession<UserSession>(
    cookies(),
    ironSessionConfig
  );

  await prisma.user.update({
    where: {
      id: session.userId,
    },
    data: {
      wallet: pubkey,
    },
  });
}
