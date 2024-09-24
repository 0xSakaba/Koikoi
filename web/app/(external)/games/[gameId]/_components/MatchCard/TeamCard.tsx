"use client";

import clsx from "clsx";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Team } from ".";
import { BetInfo } from "./BetInfo";

type TeamCardProps = Team & {
  onBet?: () => void;
  bettors: number;
  pool: number;
  prize: number;
  showBetInfo: boolean;
};

export function TeamCard({
  name,
  icon,
  onBet,
  bettors,
  pool,
  prize,
  showBetInfo,
}: TeamCardProps) {
  const [isMultipleLine, setIsMultipleLine] = useState(name.includes(" "));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    function checkMultipleLine() {
      if (!ref.current) return;
      const lineHeight = getComputedStyle(ref.current).lineHeight;
      const height = ref.current.clientHeight;
      setIsMultipleLine(height > parseInt(lineHeight.replace("px", "")));
    }

    window.addEventListener("resize", checkMultipleLine);
    checkMultipleLine();

    return () => {
      window.removeEventListener("resize", checkMultipleLine);
    };
  }, []);

  return (
    <div>
      <div className="relative mt-8 h-[19.5rem] w-full shadow-md flex flex-col justify-end items-center pb-2 rounded-xl border border-gray-200 gap-3">
        <div className="size-[6.25rem] aspect-square absolute -top-8 left-1/2 -translate-x-1/2">
          <Image
            src={icon}
            width={100}
            height={100}
            className="size-[6.25rem] aspect-square object-contain"
            alt={name}
          />
        </div>
        <div className="-mb-1 px-1 h-10 grid place-items-center text-center">
          <span
            className={clsx(
              "line-clamp-2 font-semibold text-black text-center",
              isMultipleLine ? "text-sm" : "text-base"
            )}
            ref={ref}
          >
            {name}
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
