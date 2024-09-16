"use client";

import { MatchCard } from "./_components/MatchCard";
import Team1 from "./_assets/teams/1.png";
import Team2 from "./_assets/teams/2.png";
import Team3 from "./_assets/teams/3.png";
import Team4 from "./_assets/teams/4.png";

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
        bettingTeam={"left"}
        score={"2 - 0"}
        active
        action="Get Result"
        onClick={() => console.log("Get Result")}
      />
      <MatchCard
        title={"Your Betting"}
        leftTeam={{
          name: "Arsenal",
          icon: Team2.src,
        }}
        rightTeam={{
          name: "Manchester United",
          icon: Team1.src,
        }}
        bettingTeam={"left"}
        date={"2024/10/7"}
      />
      <MatchCard
        title={"Your New Game"}
        leftTeam={{
          name: "Chelsea",
          icon: Team3.src,
        }}
        rightTeam={{
          name: "Liverpool",
          icon: Team4.src,
        }}
        date={"2024/10/10"}
        action="Game Make"
        onClick={() => console.log("Game Make")}
      />
    </div>
  );
}
