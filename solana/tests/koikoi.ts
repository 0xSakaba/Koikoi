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
  const userIdentifier = "Test User";
  const gameIdentifier = "Test Game";

  before(async () => {
    [koikoi] = anchor.web3.PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("koikoi")],
      program.programId
    );
  });

  it("Can initialize a new admin account", async () => {
    const tx = await program.methods.initialize().rpc();
    console.info("Initialization succeeded");
  });

  it("Can update the key of a new admin account", async () => {
    const newAdmin = anchor.web3.Keypair.generate();
    console.log("Random new admin", newAdmin.publicKey.toBase58());

    const tx = await program.methods
      .updateConfig(newAdmin.publicKey, 5_000, 30_000)
      .accounts({
        koikoi,
      })
      .rpc();
    console.info("Update succeeded");

    expect(
      await program.methods
        .updateConfig(provider.wallet.publicKey, 5_000, 30_000)
        .accounts({
          koikoi,
        })
        .rpc()
        .catch((err) => err)
    ).to.be.instanceOf(anchor.AnchorError, "Should block unauthorized update");

    // update back
    await program.methods
      .updateConfig(provider.wallet.publicKey, 5_000, 30_000)
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

    await program.methods
      .createSpendingAccount(userIdentifier, user.publicKey)
      .accounts({
        koikoi,
        user: provider.wallet.publicKey, // if the account is created by service, skip check for user
      })
      .rpc();
    console.info("Create succeeded");
  });

  it("Can create a new spending account from user given service partially signed tx", async () => {
    const user = anchor.web3.Keypair.generate();
    console.log("Random user", user.publicKey.toBase58());

    const identifier = "Random User";

    const tx = await program.methods
      .createSpendingAccount(identifier, user.publicKey)
      .accounts({
        koikoi,
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

    await provider.connection.sendRawTransaction(deserializedTx.serialize());

    console.info("Create succeeded");
  });

  it("Can accept deposit from any source", async () => {
    [spending] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("spending"),
        anchor.utils.bytes.utf8.encode(userIdentifier),
      ],
      program.programId
    );

    const signature = await provider.connection.requestAirdrop(
      spending,
      1000 * 1e9
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
      .withdrawFromSpendingAccount(userIdentifier, new BN(50 * 1e9))
      .accounts({
        koikoi,
        receiver: user.publicKey,
        feeReceiver: provider.wallet.publicKey,
        signer: provider.wallet.publicKey,
      })
      .rpc();

    console.info("Service withdraw succeeded");

    // as user
    const tx = await program.methods
      .withdrawFromSpendingAccount(userIdentifier, new BN(50 * 1e9))
      .accounts({
        koikoi,
        receiver: user.publicKey,
        feeReceiver: provider.wallet.publicKey,
        signer: user.publicKey,
      })
      .transaction();

    tx.recentBlockhash = (
      await provider.connection.getLatestBlockhash()
    ).blockhash;
    tx.feePayer = user.publicKey;

    tx.sign(user);
    await provider.connection.sendRawTransaction(tx.serialize());
    console.info("User withdraw succeeded");
  });

  it("Can update the owner of a spending account", async () => {
    const newUser = anchor.web3.Keypair.generate();
    console.log("Random new user", newUser.publicKey.toBase58());

    // as user
    await program.methods
      .updateSpendingAccountOwner(userIdentifier, newUser.publicKey)
      .accounts({
        koikoi,
        signer: user.publicKey,
      })
      .signers([user])
      .rpc();
    console.info("User update succeeded");

    // as service
    await program.methods
      .updateSpendingAccountOwner(userIdentifier, user.publicKey)
      .accounts({
        koikoi,
        signer: provider.wallet.publicKey,
      })
      .rpc();
    console.info("Service update succeeded");
  });

  it("Can make a game", async () => {
    await program.methods
      .makeGame(gameIdentifier, 3)
      .accounts({
        koikoi,
        service: provider.wallet.publicKey,
      })
      .rpc();
    console.info("Game creation succeeded");
  });

  it("Can place a bet", async () => {
    await program.methods
      .placeBet(gameIdentifier, userIdentifier, 0, new BN(1e9))
      .accounts({
        koikoi,
        service: provider.wallet.publicKey,
      })
      .rpc();

    console.info("Server side bet placement succeeded");

    const tx = await program.methods
      .placeBet(gameIdentifier, userIdentifier, 0, new BN(1e9))
      .accounts({
        koikoi,
        service: provider.wallet.publicKey,
        signer: user.publicKey,
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

    await provider.connection.sendRawTransaction(deserializedTx.serialize());

    console.info("User side bet placement succeeded");
  });

  it("Can close a game that has only one bettor", async () => {
    await program.methods
      .closeGame(gameIdentifier, 0)
      .accounts({
        koikoi,
        service: provider.wallet.publicKey,
      })
      .remainingAccounts([
        { pubkey: spending, isSigner: false, isWritable: true },
      ])
      .rpc();

    console.info("One bettor game closure succeeded");
  });

  it("Can close a game that has no result", async () => {
    await program.methods
      .makeGame(gameIdentifier, 3)
      .accounts({
        koikoi,
        service: provider.wallet.publicKey,
      })
      .rpc();

    await program.methods
      .placeBet(gameIdentifier, userIdentifier, 0, new BN(1e9))
      .accounts({
        koikoi,
        service: provider.wallet.publicKey,
      })
      .rpc();

    await program.methods
      .closeGame(gameIdentifier, 3)
      .accounts({
        koikoi,
        service: provider.wallet.publicKey,
      })
      .remainingAccounts([
        { pubkey: spending, isSigner: false, isWritable: true },
      ])
      .rpc();

    console.info("No result game closure succeeded");
  });

  it("Can close a game that has no winner", async () => {
    await program.methods
      .makeGame(gameIdentifier, 3)
      .accounts({
        koikoi,
        service: provider.wallet.publicKey,
      })
      .rpc();

    await program.methods
      .placeBet(gameIdentifier, userIdentifier, 0, new BN(1e9))
      .accounts({
        koikoi,
        service: provider.wallet.publicKey,
      })
      .rpc();

    await program.methods
      .closeGame(gameIdentifier, 1)
      .accounts({
        koikoi,
        service: provider.wallet.publicKey,
      })
      .remainingAccounts([
        { pubkey: spending, isSigner: false, isWritable: true },
      ])
      .rpc();

    console.info("No winner game closure succeeded");
  });

  it("Can close a normal game", async () => {
    // prepare users
    const users = new Array(3)
      .fill(0)
      .map(() => anchor.web3.Keypair.generate());
    const spendings = users.map(
      (_, i) =>
        anchor.web3.PublicKey.findProgramAddressSync(
          [
            anchor.utils.bytes.utf8.encode("spending"),
            anchor.utils.bytes.utf8.encode(`Test User ${i}`),
          ],
          program.programId
        )[0]
    );

    await Promise.all(
      users.map((user, i) =>
        program.methods
          .createSpendingAccount(`Test User ${i}`, user.publicKey)
          .accounts({
            koikoi,
            user: provider.wallet.publicKey, // if the account is created by service, skip check for user
          })
          .rpc()
      )
    );

    await Promise.all(
      spendings.map(async (spending) => {
        const signature = await provider.connection.requestAirdrop(
          spending,
          1 * 1e9
        );
        const latestBlockHash = await provider.connection.getLatestBlockhash();
        await provider.connection.confirmTransaction({
          signature,
          ...latestBlockHash,
        });
      })
    );

    // simulate game
    await program.methods
      .makeGame(gameIdentifier, 3)
      .accounts({
        koikoi,
        service: provider.wallet.publicKey,
      })
      .rpc();

    const beforeAccountInfos = await Promise.all(
      spendings.map((spending) => provider.connection.getAccountInfo(spending))
    );

    console.info(
      "Original balances:\n" +
        beforeAccountInfos
          .map((info, i) => `User ${i}: ${info.lamports} lamports`)
          .join("\n")
    );

    await Promise.all(
      users.map((user, i) =>
        program.methods
          .placeBet(gameIdentifier, `Test User ${i}`, i, new BN(1e9))
          .accounts({
            koikoi,
            service: provider.wallet.publicKey,
          })
          .rpc()
      )
    );

    // close game
    await program.methods
      .closeGame(gameIdentifier, 2)
      .accounts({
        koikoi,
        service: provider.wallet.publicKey,
      })
      .remainingAccounts(
        spendings.map((spending) => ({
          pubkey: spending,
          isSigner: false,
          isWritable: true,
        }))
      )
      .rpc();

    const afterAccountInfos = await Promise.all(
      spendings.map((spending) => provider.connection.getAccountInfo(spending))
    );

    console.info("Game closure succeeded");
    console.info(
      "Remaining balances:\n" +
        afterAccountInfos
          .map((info, i) => `User ${i}: ${info.lamports} lamports`)
          .join("\n")
    );
  });
});
