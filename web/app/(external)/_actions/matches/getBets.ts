"use server";

import { ironSessionConfig, UserSession } from "@/app/ironSession";
import prisma from "@/prisma";
import { equal } from "assert";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export async function getBets(finished: boolean) {
  const session = await getIronSession<UserSession>(
    cookies(),
    ironSessionConfig
  );
  if (!session.userId) return [];

  const bets = await prisma.bet.findMany({
    where: {
      bettorId: session.userId,
      game: {
        match: {
          status: finished
            ? {
                in: ["FINISHED", "ABORTED"],
              }
            : {
                notIn: ["FINISHED", "ABORTED"],
              },
        },
      },
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
    orderBy: {
      game: {
        match: {
          date: finished ? "desc" : "asc", // if fetching finished games, show the latest first, otherwise show earliest first
        },
      },
    },
  });

  return bets;
}
