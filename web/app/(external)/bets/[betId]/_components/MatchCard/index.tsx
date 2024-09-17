"use client";

import Image from "next/image";
import { DrawCard } from "./DrawCard";
import { TeamCard } from "./TeamCard";
import SolanaLogo from "@/app/(external)/_assets/solana-black.png";
import { BetPool } from "../BetPool";

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
      <BetPool poolSize={3} />
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
