"use client";

import Bet from "@/app/(external)/_components/MatchCard/assets/Bet.png";
import clsx from "clsx";
import Image from "next/image";
import { match } from "ts-pattern";
import { useElection } from "../../../_components/ElectionProvider";

function getVariant(bet: boolean) {
  return match(bet)
    .with(true, () => "bg-gradient-to-b from-solana-light to-solana-dark")
    .with(false, () => "border border-gray-200")
    .exhaustive();
}

export function DrawCard({ bet }: { bet?: boolean }) {
  const isElection = useElection();
  return (
    <div className={isElection ? "opacity-0" : ""}>
      {bet ? (
        <Image
          src={Bet.src}
          width={62}
          height={28}
          className="mx-auto w-[3.875rem] h-7"
          alt="Betting"
        />
      ) : (
        <div className="h-7" />
      )}
      <div
        className={clsx(
          "relative h-[7.625rem] w-full shadow-md flex flex-col justify-end items-center pb-2 rounded-lg",
          getVariant(!!bet)
        )}
      >
        <div className="w-[6.25rem] h-[6.25rem] absolute -top-8 left-1/2 -translate-x-1/2"></div>
        <div className="px-1 h-10 grid place-items-center text-center">
          <span
            className={clsx(
              "font-semibold text-lg",
              bet ? "text-white" : "text-black"
            )}
          >
            Draw
          </span>
        </div>
      </div>
    </div>
  );
}
