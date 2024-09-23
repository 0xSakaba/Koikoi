"use server";

import { ironSessionConfig, UserSession } from "@/app/ironSession";
import prisma from "@/prisma";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SolanaService } from "../../_lib/solana";
import { uuidToBase64 } from "../../_lib/uuidToBase64";
import { PublicKey } from "@solana/web3.js";

export async function setWallet(pubkey: string) {
  const session = await getIronSession<UserSession>(
    cookies(),
    ironSessionConfig
  );

  const solana = new SolanaService();
  solana.updateSpendingAccountOwner(
    uuidToBase64(session.userId),
    new PublicKey(pubkey)
  );
  await solana.send();

  await prisma.user.update({
    where: {
      id: session.userId,
    },
    data: {
      wallet: pubkey,
    },
  });
}
