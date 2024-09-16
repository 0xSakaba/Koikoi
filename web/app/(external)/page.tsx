"use client";

import { MatchCard } from "./_components/MatchCard";
import TeamPlaceholder from "./_components/MatchCard/assets/TeamPlaceholder.png";

export default function Home() {
  return (
    <div>
      <MatchCard
        title={"Bet Result"}
        leftTeam={{
          name: "Arsenal",
          icon: TeamPlaceholder.src,
        }}
        rightTeam={{
          name: "Manchester United",
          icon: TeamPlaceholder.src,
        }}
        bettingTeam={"left"}
        score={"2 - 0"}
        active
        action="Get Result"
        onClick={() => console.log("Get Result")}
      />
      <MatchCard
        title={"Bet Result"}
        leftTeam={{
          name: "Arsenal",
          icon: TeamPlaceholder.src,
        }}
        rightTeam={{
          name: "Manchester United",
          icon: TeamPlaceholder.src,
        }}
        bettingTeam={"draw"}
        date={"2024/10/7"}
      />
    </div>
  );
}
