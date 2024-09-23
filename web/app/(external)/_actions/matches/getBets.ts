"use server";

import { ironSessionConfig, UserSession } from "@/app/ironSession";
import prisma from "@/prisma";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export async function getBets() {
  const session = await getIronSession<UserSession>(
    cookies(),
    ironSessionConfig
  );
  if (!session.userId) return [];

  const bets = await prisma.bet.findMany({
    where: {
      bettorId: session.userId,
    },
    include: {
      game: {
        include: {
          match: {
            include: {
              teams: true,
            },
          },
        },
      },
    },
  });

  return bets;
}
