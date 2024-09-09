import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Koikoi } from "../target/types/koikoi";
import { expect } from "chai";

describe("koikoi", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Koikoi as Program<Koikoi>;
  let koikoi: anchor.web3.PublicKey;

  before(async () => {
    [koikoi] = await anchor.web3.PublicKey.findProgramAddress(
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

      chai.assert(false, "Should have failed");
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
});
