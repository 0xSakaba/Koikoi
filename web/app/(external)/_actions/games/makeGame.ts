"use server";

import { ironSessionConfig, UserSession } from "@/app/ironSession";
import prisma from "@/prisma";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/** It creates a temp game, which is not accessible for other users */
export async function makeGame(matchId: string) {
  const session = await getIronSession<UserSession>(
    cookies(),
    ironSessionConfig
  );

  if (!session.userId) throw new Error("Unauthorized");

  const game = await prisma.game.create({
    data: {
      matchId,
      creatorId: session.userId,
    },
  });

  return redirect(`/games/${game.id}`);
}
