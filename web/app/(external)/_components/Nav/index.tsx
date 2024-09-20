"use client";

import clsx from "clsx";
import Link from "next/link";
import Game from "./assets/Game.svg";
import Ranking from "./assets/Ranking.svg";
import Club from "./assets/Club.svg";
import Shop from "./assets/Shop.svg";
import Profile from "./assets/Profile.svg";
import { usePathname } from "next/navigation";
import { match, P } from "ts-pattern";

type Tab = "game" | "ranking" | "club" | "shop" | "profile" | "unknown";

function getClassNames(tab: Tab, currentTab: Tab) {
  return clsx(
    "grid grid-rows-[2.75rem_1rem] place-items-center text-center",
    tab === currentTab ? "text-solana-light" : "text-gray-300"
  );
}

export function Nav({ className }: { className?: string }) {
  const pathname = usePathname();

  const currentTab = match(pathname)
    .with("/", () => "game")
    .with(P.string.startsWith("/games/"), () => "game")
    .with("/ranking", () => "ranking")
    .with("/club", () => "club")
    .with("/shop", () => "shop")
    .with("/profile", () => "profile")
    .otherwise(() => "unknown") as Tab;

  return (
    <nav
      className={clsx(
        className,
        "shadow-[0px_-4px_10px_0px_rgba(0,0,0,0.10)] grid grid-cols-5 justify-around items-center sticky bottom-0 h-20 gap-4 px-4 py-2 bg-white z-40"
      )}
    >
      <Link href="/" className={getClassNames("game", currentTab)}>
        <div className="grid place-items-center size-11">
          <Game />
        </div>
        <span className="font-semibold">Game</span>
      </Link>
      <Link href="/ranking" className={getClassNames("ranking", currentTab)}>
        <div className="grid place-items-center size-11">
          <Ranking />
        </div>
        <span className="font-semibold">Ranking</span>
      </Link>
      <Link href="/" className={getClassNames("club", currentTab)}>
        <div className="grid place-items-center size-11">
          <Club />
        </div>
        <span className="font-semibold">Club</span>
      </Link>
      <Link href="/" className={getClassNames("shop", currentTab)}>
        <div className="grid place-items-center size-11">
          <Shop />
        </div>
        <span className="font-semibold">Shop</span>
      </Link>
      <Link href="/" className={getClassNames("profile", currentTab)}>
        <div className="grid place-items-center size-11">
          <Profile />
        </div>
        <span className="font-semibold">Profile</span>
      </Link>
    </nav>
  );
}
