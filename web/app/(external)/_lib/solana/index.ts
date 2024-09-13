import { AnchorProvider, Idl, Program, Wallet } from "@coral-xyz/anchor";
import idl from "./idl.json";
import { clusterApiUrl, Connection } from "@solana/web3.js";

export class SolanaService {
  private connection: Connection;
  private provider: AnchorProvider;
  private program: Program;

  constructor(wallet: Wallet) {
    this.connection = new Connection(clusterApiUrl("devnet"));
    this.provider = new AnchorProvider(this.connection, wallet, {
      preflightCommitment: "processed",
    });
    this.program = new Program(idl as Idl, this.provider);
  }
}
