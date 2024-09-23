"use client";

import { CSSProperties, MouseEventHandler } from "react";
import { DrawCard } from "./DrawCard";
import { ScoreDrawCard } from "./ScoreDrawCard";
import { TeamCard } from "./TeamCard";
import { Button } from "@/app/(external)/_components/Button";
import clsx from "clsx";

export type Team = {
  name: string;
  icon: string;
};

export type MatchCardProps = {
  title: "Bet Result" | "Your Betting" | "Your New Game" | string; // for hinting
  leftTeam: Team;
  rightTeam: Team;
  bettingTeam?: "left" | "right" | "draw";
  active?: boolean;
  className?: string;
  onCardClick?: MouseEventHandler<HTMLDivElement>;
} & (
  | {
      date: Date;
    }
  | {
      score: string;
    }
) &
  (
    | {
        action: "Get Result" | "Game Make" | string;
        onClick: () => void;
      }
    | {
        action?: never;
        onClick?: never;
      }
  );

// https://unused-css.com/tools/border-gradient-generator?p=22EYcwvALgxAZn8BoDMCBMAGBAWBAHAHggIwDcANgBSwCm1ArOjAAQYCkCNAHAOwBsAJiwCcAOjrso1JEhgBjYE15YJsrHSz8kTTkjHskQgIZwtRdOlYBKIA
const activeCardBorderStyle: CSSProperties = {
  background: `radial-gradient(circle at 100% 100%, #ffffff 0, #ffffff 17px, transparent 17px) 0% 0%/20px 20px no-repeat,
            radial-gradient(circle at 0 100%, #ffffff 0, #ffffff 17px, transparent 17px) 100% 0%/20px 20px no-repeat,
            radial-gradient(circle at 100% 0, #ffffff 0, #ffffff 17px, transparent 17px) 0% 100%/20px 20px no-repeat,
            radial-gradient(circle at 0 0, #ffffff 0, #ffffff 17px, transparent 17px) 100% 100%/20px 20px no-repeat,
            linear-gradient(#ffffff, #ffffff) 50% 50%/calc(100% - 6px) calc(100% - 40px) no-repeat,
            linear-gradient(#ffffff, #ffffff) 50% 50%/calc(100% - 40px) calc(100% - 6px) no-repeat,
            linear-gradient(#fee50f 20%, #fe876d 29.5%, #e33fcb 64%, #c454d3 83.5%, #39aff3 100%)`,
  padding: "7px",
  borderRadius: "20px",
  borderStyle: "solid",
};

export function MatchCard(props: MatchCardProps) {
  return (
    <div
      className={clsx(
        "mx-5 my-5 shadow-md bg-white rounded-[20px] p-[7px]",
        props.className
      )}
      onClick={props.onCardClick}
      style={props.active ? activeCardBorderStyle : {}}
    >
      <div className="mx-4 border-b text-center mt-3 mb-2">
        <h2 className="font-semibold text-2xl">{props.title}</h2>
        <div className="flex">
          <div className="border-b-2 border-[#A58BCF] flex-1"></div>
          <div className="border-b-2 border-[#35D3DE] flex-1"></div>
        </div>
      </div>
      {"date" in props ? (
        <div className="-mb-2 text-gray-300 text-lg font-semibold text-center">
          {Intl.DateTimeFormat("ja").format(props.date)}
        </div>
      ) : null}
      <div className="grid grid-cols-3 gap-3 items-end px-3 mb-5">
        <TeamCard bet={props.bettingTeam == "left"} {...props.leftTeam} />
        {"date" in props ? (
          <DrawCard bet={props.bettingTeam == "draw"} />
        ) : (
          <ScoreDrawCard
            bet={props.bettingTeam == "draw"}
            score={props.score}
          />
        )}
        <TeamCard bet={props.bettingTeam == "right"} {...props.rightTeam} />
      </div>
      {"action" in props ? (
        <div className="text-center mb-5">
          <Button
            className="text-white px-9 py-1 text-xl font-semibold h-10"
            onClick={props.onClick}
          >
            {props.action}
          </Button>
        </div>
      ) : (
        <div className="h-3" />
      )}
    </div>
  );
}
