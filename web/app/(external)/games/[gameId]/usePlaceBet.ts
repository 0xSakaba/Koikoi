import { useState } from "react";
import { placeBet } from "@/app/(external)/_actions/games/placeBet";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Transaction } from "@solana/web3.js";

export function usePlaceBet(gameId: string) {
  const [status, setStatus] = useState<"pending" | "loading" | "finish">(
    "pending"
  );
  const [topupVisible, setTopupVisible] = useState(false);
  const [amountCache, setAmountCache] = useState(0);
  const [minTopup, setMinTopup] = useState(0);
  const { publicKey, sendTransaction } = useWallet();
  const { setVisible } = useWalletModal();
  const { connection } = useConnection();

  return {
    placeBet(option: string, amount: number, topupAmount?: number) {
      if (topupAmount !== undefined && !publicKey) {
        return setVisible(true);
      }

      setStatus("loading");
      placeBet({
        gameId: gameId,
        teamId: option,
        amount,
        topup:
          topupAmount && publicKey
            ? {
                from: publicKey.toBase58(),
                amount: topupAmount,
              }
            : undefined,
      }).then((res) => {
        if ("requireTopup" in res) {
          setAmountCache(amount);
          setMinTopup(res.requireTopup);
          setTopupVisible(true);
        } else if ("transaction" in res) {
          const tx = Transaction.from(Buffer.from(res.transaction, "base64"));
          sendTransaction(tx, connection)
            .then(async (sig) => {
              const block = await connection.getLatestBlockhash();
              return connection.confirmTransaction({
                signature: sig,
                ...block,
              });
            })
            .then(() => {
              setStatus("finish");
            });
        } else {
          connection
            .getLatestBlockhash()
            .then((block) => {
              return connection.confirmTransaction({
                ...block,
                signature: res.signature,
              });
            })
            .then(() => {
              setStatus("finish");
            });
        }
      });
    },
    topupVisible,
    status,
    amountCache,
    minTopup,
    reset() {
      setStatus("pending");
      setTopupVisible(false);
      setAmountCache(0);
    },
  };
}
