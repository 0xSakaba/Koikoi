import "server-only";

import { AnchorProvider, Idl, Program } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import { IDL, Koikoi } from "./koikoi";

export class SolanaService {
  private connection: Connection;
  private provider: AnchorProvider;
  private program: Program<Koikoi>;
  private keypair = Keypair.fromSecretKey(
    Uint8Array.from(Buffer.from(process.env.SERVICE_KEY, "base64"))
  );
  private wallet = new NodeWallet(this.keypair);
  private transaction = new Transaction();
  private koikoi: PublicKey;
  private closed = false;
  private tasks: Promise<void>[] = [];

  constructor() {
    this.connection = new Connection(clusterApiUrl("devnet"));
    this.provider = new AnchorProvider(this.connection, this.wallet, {
      preflightCommitment: "processed",
    });
    this.program = new Program(
      IDL as Idl,
      this.provider
    ) as unknown as Program<Koikoi>;
    this.koikoi = PublicKey.findProgramAddressSync(
      [Buffer.from("koikoi")],
      new PublicKey(IDL.address)
    )[0];
  }

  /// @deprecated This method only be invoked once after deployed to chains
  initKoikoiAccount() {
    this._preventClosed();

    const taskLength = this.tasks.length;
    this.tasks.push(
      (async () => {
        await Promise.all(this.tasks.slice(0, taskLength));
        if (await this._checkAccountExists([Buffer.from("koikoi")])) {
          return;
        }

        const instruction = await this.program.methods
          .initialize()
          .instruction();

        this.transaction.instructions.push(instruction);
      })()
    );

    return this;
  }

  /// @dev Check if the spending wallet exists and create one if not
  createSpendingAccount(
    identifier: string,
    userWallet: PublicKey = this.wallet.publicKey
  ) {
    this._preventClosed();

    const taskLength = this.tasks.length;
    this.tasks.push(
      (async () => {
        await Promise.all(this.tasks.slice(0, taskLength));
        if (
          await this._checkAccountExists([
            Buffer.from("spending"),
            Buffer.from(identifier),
          ])
        ) {
          return;
        }

        const instruction = await this.program.methods
          .createSpendingAccount(identifier, userWallet)
          .accounts({
            koikoi: this.koikoi,
            user: this.wallet.publicKey,
          })
          .instruction();

        this.transaction.instructions.push(instruction);
      })()
    );

    return this;
  }

  /// @dev Should be called at the end to submit all instructions, or the transaction should be serialized and sent to user
  async send() {
    this._preventClosed();
    this.closed = true;

    await Promise.all(this.tasks);

    // we don't throw an error here but devs should be aware that the transaction can be empty
    if (this.transaction.instructions.length === 0) return;

    const result = await sendAndConfirmTransaction(
      this.connection,
      this.transaction,
      [this.keypair]
    );

    return result;
  }

  /// @dev Should be called at the end to submit all instructions, or the transaction should be serialized and sent to user
  async serializeSigned() {
    this._preventClosed();
    this.closed = true;

    await Promise.all(this.tasks);

    // we don't throw an error here but devs should be aware that the transaction can be empty
    if (this.transaction.instructions.length === 0) return;

    const recentBlockhash = await this.connection.getLatestBlockhash();
    this.transaction.recentBlockhash = recentBlockhash.blockhash;
    this.transaction.feePayer = this.keypair.publicKey;
    const signedTx = await this.wallet.signTransaction(this.transaction);
    const serializedTx = signedTx.serialize({ requireAllSignatures: false });

    return serializedTx;
  }

  private _preventClosed() {
    if (this.closed) {
      throw new Error("Transaction has been closed");
    }
  }

  private async _checkAccountExists(
    seeds: Array<Buffer | Uint8Array>
  ): Promise<boolean> {
    const [spending] = PublicKey.findProgramAddressSync(
      seeds,
      new PublicKey(IDL.address)
    );

    const account = await this.connection.getAccountInfo(spending);

    return !!account;
  }
}
