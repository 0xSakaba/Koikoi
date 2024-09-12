"use server";

import { ironSessionConfig, UserSession } from "@/app/ironSession";
import prisma from "@/prisma";
import { User } from "@prisma/client";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export type GetCurrentUserResult = User | null;

export async function getCurrentUser(): Promise<GetCurrentUserResult> {
  const session = await getIronSession<UserSession>(
    cookies(),
    ironSessionConfig
  );

  const user = await prisma.user.findUnique({ where: { id: session.userId } });

  return user;
}

export default getCurrentUser;
