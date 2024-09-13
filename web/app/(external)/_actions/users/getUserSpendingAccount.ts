"use server";

import { PublicKey } from "@solana/web3.js";
import { uuidToBase64 } from "@/app/(external)/_lib/uuidToBase64";
import { IDL } from "@/app/(external)/_lib/solana/koikoi";

export async function getUserSpendingAccount(id: string): Promise<string> {
  const [account] = PublicKey.findProgramAddressSync(
    [Buffer.from("spending"), Buffer.from(uuidToBase64(id))],
    new PublicKey(IDL.address)
  );

  return account.toBase58();
}

export default getUserSpendingAccount;
