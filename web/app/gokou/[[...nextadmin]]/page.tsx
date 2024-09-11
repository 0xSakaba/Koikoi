import { NextAdmin, PageProps } from "@premieroctet/next-admin";
import { getNextAdminProps } from "@premieroctet/next-admin/dist/appRouter";
import { prisma } from "@/prisma";
import schema from "@/prisma/json-schema/json-schema.json";
import "@/app/globals.css"; // .css file containing tailiwnd rules

export default async function AdminPage({ params, searchParams }: PageProps) {
  const props = await getNextAdminProps({
    params: params.nextadmin,
    searchParams,
    basePath: "/gokou",
    apiBasePath: "/api/gokou",
    prisma,
    schema,
    /*options*/
  });

  return <NextAdmin {...props} />;
}
