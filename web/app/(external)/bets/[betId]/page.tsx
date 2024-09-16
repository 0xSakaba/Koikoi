"use client";

import Team1 from "@/app/(external)/_assets/teams/1.png";
import Team2 from "@/app/(external)/_assets/teams/2.png";
import { MatchCard } from "./_components/MatchCard";

export default function Home() {
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
      />
    </div>
  );
}
