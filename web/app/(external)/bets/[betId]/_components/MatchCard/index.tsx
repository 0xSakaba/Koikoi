"use client";

import Image from "next/image";
import { DrawCard } from "./DrawCard";
import { TeamCard } from "./TeamCard";
import SolanaLogo from "@/app/(external)/_assets/solana-black.png";

export type Team = {
  name: string;
  icon: string;
};

export type MatchCardProps = {
  title: "Bet Result" | "Your Betting" | "Your New Game" | string; // for hinting
  leftTeam: Team;
  rightTeam: Team;
  date: string;
  time: string;
  poolSize: number;
  score: string;
  onBet(option: "left" | "right" | "draw"): void;
};

export function MatchCard(props: MatchCardProps) {
  return (
    <div className="mx-5 my-5 shadow-md bg-white rounded-[20px] p-[7px] flex flex-col items-center gap-3">
      <div className="text-gray-300 text-lg font-semibold text-center">
        {props.date}
      </div>
      <div className="h-12 w-56 rounded-md bg-gradient-to-r from-[#fff006] via-[#fe2fc6] to-[#2abbf7] flex items-center justify-center gap-2 text-white">
        <div className="size-9 rounded-full grid place-items-center">
          <Image
            src={SolanaLogo.src}
            alt="Solana Logo"
            width={37}
            height={37}
          />
        </div>
        <span className="text-2xl font-semibold">
          Bet size {props.poolSize} SOL
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 items-end px-3 mb-10">
        <TeamCard {...props.leftTeam} onBet={() => props.onBet("left")} />
        <DrawCard
          score={props.score}
          time={props.time}
          onBet={() => props.onBet("draw")}
        />
        <TeamCard {...props.rightTeam} onBet={() => props.onBet("right")} />
      </div>
    </div>
  );
}
