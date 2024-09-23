import "server-only";

import { AnchorProvider, BN, Idl, Program } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import {
  AccountMeta,
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
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
    this.connection = new Connection(
      clusterApiUrl(process.env.NEXT_PUBLIC_SOLANA_NET)
    );
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

  updateSpendingAccountOwner(identifier: string, userWallet: PublicKey) {
    this._preventClosed();

    const taskLength = this.tasks.length;
    this.tasks.push(
      (async () => {
        await Promise.all(this.tasks.slice(0, taskLength));

        const instruction = await this.program.methods
          .updateSpendingAccountOwner(identifier, userWallet)
          .accounts({
            koikoi: this.koikoi,
          })
          .instruction();

        this.transaction.instructions.push(instruction);
      })()
    );

    return this;
  }

  withdrawSpendingAccount(
    identifier: string,
    amount: number,
    receiver: PublicKey
  ) {
    this._preventClosed();

    const taskLength = this.tasks.length;
    this.tasks.push(
      (async () => {
        await Promise.all(this.tasks.slice(0, taskLength));

        const instruction = await this.program.methods
          .withdrawFromSpendingAccount(identifier, new BN(amount))
          .accounts({
            koikoi: this.koikoi,
            receiver,
            feeReceiver: this.wallet.publicKey,
            signer: this.wallet.publicKey,
          })
          .instruction();

        this.transaction.instructions.push(instruction);
      })()
    );

    return this;
  }

  makeGame(identifier: string, options: number) {
    this._preventClosed();

    const taskLength = this.tasks.length;
    this.tasks.push(
      (async () => {
        await Promise.all(this.tasks.slice(0, taskLength));

        const instruction = await this.program.methods
          .makeGame(identifier, options)
          .accounts({
            koikoi: this.koikoi,
            service: this.wallet.publicKey,
          })
          .instruction();

        this.transaction.instructions.push(instruction);
      })()
    );
  }

  placeBet(
    gameIdentifier: string,
    userIdentifier: string,
    option: number,
    amount: number,
    signer?: PublicKey
  ) {
    this._preventClosed();

    const taskLength = this.tasks.length;
    this.tasks.push(
      (async () => {
        await Promise.all(this.tasks.slice(0, taskLength));

        const instruction = await this.program.methods
          .placeBet(gameIdentifier, userIdentifier, option, new BN(amount))
          .accounts({
            koikoi: this.koikoi,
            service: this.wallet.publicKey,
            signer,
          })
          .instruction();

        this.transaction.instructions.push(instruction);
      })()
    );
  }

  closeGame(identifier: string, option: number) {
    this._preventClosed();

    const taskLength = this.tasks.length;
    this.tasks.push(
      (async () => {
        await Promise.all(this.tasks.slice(0, taskLength));

        const gameData = await this.getGameAccountData(identifier);
        const bettors: AccountMeta[] = gameData.bettors
          .flat()
          .map((bettor) => ({
            pubkey: bettor,
            isWritable: true,
            isSigner: false,
          }));

        const instruction = await this.program.methods
          .closeGame(identifier, option)
          .accounts({
            koikoi: this.koikoi,
            service: this.wallet.publicKey,
          })
          .remainingAccounts(bettors)
          .instruction();

        this.transaction.instructions.push(instruction);
      })()
    );
  }

  topup(identifier: string, amount: number, from: PublicKey) {
    this._preventClosed();

    const taskLength = this.tasks.length;
    this.tasks.push(
      (async () => {
        await Promise.all(this.tasks.slice(0, taskLength));

        const instruction = SystemProgram.transfer({
          fromPubkey: from,
          toPubkey: SolanaService.getSpendingAccountAddress(identifier),
          lamports: amount,
        });

        this.transaction.instructions.push(instruction);
      })()
    );
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

    return { tx: serializedTx, block: recentBlockhash.lastValidBlockHeight };
  }

  async checkSpendingAccountCreated(identifier: string) {
    return this._checkAccountExists([
      Buffer.from("spending"),
      Buffer.from(identifier),
    ]);
  }

  async checkGameAccountCreated(identifier: string) {
    return this._checkAccountExists([
      Buffer.from("game"),
      Buffer.from(identifier),
    ]);
  }

  async getSpendingWalletBalance(identifier: string) {
    const info = await this.connection.getAccountInfo(
      SolanaService.getSpendingAccountAddress(identifier)
    );
    return info?.lamports || 0;
  }

  async getGameAccountData(identifier: string) {
    return this.program.account.gameAccount.fetch(
      SolanaService.getGameAccountAddress(identifier)
    );
  }

  static getSpendingAccountAddress(identifier: string) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("spending"), Buffer.from(identifier)],
      new PublicKey(IDL.address)
    )[0];
  }

  static getGameAccountAddress(identifier: string) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("game"), Buffer.from(identifier)],
      new PublicKey(IDL.address)
    )[0];
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

    return !!account?.owner.equals(new PublicKey(IDL.address));
  }
}
