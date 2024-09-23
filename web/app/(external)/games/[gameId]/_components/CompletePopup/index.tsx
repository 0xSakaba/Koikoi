"use client";

import { Button } from "@/app/(external)/_components/Button";
import { Team } from "@/app/(external)/_components/MatchCard";
import { Popup } from "@/app/(external)/_components/Popup";
import Link from "../assets/Link.svg";
import { BetPool } from "../BetPool";
import { DrawCard } from "../DrawCard";
import { TeamCard } from "../TeamCard";
import { ShareKit } from "./ShareKit";
import { useSpendingBalance } from "@/app/(external)/_lib/solana/useSpendingBalance";
import { useEffect, useMemo, useState } from "react";
import { useKoikoiProgram } from "@/app/(external)/_lib/solana/useKoikoiProgram";
import { uuidToBase64 } from "@/app/(external)/_lib/uuidToBase64";
import { PublicKey } from "@solana/web3.js";

type BetPopupProps = {
  gameId: string;
  leftTeam: Team;
  rightTeam: Team;
  bettingTeam: "left" | "right" | "draw";
  url: string;
  date: string;
  onClose: () => void;
};

export function CompletePopup(props: BetPopupProps) {
  const balance = useSpendingBalance();
  const koikoi = useKoikoiProgram();
  const [poolSize, setPoolSize] = useState<number | null>(null);
  useEffect(() => {
    const addr = PublicKey.findProgramAddressSync(
      [Buffer.from("game"), Buffer.from(uuidToBase64(props.gameId))],
      koikoi.programId
    )[0];
    koikoi.account.gameAccount.fetch(addr).then((game) => {
      setPoolSize(game.pool.toNumber() / 1e9);
    });
  }, [koikoi, props.gameId]);
  return (
    <Popup className="px-5 py-4 flex flex-col gap-6" onClose={props.onClose}>
      <div>
        <div className="text-2xl font-semibold text-center">Complete</div>
        <div className="flex mb-3">
          <div className="border-b-2 border-[#A58BCF] flex-1"></div>
          <div className="border-b-2 border-[#35D3DE] flex-1"></div>
        </div>
        <div className="text-gray-300 text-lg font-semibold text-center">
          {props.date}
        </div>
        <BetPool className="block mx-auto" poolSize={poolSize} />
      </div>
      <div className="grid grid-cols-3 gap-3 items-end mb-5">
        <TeamCard bet={props.bettingTeam == "left"} {...props.leftTeam} />
        <DrawCard bet={props.bettingTeam == "draw"} />
        <TeamCard bet={props.bettingTeam == "right"} {...props.rightTeam} />
      </div>
      <div className="flex flex-col items-center">
        <div className="text-red-200 font-semibold text-sm">
          \Have fun with friends and community now !/
        </div>
        <div className="flex w-full mb-2">
          <div className="flex-grow">
            <input
              type="text"
              disabled
              className="border-2 rounded-full border-gray-300 w-100 px-3 py-2 text-gray-300 w-full"
              value={props.url}
            />
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(props.url)}
            className="flex items-center text-solana-light text-sm font-semibold"
          >
            <Link />
            <span>Copy Link</span>
          </button>
        </div>
        <ShareKit url={props.url} />
        <div className="flex justify-between"></div>
      </div>
      <div>
        <div className="flex">
          <div className="border-b-2 border-[#A58BCF] flex-1"></div>
          <div className="border-b-2 border-[#35D3DE] flex-1"></div>
        </div>
        <div className="text-2xl font-semibold text-center">Your SOL</div>
        <div className="flex">
          <div className="border-b-2 border-[#A58BCF] flex-1"></div>
          <div className="border-b-2 border-[#35D3DE] flex-1"></div>
        </div>
      </div>
      <div className="rounded bg-purple-100 text-center py-1 w-full max-w-44 block mx-auto text-purple-200 items-center text-lg font-semibold">
        {Intl.NumberFormat("en", { maximumFractionDigits: 3 }).format(balance)}
      </div>
      <Button
        className="text-white w-full py-1.5 text-xl font-semibold max-w-44 block mx-auto"
        onClick={props.onClose}
      >
        OK
      </Button>
    </Popup>
  );
}
