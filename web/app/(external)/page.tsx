"use client";

import { MatchCard } from "./_components/MatchCard";
import Team1 from "./_assets/teams/1.png";
import Team2 from "./_assets/teams/2.png";
import Team3 from "./_assets/teams/3.png";
import Team4 from "./_assets/teams/4.png";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Match } from "@prisma/client";
import { getNewMatches } from "./_actions/matches/getNewMatches";

export default function Home() {
  const router = useRouter();
  const [newMatches, setMatches] = useState<
    Awaited<ReturnType<typeof getNewMatches>>
  >([]);

  useEffect(() => {
    getNewMatches().then(setMatches);
  }, []);

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
        onClick={() => router.push("/bets/1")}
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
        date={new Date("2024/10/7")}
      />
      {newMatches.map((match) => (
        <MatchCard
          key={match.id}
          title={"Your New Game"}
          leftTeam={{
            name: match.teams[0].name,
            icon: match.teams[0].icon,
          }}
          rightTeam={{
            name: match.teams[1].name,
            icon: match.teams[1].icon,
          }}
          date={match.date}
          action="Game Make"
          onClick={() => console.log("Game Make")}
        />
      ))}
    </div>
  );
}
