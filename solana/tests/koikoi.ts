import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { Koikoi } from "../target/types/koikoi";
import { expect, assert, use } from "chai";

describe("koikoi", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Koikoi as Program<Koikoi>;
  let koikoi: anchor.web3.PublicKey;
  let spending: anchor.web3.PublicKey;
  const user = anchor.web3.Keypair.generate();
  const identifier = "Test User";

  before(async () => {
    [koikoi] = anchor.web3.PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("koikoi")],
      program.programId
    );
  });

  it("Can initialize a new admin account", async () => {
    const tx = await program.methods
      .initialize()
      .accounts({
        koikoi,
      })
      .rpc();
    console.info("Initialization succeeded");
  });

  it("Can update the key of a new admin account", async () => {
    const newAdmin = anchor.web3.Keypair.generate();
    console.log("Random new admin", newAdmin.publicKey.toBase58());

    const tx = await program.methods
      .updateAdmin(newAdmin.publicKey)
      .accounts({
        koikoi,
      })
      .rpc();
    console.info("Update succeeded");

    try {
      await program.methods
        .updateAdmin(provider.wallet.publicKey)
        .accounts({
          koikoi,
        })
        .rpc();

      assert(false, "Should have failed");
    } catch (err) {
      expect(err).to.be.instanceOf(anchor.AnchorError);
      console.info("Update constraint succeeded");
    }

    // update back
    await program.methods
      .updateAdmin(provider.wallet.publicKey)
      .accounts({
        koikoi,
        signer: newAdmin.publicKey,
      })
      .signers([newAdmin])
      .rpc();
    console.info("Update back succeeded");
  });

  it("Can create a new spending account", async () => {
    console.log("Random user", user.publicKey.toBase58());

    [spending] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("spending"),
        anchor.utils.bytes.utf8.encode(identifier),
      ],
      program.programId
    );

    await program.methods
      .createSpendingAccount(identifier, user.publicKey)
      .accounts({
        koikoi,
        spending,
        user: provider.wallet.publicKey, // if the account is created by service, skip check for user
      })
      .rpc();
    console.info("Create succeeded");
  });

  it("Can create a new spending account from user given service partially signed tx", async () => {
    const user = anchor.web3.Keypair.generate();
    console.log("Random user", user.publicKey.toBase58());

    const identifier = "Test User 2";
    const [spending] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("spending"),
        anchor.utils.bytes.utf8.encode(identifier),
      ],
      program.programId
    );

    const tx = await program.methods
      .createSpendingAccount(identifier, user.publicKey)
      .accounts({
        koikoi,
        spending,
        user: user.publicKey, // if the account is created by user, need to provide user public key
        service: provider.wallet.publicKey,
      })
      .transaction();

    tx.recentBlockhash = (
      await provider.connection.getLatestBlockhash()
    ).blockhash;
    tx.feePayer = provider.wallet.publicKey;

    const serviceSignedTx = await provider.wallet.signTransaction(tx);
    assert(
      serviceSignedTx.verifySignatures(false),
      "Failed to verify signature"
    );

    // server will pass the partially signed tx to user
    const serializedTx = serviceSignedTx.serialize({
      requireAllSignatures: false,
    });

    // user will recover the tx and sign it
    const deserializedTx = anchor.web3.Transaction.from(serializedTx);
    deserializedTx.partialSign(user);

    provider.connection.sendRawTransaction(deserializedTx.serialize());

    console.info("Create succeeded");
  });

  it("Can accept deposit from any source", async () => {
    const signature = await provider.connection.requestAirdrop(
      spending,
      100 * 1e9
    );
    const latestBlockHash = await provider.connection.getLatestBlockhash();
    await provider.connection.confirmTransaction({
      signature,
      ...latestBlockHash,
    });
  });

  it("Can withdraw from spending account", async () => {
    // as service
    await program.methods
      .withdrawFromSpendingAccount(identifier, new BN(50 * 1e9))
      .accounts({
        koikoi,
        spending,
        receiver: user.publicKey,
        feeReceiver: provider.wallet.publicKey,
        signer: provider.wallet.publicKey,
        system_program: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.info("Service withdraw succeeded");

    // as user
    await program.methods
      .withdrawFromSpendingAccount(identifier, new BN(50 * 1e9))
      .accounts({
        koikoi,
        spending,
        receiver: user.publicKey,
        feeReceiver: provider.wallet.publicKey,
        signer: user.publicKey,
        system_program: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();
    console.info("User withdraw succeeded");
  });

  it("Can update the owner of a spending account", async () => {
    const newUser = anchor.web3.Keypair.generate();
    console.log("Random new user", newUser.publicKey.toBase58());

    // as user
    await program.methods
      .updateSpendingAccountOwner(identifier, newUser.publicKey)
      .accounts({
        koikoi,
        spending,
        signer: user.publicKey,
      })
      .signers([user])
      .rpc();
    console.info("User update succeeded");

    // as service
    await program.methods
      .updateSpendingAccountOwner(identifier, user.publicKey)
      .accounts({
        koikoi,
        spending,
        signer: provider.wallet.publicKey,
      })
      .rpc();
    console.info("Service update succeeded");
  });
});
