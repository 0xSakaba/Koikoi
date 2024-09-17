"use client";

import { Team } from "@/app/(external)/_components/MatchCard";
import Bet from "@/app/(external)/_components/MatchCard/assets/Bet.png";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { match } from "ts-pattern";

function getVariant(bet: boolean) {
  return match(bet)
    .with(true, () => "bg-gradient-to-b from-solana-light to-solana-dark")
    .with(false, () => "border border-gray-200")
    .exhaustive();
}

export function TeamCard({ name, icon, bet }: Team & { bet?: boolean }) {
  const [isMultipleLine, setIsMultipleLine] = useState(name.includes(" "));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    function checkMultipleLine() {
      if (!ref.current) return;
      const lineHeight = getComputedStyle(ref.current).lineHeight;
      const height = ref.current.clientHeight;
      setIsMultipleLine(height > parseInt(lineHeight.replace("px", "")));
      console.log(
        height,
        lineHeight,
        height > parseInt(lineHeight.replace("px", ""))
      );
    }

    window.addEventListener("resize", checkMultipleLine);
    checkMultipleLine();

    return () => {
      window.removeEventListener("resize", checkMultipleLine);
    };
  }, []);

  return (
    <div>
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
          "relative mt-8 h-[7.625rem] w-full shadow-md flex flex-col justify-end items-center pb-2 r",
          getVariant(!!bet)
        )}
      >
        <div className="size-[6.25rem] aspect-square absolute -top-8 left-1/2 -translate-x-1/2">
          <Image
            src={icon}
            width={100}
            height={100}
            className="size-[6.25rem] aspect-square object-contain"
            alt={name}
          />
        </div>
        <div className="px-1 h-10 grid place-items-center text-center">
          <span
            className={clsx(
              "line-clamp-2 font-semibold",
              bet ? "text-white" : "text-black",
              isMultipleLine ? "text-sm" : "text-base"
            )}
            ref={ref}
          >
            {name}
          </span>
        </div>
      </div>
    </div>
  );
}
