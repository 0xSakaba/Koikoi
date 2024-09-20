"use client";

import { getUserInfo } from "@/app/(external)/_actions/users/getUserInfo";
import { usePrivy } from "@privy-io/react-auth";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useCallback, useState } from "react";

export function useTopup(userInfo: Awaited<ReturnType<typeof getUserInfo>>) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [waitingTx, setWaitingTx] = useState(false);
  const [showTopup, setShowTopup] = useState(false);
  const { authenticated, login } = usePrivy();
  const { setVisible } = useWalletModal();

  const topup = useCallback(
    (amount: number) => {
      if (!userInfo?.spendingAccount || !publicKey) return;

      const tx = new Transaction();
      tx.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(userInfo.spendingAccount),
          lamports: amount * 1e9,
        })
      );

      sendTransaction(tx, connection)
        .then(async (sig) => {
          setWaitingTx(true);
          const latestBlockHash = await connection.getLatestBlockhash();
          return await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: sig,
          });
        })
        .then(() => {
          setWaitingTx(false);
          setShowTopup(false);
        });
    },
    [userInfo?.spendingAccount, publicKey, sendTransaction, connection]
  );

  const openTopup = useCallback(() => {
    if (!authenticated) return login();
    if (!publicKey) return setVisible(true);
    setShowTopup(true);
  }, [authenticated, login, publicKey, setVisible]);

  return {
    topup,
    showTopup,
    setShowTopup,
    waitingTx,
    openTopup,
  };
}
