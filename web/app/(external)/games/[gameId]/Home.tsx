"use client";

import { Prisma } from "@prisma/client";
import { useState } from "react";
import { TopupPopup } from "@/app/(external)/_components/TopupPopup";
import { BetPopup } from "./_components/BetPopup";
import { CompletePopup } from "./_components/CompletePopup";
import { MatchCard } from "./_components/MatchCard";
import { usePlaceBet } from "./usePlaceBet";

type GameHomeProps = {
  game: Prisma.GameGetPayload<{
    include: {
      match: {
        include: {
          teams: true;
        };
      };
    };
  }>;
};
export default function Home(props: GameHomeProps) {
  const [betOption, setBetOption] = useState<"left" | "right" | "draw">();
  const { topupVisible, status, placeBet, reset, amountCache, minTopup } =
    usePlaceBet(props.game.id);

  const teams = props.game.match.teams.sort((a, b) => (a.id > b.id ? 1 : -1));
  const date = Intl.DateTimeFormat("ja", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "shortOffset",
  }).format(props.game.match.date);
  const teamId =
    betOption === "draw"
      ? "DRAW"
      : betOption === "left"
      ? teams[0].id
      : betOption === "right"
      ? teams[1].id
      : undefined;
  return (
    <div>
      <MatchCard
        leftTeam={{
          name: teams[0].name,
          icon: teams[0].icon,
        }}
        rightTeam={{
          name: teams[1].name,
          icon: teams[1].icon,
        }}
        score={"TBD"}
        date={date}
        time={""}
        gameId={props.game.id}
        inited={props.game.inited}
        onBet={setBetOption}
      />
      {!!betOption ? (
        <BetPopup
          onClose={() => {
            setBetOption(undefined);
            reset();
          }}
          leftTeam={{
            name: teams[0].name,
            icon: teams[0].icon,
          }}
          rightTeam={{
            name: teams[1].name,
            icon: teams[1].icon,
          }}
          loading={status === "loading"}
          bettingTeam={betOption}
          onConfirm={(amount) => {
            if (!teamId) return;
            placeBet(teamId, amount);
          }}
        />
      ) : null}
      {status === "finish" ? (
        <CompletePopup
          gameId={props.game.id}
          leftTeam={{
            name: teams[0].name,
            icon: teams[0].icon,
          }}
          rightTeam={{
            name: teams[1].name,
            icon: teams[1].icon,
          }}
          bettingTeam={betOption || "draw"}
          url={location.href}
          date={date}
          onClose={() => {
            reset();
            setBetOption(undefined);
          }}
        />
      ) : null}
      {topupVisible ? (
        <TopupPopup
          message={`Insufficient balance, please top up at least ${minTopup} SOL`}
          min={minTopup}
          onClose={() => {
            reset();
            setBetOption(undefined);
          }}
          onConfirm={(amount) => {
            if (!teamId) return;
            placeBet(teamId, amountCache, amount);
          }}
          disabled={status === "loading"}
          btn={status === "loading" ? "Loading..." : "Confirm"}
        />
      ) : null}
    </div>
  );
}
