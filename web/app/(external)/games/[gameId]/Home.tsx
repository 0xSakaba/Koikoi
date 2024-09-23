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
  const [finish, setFinish] = useState(false);
  const { topupVisible } = usePlaceBet(props.game.id);

  const teams = props.game.match.teams.sort((a, b) => (a.id > b.id ? 1 : -1));
  const date = Intl.DateTimeFormat("ja", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "shortOffset",
  }).format(props.game.match.date);
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
        onBet={setBetOption}
      />
      {!!betOption ? (
        <BetPopup
          onClose={() => setBetOption(undefined)}
          leftTeam={{
            name: teams[0].name,
            icon: teams[0].icon,
          }}
          rightTeam={{
            name: teams[1].name,
            icon: teams[1].icon,
          }}
          bettingTeam={betOption}
          onConfirm={() => {
            setBetOption(undefined);
            setFinish(true);
          }}
        />
      ) : null}
      {finish ? (
        <CompletePopup
          leftTeam={{
            name: teams[0].name,
            icon: teams[0].icon,
          }}
          rightTeam={{
            name: teams[1].name,
            icon: teams[1].icon,
          }}
          bettingTeam={"left"}
          poolSize={3}
          url={location.href}
          remainSol={3}
          date={date}
          onClose={() => setFinish(false)}
        />
      ) : null}
      {topupVisible ? (
        <TopupPopup
          onClose={function (): void {
            throw new Error("Function not implemented.");
          }}
          onConfirm={function (amount: number): void {
            throw new Error("Function not implemented.");
          }}
        />
      ) : null}
    </div>
  );
}
