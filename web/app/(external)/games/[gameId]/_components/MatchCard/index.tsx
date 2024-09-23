"use client";

import { useKoikoiProgram } from "@/app/(external)/_lib/solana/useKoikoiProgram";
import { uuidToBase64 } from "@/app/(external)/_lib/uuidToBase64";
import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { BetPool } from "../BetPool";
import { DrawCard } from "./DrawCard";
import { TeamCard } from "./TeamCard";
import Live from "./assets/Live.svg";

export type Team = {
  name: string;
  icon: string;
};

export type MatchCardProps = {
  leftTeam: Team;
  rightTeam: Team;
  date: string;
  time: string;
  gameId: string;
  score: string;
  current?: string;
  inited: boolean;
  onBet(option: "left" | "right" | "draw"): void;
};

type GameBetInfo = {
  leftTeam: BetInfo;
  rightTeam: BetInfo;
  draw: BetInfo;
  pool: number;
};
type BetInfo = {
  bettors: number;
  pool: number;
  prize: number;
};

export function MatchCard(props: MatchCardProps) {
  const [betInfo, setBetInfo] = useState<GameBetInfo>({
    leftTeam: {
      bettors: 0,
      pool: 0,
      prize: 0,
    },
    rightTeam: {
      bettors: 0,
      pool: 0,
      prize: 0,
    },
    draw: {
      bettors: 0,
      pool: 0,
      prize: 0,
    },
    pool: 0,
  });
  const program = useKoikoiProgram();

  useEffect(() => {
    if (!props.inited) return;

    const addr = PublicKey.findProgramAddressSync(
      [Buffer.from("game"), Buffer.from(uuidToBase64(props.gameId))],
      program.programId
    )[0];

    const subscriber = program.account.gameAccount.subscribe(addr);

    subscriber.addListener("change", onChange);

    updateBetInfo();

    return () => {
      subscriber.removeListener("change", onChange);
    };

    async function updateBetInfo() {
      const data = await program.account.gameAccount.fetch(addr);
      const gamePool = data.pool.toNumber() / 1e9;
      const leftTeamPool =
        data.betAmounts[0].reduce((a, b) => a.add(b), new BN(0)).toNumber() /
        1e9;
      const leftTeamPrize =
        data.betAmounts[0].length > 0
          ? gamePool / data.betAmounts[0].length
          : 0;
      const rightTeamPool =
        data.betAmounts[1].reduce((a, b) => a.add(b), new BN(0)).toNumber() /
        1e9;
      const rightTeamPrize =
        data.betAmounts[1].length > 0
          ? gamePool / data.betAmounts[1].length
          : 0;
      const drawPool =
        data.betAmounts[2].reduce((a, b) => a.add(b), new BN(0)).toNumber() /
        1e9;
      const drawPrize =
        data.betAmounts[2].length > 0
          ? gamePool / data.betAmounts[2].length
          : 0;
      setBetInfo({
        pool: gamePool,
        leftTeam: {
          bettors: data.betAmounts[0].length,
          pool: leftTeamPool,
          prize: leftTeamPrize,
        },
        rightTeam: {
          bettors: data.betAmounts[1].length,
          pool: rightTeamPool,
          prize: rightTeamPrize,
        },
        draw: {
          bettors: data.betAmounts[2].length,
          pool: drawPool,
          prize: drawPrize,
        },
      });
    }
    function onChange(evt: unknown) {
      updateBetInfo();
    }
  }, [props.gameId]);

  return (
    <div className="mx-5 my-5 shadow-md bg-white rounded-[20px] p-[7px] flex flex-col items-center gap-3 relative">
      <div className="text-gray-300 text-lg font-semibold text-center">
        {props.date}
      </div>
      <BetPool poolSize={betInfo.pool} />
      <div className="grid grid-cols-3 gap-3 items-end px-3 mb-10">
        <TeamCard
          {...props.leftTeam}
          onBet={() => props.onBet("left")}
          {...betInfo.leftTeam}
        />
        <DrawCard
          score={props.score}
          time={props.time}
          onBet={() => props.onBet("draw")}
          {...betInfo.draw}
        />
        <TeamCard
          {...props.rightTeam}
          onBet={() => props.onBet("right")}
          {...betInfo.rightTeam}
        />
      </div>
      {props.current ? (
        <div className="rounded-lg bg-red-200 text-white flex flex-col items-center justify-center top-1.5 right-1.5 px-1.5 pb-0.5 absolute">
          <Live className="-mb-0.5" />
          <span className="text-xs -mt-1">{props.current}</span>
        </div>
      ) : null}
    </div>
  );
}
