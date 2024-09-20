import { useState } from "react";
import { placeBet } from "@/app/(external)/_actions/games/placeBet";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Transaction } from "@solana/web3.js";

type Option = "left" | "right" | "draw";
export function usePlaceBet(gameId: string) {
  const [status, setStatus] = useState<"pending" | "loading" | "finish">(
    "pending"
  );
  const [topupVisible, setTopupVisible] = useState(false);
  const { publicKey, sendTransaction } = useWallet();
  const { setVisible } = useWalletModal();
  const { connection } = useConnection();

  return {
    placeBet(option: Option, amount: number, topupAmount?: number) {
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
                from: publicKey,
                amount: topupAmount,
              }
            : undefined,
      }).then((res) => {
        if ("requireTopup" in res) {
          setTopupVisible(true);
        } else if ("transaction" in res) {
          const tx = Transaction.from(Buffer.from(res.transaction, "base64"));
          sendTransaction(tx, connection)
            .then(connection.confirmTransaction)
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
    reset() {
      setStatus("pending");
      setTopupVisible(false);
    },
  };
}
