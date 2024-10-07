"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { makeGame } from "./_actions/games/makeGame";
import { getBets } from "./_actions/matches/getBets";
import { getNewMatches } from "./_actions/matches/getNewMatches";
import { MatchCard, Team } from "./_components/MatchCard";
import { useUserInfo } from "./_lib/useUserInfo";
import { usePrivy } from "@privy-io/react-auth";

type FormattedBet = {
  leftTeam: Team;
  rightTeam: Team;
  bettingTeam: "left" | "right" | "draw";
  id: string;
  gameId: string;
} & (
  | {
      score: string;
    }
  | { date: Date }
);
export default function Home() {
  const router = useRouter();
  const [newMatches, setMatches] = useState<
    Awaited<ReturnType<typeof getNewMatches>>
  >([]);
  const [finishBets, setFinishBets] = useState<FormattedBet[]>([]);
  const [ongoingBets, setOngoingBets] = useState<FormattedBet[]>([]);
  const userInfo = useUserInfo();
  const { login } = usePrivy();

  useEffect(() => {
    getNewMatches().then(setMatches);
  }, []);

  useEffect(() => {
    getBets(true).then(formatBet).then(setFinishBets);
    getBets(false).then(formatBet).then(setOngoingBets);
  }, [userInfo]);

  return (
    <div>
      {finishBets.map((bet) =>
        "score" in bet ? (
          <MatchCard
            key={bet.id}
            title="Bet Result"
            leftTeam={bet.leftTeam}
            rightTeam={bet.rightTeam}
            bettingTeam={bet.bettingTeam}
            score={bet.score}
            active
            action="Get Result"
            onClick={() => router.push(`/games/${bet.gameId}`)}
          />
        ) : (
          <MatchCard
            key={bet.id}
            title="Your Betting"
            leftTeam={bet.leftTeam}
            rightTeam={bet.rightTeam}
            bettingTeam={bet.bettingTeam}
            date={bet.date}
            className="cursor-pointer"
            onCardClick={() => router.push(`/games/${bet.gameId}`)}
          />
        )
      )}
      {ongoingBets.map((bet) =>
        "score" in bet ? (
          <MatchCard
            key={bet.id}
            title="Bet Result"
            leftTeam={bet.leftTeam}
            rightTeam={bet.rightTeam}
            bettingTeam={bet.bettingTeam}
            score={bet.score}
            active
            action="Get Result"
            onClick={() => router.push(`/games/${bet.gameId}`)}
          />
        ) : (
          <MatchCard
            key={bet.id}
            title="Your Betting"
            leftTeam={bet.leftTeam}
            rightTeam={bet.rightTeam}
            bettingTeam={bet.bettingTeam}
            date={bet.date}
            className="cursor-pointer"
            onCardClick={() => router.push(`/games/${bet.gameId}`)}
          />
        )
      )}
      {newMatches.map((match) => (
        <MatchCard
          key={match.id}
          title="Your New Game"
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
          onClick={() => {
            if (!userInfo) {
              login();
            } else {
              makeGame(match.id);
            }
          }}
          isElection={match.id === "698a6d62-fa7c-45e0-be9c-70eff4f368f2"}
        />
      ))}
    </div>
  );
}

function formatBet(bets: Awaited<ReturnType<typeof getBets>>): FormattedBet[] {
  return bets.map((bet) => ({
    id: bet.id,
    leftTeam: {
      name: bet.game.match.teams[0].name,
      icon: bet.game.match.teams[0].icon,
    },
    rightTeam: {
      name: bet.game.match.teams[1].name,
      icon: bet.game.match.teams[1].icon,
    },
    bettingTeam:
      bet.option === "DRAW"
        ? "draw"
        : bet.option === bet.game.match.teams[0].id
        ? "left"
        : "right",
    gameId: bet.gameId,
    ...(bet.game.match.status === "FINISHED" ||
    bet.game.match.status === "ABORTED"
      ? { score: bet.game.match.score }
      : { date: new Date(bet.game.match.date) }),
  }));
  return [];
}
