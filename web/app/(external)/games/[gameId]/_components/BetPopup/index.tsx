"use client";

import SolanaLogo from "@/app/(external)/_assets/solana-black.png";
import { Button } from "@/app/(external)/_components/Button";
import { Team } from "@/app/(external)/_components/MatchCard";
import { Popup } from "@/app/(external)/_components/Popup";
import { useSpendingBalance } from "@/app/(external)/_lib/solana/useSpendingBalance";
import Image from "next/image";
import { useState } from "react";
import ArrowDown from "../assets/ArrowDown.svg";
import { DrawCard } from "../DrawCard";
import { TeamCard } from "../TeamCard";
import { AnimatedCheckbox } from "./AnimatedCheckbox";

type BetPopupProps = {
  leftTeam: Team;
  rightTeam: Team;
  bettingTeam: "left" | "right" | "draw";
  loading?: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
};

export function BetPopup(props: BetPopupProps) {
  const [agree, setAgree] = useState(false);
  const [size, setSize] = useState("1");
  const balance = useSpendingBalance();
  return (
    <Popup
      className="px-5 py-4 flex flex-col gap-6"
      onClose={() => !props.loading && props.onClose()}
    >
      <div className="grid grid-cols-3 gap-3 items-end mb-5">
        <TeamCard bet={props.bettingTeam == "left"} {...props.leftTeam} />
        <DrawCard bet={props.bettingTeam == "draw"} />
        <TeamCard bet={props.bettingTeam == "right"} {...props.rightTeam} />
      </div>
      <div className="flex gap-2 items-center max-w-full">
        <div className="size-11 rounded-full grid place-items-center">
          <Image
            src={SolanaLogo.src}
            alt="Solana Logo"
            width={45}
            height={45}
          />
        </div>
        <span className="text-2xl font-semibold flex-shrink-0">Bet size</span>
        <div className="flex-grow">
          <input
            type="number"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            min={0.01}
            className="w-full rounded-2xl border-2 border-gray-300 text-center py-1.5 text-2xl font-semibold"
          />
        </div>
        <span className="text-2xl font-semibold">SOL</span>
      </div>
      <div>
        <div className="flex">
          <div className="border-b-2 border-[#A58BCF] flex-1"></div>
          <div className="border-b-2 border-[#35D3DE] flex-1"></div>
        </div>
        <div className="text-2xl font-semibold text-center">Your SOL</div>
        <div className="flex">
          <div className="border-b-2 border-[#A58BCF] flex-1"></div>
          <div className="border-b-2 border-[#35D3DE] flex-1"></div>
        </div>
      </div>
      <div>
        <div className="grid px-9 grid-cols-[auto,1fr] gap-2 text-purple-200 items-center text-lg font-semibold">
          <div>Before</div>
          <div className="rounded bg-purple-100 text-center py-1">
            {Intl.NumberFormat("en", { maximumFractionDigits: 3 }).format(
              balance
            )}
          </div>
          <div></div>
          <div className="flex justify-center">
            <ArrowDown />
          </div>
          <div>After</div>
          <div className="rounded bg-purple-100 text-center py-1">
            {Intl.NumberFormat("en", { maximumFractionDigits: 3 }).format(
              Math.max(balance - Number(size), 0)
            )}
          </div>
        </div>
        {balance < Number(size) ? (
          <div className="text-center text-red-200 text-xs">
            You will need to top up your account when you confirm this bet.
          </div>
        ) : null}
      </div>
      <div className="mb-4">
        <div className="bg-[#EFEEF4] px-1.5 py-3 text-purple-200 font-semibold pl-7 mb-5">
          <ul className="list-disc">
            <li>The group creator will automatically bet the bet size.</li>
            <li>
              After the result is determined, sol will be refunded according to
              the odds.
            </li>
            <li>
              If there are no other betters besides the group creator, the bet
              amount will be refunded in full.
            </li>
            <li>Cancellation is not possible midway.</li>
          </ul>
        </div>
        <div className="flex items-center justify-center text-red-200 text-lg font-semibold gap-2 mb-6">
          <AnimatedCheckbox
            checked={agree}
            onClick={() => setAgree((e) => !e)}
          />
          <span>Confirm and Agree</span>
        </div>
        <Button
          className="text-white w-full py-1.5 text-xl font-semibold max-w-44 block mx-auto"
          disabled={
            isNaN(Number(size)) || Number(size) === 0 || !agree || props.loading
          }
          onClick={() => props.onConfirm(Number(size))}
        >
          {props.loading ? "Loading..." : "Confirm"}
        </Button>
      </div>
    </Popup>
  );
}
