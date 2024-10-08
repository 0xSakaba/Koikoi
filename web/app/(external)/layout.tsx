import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "@/app/globals.css";
import { Nav } from "./_components/Nav";
import { Wallet } from "./_components/Wallet";
import { Provider } from "./provider";
import { ReactNode } from "react";

const notosans = Noto_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KOIKOI",
};

// only mobile version, hence use the max-width lg (512px or 32rem)
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={notosans.className}>
        <div className="mx-auto max-w-lg shadow-xl min-h-screen relative flex flex-col">
          <Provider>
            <Wallet />
            <main className="flex-grow bg-[#EFEEF4]">{children}</main>
            <Nav />
          </Provider>
        </div>
      </body>
    </html>
  );
}
