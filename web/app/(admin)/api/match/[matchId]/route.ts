import { SolanaService } from "@/app/(external)/_lib/solana";
import { uuidToBase64 } from "@/app/(external)/_lib/uuidToBase64";
import prisma from "@/prisma";
import { Game, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { matchId: string } }
) {
  const match = await prisma.match.findUnique({
    where: {
      id: params.matchId,
    },
    include: {
      games: true,
      teams: true,
    },
  });

  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  if (match.status === "FINISHED" || match.status === "ABORTED") {
    const solana = new SolanaService();
    const option = getOption(match);
    await Promise.all(
      match.games.map(async (game) => {
        if (await solana.checkGameAccountCreated(uuidToBase64(game.id))) {
          solana.closeGame(uuidToBase64(game.id), option);
        }
        return await writeGameData(game);
      })
    );

    await solana.send();

    return NextResponse.json({ done: true }, { status: 200 });
  } else {
    return NextResponse.json({ error: "Match not finished" }, { status: 400 });
  }
}

function getOption(
  match: Prisma.MatchGetPayload<{ include: { games: true; teams: true } }>
): number {
  if (match.status === "ABORTED") return 3;
  if (match.status === "FINISHED" && match.winnerId === null) return 2;

  const teams = match.teams.map((team) => team.id).sort();

  const res = teams.indexOf(match.winnerId as string);
  if (res === -1) throw new Error("Winner not found in teams");

  return res;
}

async function writeGameData(game: Game) {
  const solana = new SolanaService();
  const data = await solana.getGameAccountData(uuidToBase64(game.id));
  await prisma.game.update({
    where: {
      id: game.id,
    },
    data: {
      result: JSON.stringify(data),
    },
  });
}
