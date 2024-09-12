"use server";

import prisma from "@/prisma";

export async function getMatch(id: string) {
  const match = await prisma.match.findUnique({ where: { id } });

  // preprocess match data

  return match;
}
