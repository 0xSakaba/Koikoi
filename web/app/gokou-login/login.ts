"use server";

import { ironSessionConfig } from "@/app/ironSession";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export async function login(username: string, password: string) {
  if (
    username === "松に鶴" &&
    password === "4T]!W]Ylos#v+QfT7Yk4Y~nj_3WPEM.7"
  ) {
    const session = await getIronSession<{ admin: boolean }>(
      cookies(),
      ironSessionConfig
    );
    session.admin = true;
    await session.save();
    return true;
  } else {
    return false;
  }
}
