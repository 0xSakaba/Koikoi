import { NextAdmin, PageProps } from "@premieroctet/next-admin";
import { getNextAdminProps } from "@premieroctet/next-admin/dist/appRouter";
import { adminPrisma as prisma } from "@/prisma";
import schema from "@/prisma/json-schema/json-schema.json";
import "@/app/globals.css"; // .css file containing tailiwnd rules
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { AdminSession, ironSessionConfig } from "@/app/ironSession";
import { redirect } from "next/navigation";
import { P } from "ts-pattern";

export default async function AdminPage({ params, searchParams }: PageProps) {
  const session = await getIronSession<AdminSession>(
    cookies(),
    ironSessionConfig
  );

  if (!session.admin) {
    redirect("/gokou/login");
  }

  const props = await getNextAdminProps({
    params: params.nextadmin,
    searchParams,
    basePath: "/gokou",
    apiBasePath: "/api/gokou",
    prisma,
    schema,
    options: {
      model: {
        Team: {
          toString: (team) => team.name,
        },
        User: {},
        Match: {},
        Bet: {},
        Game: {},
      },
    },
  });

  return <NextAdmin {...props} />;
}
