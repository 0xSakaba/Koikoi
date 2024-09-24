"use server";

import prisma from "@/prisma";

export async function getNewMatches() {
  const matches = await prisma.match.findMany({
    include: {
      teams: true,
    },
    where: {
      date: {
        gte: new Date(),
      },
      status: "PENDING",
    },
    orderBy: {
      date: "asc",
    },
  });

  return matches;
}
