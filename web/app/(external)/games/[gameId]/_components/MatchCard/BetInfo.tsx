"use client";

import SolanaLogo from "@/app/(external)/_assets/solana-black.png";
import { Button } from "@/app/(external)/_components/Button";
import Image from "next/image";
import Bettor from "./assets/Bettor.svg";
import Prize from "./assets/Prize.svg";

export function BetInfo({
  bettors,
  pool: amount,
  prize,
  onClick,
}: {
  bettors: number;
  pool: number;
  prize: number;
  onClick?: () => void;
}) {
  return (
    <>
      <div className="px-3 w-full">
        <div className="rounded-md bg-purple-100 flex justify-between items-center w-full text-purple-200 text-lg pl-1 pr-2 py-1">
          <Bettor />
          <span>{bettors}</span>
        </div>
      </div>
      <div className="px-3 w-full">
        <div className="rounded-md bg-purple-100 flex justify-between items-center w-full text-purple-200 text-lg pl-1 pr-2 py-1">
          <div className="size-[1.875rem] rounded-full grid place-items-center">
            <Image
              src={SolanaLogo.src}
              alt="Pool size (SOL)"
              width={30}
              height={30}
            />
          </div>
          <span>
            {Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(
              amount
            )}
          </span>
        </div>
      </div>
      <div className="px-3 w-full">
        <div className="rounded-md bg-purple-100 flex justify-between items-center w-full text-purple-200 text-lg pl-1 pr-2 py-1">
          <Prize />
          <span>
            {Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(
              prize
            )}
          </span>
        </div>
      </div>
      {onClick ? (
        <div className="px-2 pt-1 w-full">
          <Button
            className="text-white w-full py-0.5 text-lg font-semibold"
            onClick={onClick}
          >
            Bet
          </Button>
        </div>
      ) : (
        <div className="px-2 pt-1 w-full h-4"></div>
      )}
    </>
  );
}
