import { notFound } from "next/navigation";
import ReactSwagger from "./swagger";
import { createSwaggerSpec } from "next-swagger-doc";

const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/(external)/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Koikoi Web API",
        version: "1.0",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
          },
        },
      },
    },
  });
  return spec;
};

export default async function SwaggerPage() {
  if (process.env.NODE_ENV === "production") notFound();
  const spec = await getApiDocs();
  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  );
}
