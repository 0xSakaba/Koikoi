"use client";

import clsx from "clsx";
import { BetInfo } from "./BetInfo";
import { useElection } from "../../../../_components/ElectionProvider";

type DrawCardProps = {
  score: string;
  time: string;
  onBet?: () => void;
  bettors: number;
  pool: number;
  prize: number;
  showBetInfo: boolean;
};
export function DrawCard({
  score,
  time,
  onBet,
  bettors,
  pool,
  prize,
  showBetInfo,
}: DrawCardProps) {
  const isElection = useElection();

  return (
    <div className={isElection ? "opacity-0" : ""}>
      <div className="w-full text-center font-bold text-[2.5rem]">{score}</div>
      <div className="w-full text-center font-bold text-3xl text-purple-200 mb-2">
        {time}
      </div>
      <div className="relative mt-2 h-[15.5rem] w-full shadow-md flex flex-col justify-end items-center pb-2 rounded-xl border border-gray-200 gap-3">
        <div className="-mb-1 px-1 h-10 grid place-items-center text-center">
          <span
            className={clsx(
              "line-clamp-2 font-semibold text-black text-center"
            )}
          >
            Draw
          </span>
        </div>
        {showBetInfo ? (
          <BetInfo
            bettors={bettors}
            pool={pool}
            prize={prize}
            onClick={onBet}
          />
        ) : null}
      </div>
    </div>
  );
}
