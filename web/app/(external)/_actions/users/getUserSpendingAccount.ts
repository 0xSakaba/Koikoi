"use server";

import { web3, utils } from "@coral-xyz/anchor";
import { uuidToBase64 } from "../../_lib/uuidToBase64";

export async function getUserSpendingAccount(id: string): Promise<string> {
  const [account] = web3.PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode("spending"),
      utils.bytes.utf8.encode(uuidToBase64(id)),
    ],
    new web3.PublicKey(process.env.PROGRAM_ID!)
  );

  return account.toBase58();
}

export default getUserSpendingAccount;
