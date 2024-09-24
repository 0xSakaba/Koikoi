"use client";

import { formatGameResult } from "@/app/(external)/_lib/formatGameData";
import { BetPool } from "../BetPool";
import { DrawCard } from "./DrawCard";
import { TeamCard } from "./TeamCard";
import Live from "./assets/Live.svg";

export type Team = {
  name: string;
  icon: string;
};

export type StaticMatchCardProps = {
  leftTeam: Team;
  rightTeam: Team;
  date: string;
  time: string;
  score: string;
  current?: string;
  result: GameResult;
  onBet(option: "left" | "right" | "draw"): void;
};

type GameResult = {
  options: number;
  pool: string;
  bettors: string[][];
  betAmounts: string[][];
};

export function StaticMatchCard(props: StaticMatchCardProps) {
  const betInfo = formatGameResult(props.result);
  return (
    <div className="mx-5 my-5 shadow-md bg-white rounded-[20px] p-[7px] flex flex-col items-center gap-3 relative">
      <div className="text-gray-300 text-lg font-semibold text-center">
        {props.date}
      </div>
      <BetPool poolSize={betInfo.pool} />
      <div className="grid grid-cols-3 gap-3 items-end px-3 mb-10 w-full">
        <TeamCard {...props.leftTeam} {...betInfo.leftTeam} showBetInfo />
        <DrawCard
          score={props.score}
          time={props.time}
          {...betInfo.draw}
          showBetInfo
        />
        <TeamCard {...props.rightTeam} {...betInfo.rightTeam} showBetInfo />
      </div>
      {props.current ? (
        <div className="rounded-lg bg-red-200 text-white flex flex-col items-center justify-center top-1.5 right-1.5 px-1.5 pb-0.5 absolute">
          <Live className="-mb-0.5" />
          <span className="text-xs -mt-1">{props.current}</span>
        </div>
      ) : null}
    </div>
  );
}
