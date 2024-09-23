import { useWallet } from "@solana/wallet-adapter-react";
import { useUserInfo } from "@/app/(external)/_lib/useUserInfo";
import { useEffect } from "react";
import { setWallet } from "@/app/(external)/_actions/users/setWallet";

export function useUpdateWallet() {
  const { publicKey } = useWallet();
  const userInfo = useUserInfo();

  useEffect(() => {
    console.log(publicKey, userInfo);
    if (!publicKey || !userInfo) return;

    if (publicKey.toBase58() !== userInfo.wallet) {
      setWallet(publicKey.toBase58());
    }
  }, [publicKey, userInfo]);
}
