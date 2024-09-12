"use server";

import { ironSessionConfig, UserSession } from "@/app/ironSession";
import prisma from "@/prisma";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  const session = await getIronSession<UserSession>(
    cookies(),
    ironSessionConfig
  );

  const user = await prisma.user.findUnique({ where: { id: session.userId } });

  return user;
}

export default getCurrentUser;
