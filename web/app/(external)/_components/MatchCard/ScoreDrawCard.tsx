"use client";

import clsx from "clsx";
import Image from "next/image";
import { Button } from "../Button";
import Bet from "./assets/Bet.png";

export function ScoreDrawCard({
  score,
  bet,
}: {
  score: string;
  bet?: boolean;
}) {
  return (
    <div>
      <div className="w-full text-center font-bold text-[2.5rem]">{score}</div>
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
      <Button
        className="relative h-14 w-full shadow-md flex flex-col justify-end items-center pb-2"
        variant={bet ? "primary" : "secondary"}
      >
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
      </Button>
    </div>
  );
}
