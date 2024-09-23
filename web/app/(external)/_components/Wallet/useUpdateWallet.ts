import { useWallet } from "@solana/wallet-adapter-react";

export function useUpdateWallet() {
  const { wallet } = useWallet();
}
