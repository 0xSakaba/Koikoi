import { Idl, Program } from "@coral-xyz/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { IDL, Koikoi } from "./koikoi";
import { useMemo } from "react";

export function useKoikoiProgram() {
  const { connection } = useConnection();
  return useMemo(
    () => new Program(IDL as Idl, { connection }) as unknown as Program<Koikoi>,
    [connection]
  );
}
