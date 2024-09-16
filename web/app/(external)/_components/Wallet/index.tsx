"use client";

import clsx from "clsx";
import { Button } from "../Button";
import Image from "next/image";
import SolanaLogo from "./assets/solana.png";
import Plus from "./assets/plus.svg";
import WalletConnect from "./assets/walletconnect.svg";
import Menu from "./assets/menu.svg";

export function Wallet({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        className,
        "h-14 border-b border-b-gray-200 flex justify-between pl-2 pr-1 px-2 bg-[#F2F3F8]"
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
          <div className="rounded bg-gray-100 pl-1.5 pr-[1.625rem] py-1 text-xl font-semibold text-right">
            1234567.123456
          </div>
          <Button className="absolute right-0 top-0 size-9 text-white shadow-lg grid place-items-center">
            <Plus />
          </Button>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <button className="size-8 text-solana-light">
          <WalletConnect />
        </button>
        <button className="size-8 text-solana-light">
          <Menu />
        </button>
      </div>
    </div>
  );
}
