"use client";

import { getUserInfo } from "@/app/(external)/_actions/users/getUserInfo";
import SolanaLogo from "@/app/(external)/_assets/solana.png";
import { Button } from "@/app/(external)/_components/Button";
import { usePrivy } from "@privy-io/react-auth";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";
import Menu from "./assets/menu.svg";
import Plus from "./assets/plus.svg";
import WalletConnect from "./assets/walletconnect.svg";
import { useWalletModal, WalletModal } from "@solana/wallet-adapter-react-ui";

export function Wallet({ className }: { className?: string }) {
  const { ready, authenticated, login, getAccessToken } = usePrivy();
  const [userInfo, setUserInfo] =
    useState<Awaited<ReturnType<typeof getUserInfo>>>();
  const [balance, setBalance] = useState<number>();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();

  useEffect(() => {
    if (authenticated) {
      getAccessToken().then(getUserInfo).then(setUserInfo);
      const i = setInterval(updateBalance, 10_000);
      return () => clearInterval(i);
    }

    function updateBalance() {
      if (userInfo?.spendingAccount) {
        connection
          .getBalance(new PublicKey(userInfo.spendingAccount))
          .then((e) => setBalance(e / 1e9));
      }
    }
  }, [authenticated, getAccessToken]);

  return (
    <div
      className={clsx(
        className,
        "h-14 border-b border-b-gray-200 flex justify-between pl-2 pr-1 px-2 bg-[#F2F3F8] sticky top-0 z-40"
      )}
    >
      <div className="flex gap-2 items-center min-w-64">
        <Image
          src={SolanaLogo.src}
          alt="Solana"
          width={34}
          height={30}
          className="w-[2.125rem] h-[1.875rem]"
        />
        <div className="flex-grow pr-4 relative">
          <div
            className="rounded bg-gray-100 pl-1.5 pr-[1.625rem] py-1 text-xl font-semibold text-right"
            title={userInfo?.spendingAccount}
          >
            {Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(
              balance || 0
            )}
          </div>
          <Button className="absolute right-0 top-0 size-9 text-white shadow-btn100 grid place-items-center">
            <Plus />
          </Button>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <button
          className="size-8 text-solana-light"
          onClick={() => setVisible(true)}
        >
          <WalletConnect />
        </button>
        <button
          className="size-8 text-solana-light"
          title={!ready ? "Not ready" : ""}
          onClick={login}
        >
          <Menu />
        </button>
      </div>
    </div>
  );
}
