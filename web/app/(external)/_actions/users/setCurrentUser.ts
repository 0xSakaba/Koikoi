"use server";

import { ironSessionConfig, UserSession } from "@/app/ironSession";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export async function login() {}

export async function setCurrentUser(userId: string) {
  const session = await getIronSession<UserSession>(
    cookies(),
    ironSessionConfig
  );

  session.userId = userId;
  await session.save();
}
