"use server";

import prisma from "@/prisma";

export async function getMatches() {
  const matches = await prisma.match.findMany({
    include: {
      teams: true,
    },
  });

  return matches;
}
