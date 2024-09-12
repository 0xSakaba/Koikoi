"use server";

import prisma from "@/prisma";

export async function getGame(id: string) {
  const game = await prisma.game.findUnique({ where: { id } });

  return game;
}
