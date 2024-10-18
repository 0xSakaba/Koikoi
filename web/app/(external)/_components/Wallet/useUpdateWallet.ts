import {
  getLoginMessage,
  setWallet,
} from "@/app/(external)/_actions/users/setWallet";
import { useUserInfo } from "@/app/(external)/_lib/useUserInfo";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { useEffect, useState } from "react";

export function useUpdateWallet() {
  const { publicKey, signMessage } = useWallet();
  const [login, setLogin] = useState(false);
  const userInfo = useUserInfo();

  useEffect(() => {
    if (!publicKey || !userInfo || login) return;

    if (publicKey.toBase58() !== userInfo.wallet) {
      setLogin(true);

      try {
        signLoginMessage();
      } catch (err) {
        console.log(err);
        setLogin(false);
      }
    }

    async function signLoginMessage() {
      if (!publicKey || !signMessage) return;
      const loginChallenge = await getLoginMessage(publicKey.toBase58());
      const encodedMessage = new TextEncoder().encode(loginChallenge.message);
      const signature = await signMessage(encodedMessage);
      const signatureString = bs58.encode(signature);

      await setWallet(
        publicKey.toBase58(),
        loginChallenge.time,
        loginChallenge.nonce,
        signatureString
      );
    }
  }, [publicKey, userInfo, login, signMessage]);
}
