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
type RequireTopupBetStage1 = { requireTopup: number };
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
    from: string;
    amount: number;
  };
}): Promise<FullServerBet | RequireTopupBetStage1 | RequireTopupBetStage2> {
  if (amount === 0) throw new Error("Invalid amount");
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
  if (teamId !== "DRAW" && game.match.teams.every((t) => t.id !== teamId))
    throw new Error("Invalid team");

  // check spending account balance
  const connection = new Connection(
    clusterApiUrl(process.env.NEXT_PUBLIC_SOLANA_NET)
  );
  const userSpendingAccount = SolanaService.getSpendingAccountAddress(
    uuidToBase64(session.userId)
  );
  const balance =
    (await connection.getBalance(userSpendingAccount)) - 0.002 * 1e9; // exempt fee
  const amountInLamports = amount * 1e9;
  const option = game.match.teams
    .map((t) => t.id)
    .sort()
    .indexOf(teamId);
  const solana = new SolanaService();

  // create game when needed
  if (!game.inited) {
    const created = await solana.checkGameAccountCreated(uuidToBase64(game.id));
    if (!created) {
      solana.makeGame(uuidToBase64(game.id), 3);
    } else {
      await prisma.game.update({
        where: { id: game.id },
        data: { inited: true },
      });
    }
  }

  if (balance > amountInLamports) {
    // full server
    solana.placeBet(
      uuidToBase64(game.id),
      uuidToBase64(session.userId),
      option === -1 ? game.match.teams.length : option,
      amountInLamports
    );
    const signature = await solana.send();
    await prisma.bet.create({
      data: {
        gameId: game.id,
        bettorId: session.userId,
        option: teamId,
        confirmed: true,
      },
    });
    if (!signature) {
      throw new Error("Failed to send transaction");
    }
    return { signature };
  } else if (topup) {
    // presign place bet tx but let user send it
    solana.topup(
      uuidToBase64(session.userId),
      topup.amount * 1e9,
      new PublicKey(topup.from)
    );
    solana.placeBet(
      uuidToBase64(game.id),
      uuidToBase64(session.userId),
      option === -1 ? game.match.teams.length : option,
      amountInLamports
    );

    const { tx, block } = (await solana.serializeSigned()) || {};

    if (!tx) {
      throw new Error("Failed to serialize transaction");
    }
    await prisma.bet.create({
      data: {
        gameId: game.id,
        bettorId: session.userId,
        option: teamId,
        signedBlock: block?.toString(),
        confirmed: false,
      },
    });
    // TODO: how do we check if tx is sent?
    return { transaction: tx.toString("base64") };
  } else {
    // inform user to topup
    return { requireTopup: (amountInLamports - balance) / 1e9 };
  }
}
