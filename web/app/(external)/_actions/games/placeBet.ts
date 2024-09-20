"use server";

import prisma from "@/prisma";
import { MatchStatus } from "@prisma/client";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { SolanaService } from "@/app/(external)/_lib/solana";
import { uuidToBase64 } from "../../_lib/uuidToBase64";
import { getIronSession } from "iron-session";
import { ironSessionConfig, UserSession } from "@/app/ironSession";
import { cookies } from "next/headers";

type FullServerBet = {
  signature: string;
};
type RequireTopupBetStage1 = { requireTopup: true };
type RequireTopupBetStage2 = {
  transaction: string;
};

export async function placeBet({
  gameId,
  teamId,
  amount,
  topup,
}: {
  gameId: string;
  teamId: string;
  amount: number;
  topup?: {
    from: PublicKey;
    amount: number;
  };
}): Promise<FullServerBet | RequireTopupBetStage1 | RequireTopupBetStage2> {
  const session = await getIronSession<UserSession>(
    cookies(),
    ironSessionConfig
  );
  // validate game status
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      match: {
        include: {
          teams: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (!game) throw new Error("Game not found");
  if (game.match.date < new Date() || game.match.status !== MatchStatus.PENDING)
    throw new Error("Not allowed to bet");
  if (teamId !== "draw" && game.match.teams.every((t) => t.id !== teamId))
    throw new Error("Invalid team");

  // check spending account balance
  const connection = new Connection(
    clusterApiUrl(process.env.NEXT_PUBLIC_SOLANA_NET)
  );
  const userSpendingAccount = SolanaService.getSpendingAccountAddress(
    uuidToBase64(session.userId)
  );
  const balance = await connection.getBalance(userSpendingAccount);
  const amountInLamports = amount * 1e9;
  const option = game.match.teams
    .map((t) => t.id)
    .sort()
    .indexOf(teamId);

  if (balance > amountInLamports) {
    // full server
    const solana = new SolanaService();
    solana.placeBet(
      uuidToBase64(game.id),
      uuidToBase64(session.userId),
      option === -1 ? game.match.teams.length : option,
      amountInLamports
    );
    const signature = await solana.send();
    if (!signature) {
      throw new Error("Failed to send transaction");
    }
    return { signature };
  } else if (topup) {
    // presign place bet tx but let user send it
    const solana = new SolanaService();
    solana.topup(uuidToBase64(session.userId), topup.amount * 1e9, topup.from);
    solana.placeBet(
      uuidToBase64(game.id),
      uuidToBase64(session.userId),
      option === -1 ? game.match.teams.length : option,
      amountInLamports
    );

    const tx = await solana.serializeSigned();
    if (!tx) {
      throw new Error("Failed to serialize transaction");
    }
    return { transaction: tx.toString("base64") };
  } else {
    // inform user to topup
    return { requireTopup: true };
  }
}
