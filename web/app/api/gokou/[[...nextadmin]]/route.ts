import { prisma } from "@/prisma";
import schema from "@/prisma/json-schema/json-schema.json";
import { createHandler } from "@premieroctet/next-admin/dist/appHandler";

const { run } = createHandler({
  apiBasePath: "/api/gokou",
  prisma,
  schema,
  /*options*/
});

export { run as DELETE, run as GET, run as POST };
