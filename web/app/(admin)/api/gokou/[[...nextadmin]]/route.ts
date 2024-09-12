import { ironSessionConfig } from "@/app/ironSession";
import { prisma } from "@/prisma";
import schema from "@/prisma/json-schema/json-schema.json";
import { createHandler } from "@premieroctet/next-admin/dist/appHandler";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const { run } = createHandler({
  apiBasePath: "/api/gokou",
  prisma,
  schema,
  onRequest: async (req) => {
    const session = await getIronSession<{ admin: boolean }>(
      cookies(),
      ironSessionConfig
    );
    if (!session.admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  },
});

export { run as DELETE, run as GET, run as POST };
