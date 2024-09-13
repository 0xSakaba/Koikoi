"use server";

import prisma from "@/prisma";

export async function getMatch(id: string) {
  const match = await prisma.match.findUnique({
    where: { id },
    include: { teams: true },
  });

  // preprocess match data

  return match;
}
