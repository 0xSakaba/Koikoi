"use server";

import { SolanaService } from "@/app/(external)/_lib/solana";
import { uuidToBase64 } from "@/app/(external)/_lib/uuidToBase64";
import { ironSessionConfig, UserSession } from "@/app/ironSession";
import prisma from "@/prisma";
import { PublicKey } from "@solana/web3.js";
import { Header, Payload, SIWS } from "@web3auth/sign-in-with-solana";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export async function setWallet(
  pubkey: string,
  issuedAt: string,
  nonce: string,
  signature: string
) {
  const session = await getIronSession<UserSession>(
    cookies(),
    ironSessionConfig
  );

  const nonceRecord = await prisma.loginNonce.findFirst({
    where: {
      pubKey: pubkey,
      nonce: nonce,
    },
  });
  if (!nonceRecord) throw new Error("Invalid nonce");
  await prisma.loginNonce.delete({ where: { id: nonceRecord.id } });

  const swis = getSwis(pubkey, issuedAt, nonce);
  if (
    !swis.verify({
      payload: swis.payload,
      signature: {
        t: "bip99",
        s: signature,
      },
    })
  ) {
    throw new Error("Invalid signature");
  }

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

export async function getLoginMessage(pubkey: string) {
  const time = new Date().toISOString();
  const swis = getSwis(pubkey, new Date().toISOString());
  const message = swis.prepareMessage();

  await prisma.loginNonce.create({
    data: { pubKey: pubkey, nonce: swis.payload.nonce },
  });

  return { message, time, nonce: swis.payload.nonce };
}

function getSwis(pubkey: string, issuedAt: string, nonce?: string) {
  const header = new Header();
  header.t = "sip99";

  const payload = new Payload();
  payload.domain = process.env.SERVER_BASE_URL.split("://")[1];
  payload.address = pubkey;
  payload.uri = process.env.SERVER_BASE_URL + "/";
  payload.statement = "Bind this wallet to your KOIKOI account";
  payload.version = "1";
  payload.chainId = 1;
  payload.issuedAt = issuedAt;
  if (nonce) payload.nonce = nonce;

  return new SIWS({
    header,
    payload,
  });
}
