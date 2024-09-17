"use client";

import Team1 from "@/app/(external)/_assets/teams/1.png";
import Team2 from "@/app/(external)/_assets/teams/2.png";
import { MatchCard } from "./_components/MatchCard";
import { BetPopup } from "./_components/BetPopup";
import { useState } from "react";
import { CompletePopup } from "./_components/CompletePopup";

export default function Home() {
  const [betOption, setBetOption] = useState<"left" | "right" | "draw">();

  return (
    <div>
      <MatchCard
        title={"Bet Result"}
        leftTeam={{
          name: "Arsenal",
          icon: Team2.src,
        }}
        rightTeam={{
          name: "Manchester United",
          icon: Team1.src,
        }}
        score={"2 - 0"}
        date={"2024/10/7 18:00~(UTC)"}
        time={"80'"}
        poolSize={3}
        onBet={setBetOption}
      />
      {!!betOption ? (
        <BetPopup
          onClose={() => setBetOption(undefined)}
          leftTeam={{
            name: "Arsenal",
            icon: Team2.src,
          }}
          rightTeam={{
            name: "Manchester United",
            icon: Team1.src,
          }}
          bettingTeam={betOption}
          onConfirm={() => {}}
        />
      ) : null}
      <CompletePopup
        leftTeam={{
          name: "Arsenal",
          icon: Team2.src,
        }}
        rightTeam={{
          name: "Manchester United",
          icon: Team1.src,
        }}
        bettingTeam={"left"}
        poolSize={3}
        url={"https://312312312"}
        remainSol={3}
        date={"2024/10/7 18:00~(UTC)"}
        onClose={() => {}}
      />
    </div>
  );
}
