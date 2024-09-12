import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koikoi Swagger Document",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
