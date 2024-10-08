"use client";

import SolanaLogo from "@/app/(external)/_assets/solana.png";
import { Button } from "@/app/(external)/_components/Button";
import { useSpendingBalance } from "@/app/(external)/_lib/solana/useSpendingBalance";
import { useUserInfo } from "@/app/(external)/_lib/useUserInfo";
import { usePrivy } from "@privy-io/react-auth";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import clsx from "clsx";
import Image from "next/image";
import { TopupPopup } from "../TopupPopup";
import Menu from "./assets/menu.svg";
import Plus from "./assets/plus.svg";
import WalletConnect from "./assets/walletconnect.svg";
import { useTopup } from "./useTopup";
import { useUpdateWallet } from "./useUpdateWallet";

export function Wallet({ className }: { className?: string }) {
  const { ready, login } = usePrivy();
  const userInfo = useUserInfo();
  const { setVisible } = useWalletModal();
  const { openTopup, topup, waitingTx, showTopup, setShowTopup } =
    useTopup(userInfo);
  const balance = useSpendingBalance();

  useUpdateWallet();

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
            {Intl.NumberFormat("en", { maximumFractionDigits: 3 }).format(
              balance || 0
            )}
          </div>
          <Button
            className="absolute right-0 top-0 size-9 text-white shadow-btn100 grid place-items-center"
            onClick={() => openTopup()}
          >
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
      {showTopup ? (
        <TopupPopup
          onClose={() => setShowTopup(false)}
          message="Topup your wallet with SOL"
          btn={waitingTx ? "Loading..." : "Confirm"}
          disabled={waitingTx}
          onConfirm={topup}
        />
      ) : null}
    </div>
  );
}
