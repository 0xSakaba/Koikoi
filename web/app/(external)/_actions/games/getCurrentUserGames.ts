"use server";

import { ironSessionConfig, UserSession } from "@/app/ironSession";
import prisma from "@/prisma";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export async function getCurrentUserGames() {
  const session = await getIronSession<UserSession>(
    cookies(),
    ironSessionConfig
  );

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      bets: {
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
      },
      createdGames: {
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

  if (!user) throw new Error("User not logged in");

  return user.bets;
}
