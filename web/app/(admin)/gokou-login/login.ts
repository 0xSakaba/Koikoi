"use server";

import { AdminSession, ironSessionConfig } from "@/app/ironSession";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(username: string, password: string) {
  if (
    username === "松に鶴" &&
    password === "4T]!W]Ylos#v+QfT7Yk4Y~nj_3WPEM.7"
  ) {
    const session = await getIronSession<AdminSession>(
      cookies(),
      ironSessionConfig
    );
    session.admin = true;
    await session.save();
    redirect("/gokou");
  } else {
    return false;
  }
}
