"use server";

import prisma from "@/prisma";

export async function getMatches() {
  const matches = await prisma.match.findMany();

  return matches;
}
