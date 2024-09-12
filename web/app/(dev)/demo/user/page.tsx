import { notFound } from "next/navigation";
import { Demo } from "./Demo";

export default async function DemoUser() {
  if (process.env.NODE_ENV === "production") notFound();

  return <Demo />;
}
