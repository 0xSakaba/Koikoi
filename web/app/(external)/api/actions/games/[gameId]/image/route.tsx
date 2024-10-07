/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */
// Server side image generation, so we can't use next/image and we don't need alt text for these images

import SolanaLogo from "@/app/(external)/_assets/solana-black.png";
import Logo from "./logo.png";
import Bettor from "@/app/(external)/games/[gameId]/_components/MatchCard/assets/Bettor.svg";
import Prize from "@/app/(external)/games/[gameId]/_components/MatchCard/assets/Prize.svg";
import { ImageResponse } from "next/og";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { SolanaService } from "@/app/(external)/_lib/solana";
import { uuidToBase64 } from "@/app/(external)/_lib/uuidToBase64";
import { BN } from "@coral-xyz/anchor";
import { formatGameResult } from "@/app/(external)/_lib/formatGameData";

export async function GET(
  req: NextRequest,
  { params }: { params: { gameId: string } }
) {
  const game = await prisma.game.findUnique({
    where: {
      id: params.gameId,
    },
    include: {
      match: {
        include: {
          teams: true,
        },
      },
    },
  });

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const teams = game.match.teams.sort((a, b) => (a.id > b.id ? 1 : -1));
  const betInfo = game.result
    ? formatGameResult(JSON.parse(game.result))
    : await formatGameData(game.id);

  return new ImageResponse(
    (
      <div
        tw="w-full h-full flex items-end bg-white px-6 pb-12"
        style={{ gap: "24px" }}
      >
        <div
          tw="flex-1 flex flex-col justify-end items-center h-[34rem] rounded-xl"
          style={{
            rowGap: "1.5rem",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          <img
            src={teams[0].icon}
            width={200}
            height={200}
            style={{ objectFit: "contain" }}
            tw="absolute object-center -top-16"
          />
          <span tw="font-bold text-[2rem]">{teams[0].name}</span>
          <div tw="px-6 w-full flex">
            <div tw="rounded-md bg-[#F8F2F7] flex justify-between items-center w-full text-[#9787A5] text-[2rem] pl-2 pr-4 py-2">
              <Bettor width={60} height={60} />
              <span>{betInfo.leftTeam.bettors}</span>
            </div>
          </div>
          <div tw="px-6 w-full flex">
            <div tw="rounded-md bg-[#F8F2F7] flex justify-between items-center w-full text-[#9787A5] text-[2rem] pl-2 pr-4 py-2">
              <img
                src={new URL(SolanaLogo.src, req.url).toString()}
                alt="Pool size (SOL)"
                width={60}
                height={60}
              />
              <span>
                {Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(
                  betInfo.leftTeam.pool
                )}
              </span>
            </div>
          </div>
          <div tw="px-6 w-full flex">
            <div tw="rounded-md bg-[#F8F2F7] flex justify-between items-center w-full text-[#9787A5] text-[2rem] pl-2 pr-4 py-2">
              <Prize width={60} height={60} />
              <span>
                {Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(
                  betInfo.leftTeam.prize
                )}
              </span>
            </div>
          </div>
        </div>
        <div
          tw="flex-1 flex flex-col justify-end items-center h-[24rem] rounded-xl"
          style={{
            rowGap: "1.5rem",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            opacity:
              game.match.id === "698a6d62-fa7c-45e0-be9c-70eff4f368f2"
                ? 0
                : 100,
          }}
        >
          <img
            src={new URL(Logo.src, req.url).toString()}
            width={180}
            tw="absolute object-contain object-center -top-44"
          />
          <span tw="font-bold text-[2rem] text-center">Draw</span>
          <div tw="px-6 w-full flex">
            <div tw="rounded-md bg-[#F8F2F7] flex justify-between items-center w-full text-[#9787A5] text-[2rem] pl-2 pr-4 py-2">
              <Bettor width={60} height={60} />
              <span>{betInfo.draw.bettors}</span>
            </div>
          </div>
          <div tw="px-6 w-full flex">
            <div tw="rounded-md bg-[#F8F2F7] flex justify-between items-center w-full text-[#9787A5] text-[2rem] pl-2 pr-4 py-2">
              <img
                src={new URL(SolanaLogo.src, req.url).toString()}
                alt="Pool size (SOL)"
                width={60}
                height={60}
              />
              <span>
                {Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(
                  betInfo.draw.pool
                )}
              </span>
            </div>
          </div>
          <div tw="px-6 w-full flex">
            <div tw="rounded-md bg-[#F8F2F7] flex justify-between items-center w-full text-[#9787A5] text-[2rem] pl-2 pr-4 py-2">
              <Prize width={60} height={60} />
              <span>
                {Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(
                  betInfo.draw.prize
                )}
              </span>
            </div>
          </div>
        </div>
        <div
          tw="flex-1 flex flex-col justify-end items-center h-[34rem] rounded-xl"
          style={{
            rowGap: "1.5rem",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          <img
            src={teams[1].icon}
            width={200}
            height={200}
            style={{ objectFit: "contain" }}
            tw="absolute object-center -top-16"
          />
          <span tw="font-bold text-[2rem] text-center">{teams[1].name}</span>
          <div tw="px-6 w-full flex">
            <div tw="rounded-md bg-[#F8F2F7] flex justify-between items-center w-full text-[#9787A5] text-[2rem] pl-2 pr-4 py-2">
              <Bettor width={60} height={60} />
              <span>{betInfo.rightTeam.bettors}</span>
            </div>
          </div>
          <div tw="px-6 w-full flex">
            <div tw="rounded-md bg-[#F8F2F7] flex justify-between items-center w-full text-[#9787A5] text-[2rem] pl-2 pr-4 py-2">
              <img
                src={new URL(SolanaLogo.src, req.url).toString()}
                alt="Pool size (SOL)"
                width={60}
                height={60}
              />
              <span>
                {Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(
                  betInfo.rightTeam.pool
                )}
              </span>
            </div>
          </div>
          <div tw="px-6 w-full flex">
            <div tw="rounded-md bg-[#F8F2F7] flex justify-between items-center w-full text-[#9787A5] text-[2rem] pl-2 pr-4 py-2">
              <Prize width={60} height={60} />
              <span>
                {Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(
                  betInfo.rightTeam.prize
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 700,
      height: 700,
    }
  );
}

async function formatGameData(gameId: string) {
  const solana = new SolanaService();
  const data = await solana.getGameAccountData(uuidToBase64(gameId));
  const gamePool = data.pool.toNumber() / 1e9;
  const leftTeamBettors = data.betAmounts[0].length;
  const leftTeamPool =
    data.betAmounts[0].reduce((a, b) => a.add(b), new BN(0)).toNumber() / 1e9;
  const leftTeamPrize = leftTeamBettors > 0 ? gamePool / leftTeamBettors : 0;
  const rightTeamBettors = data.betAmounts[1].length;
  const rightTeamPool =
    data.betAmounts[1].reduce((a, b) => a.add(b), new BN(0)).toNumber() / 1e9;
  const rightTeamPrize = rightTeamBettors > 0 ? gamePool / rightTeamBettors : 0;
  const drawBettors = data.betAmounts[2].length;
  const drawPool =
    data.betAmounts[2].reduce((a, b) => a.add(b), new BN(0)).toNumber() / 1e9;
  const drawPrize =
    data.betAmounts[2].length > 0 ? gamePool / data.betAmounts[2].length : 0;

  return {
    pool: gamePool,
    leftTeam: {
      bettors: leftTeamBettors,
      pool: leftTeamPool,
      prize: leftTeamPrize,
    },
    rightTeam: {
      bettors: rightTeamBettors,
      pool: rightTeamPool,
      prize: rightTeamPrize,
    },
    draw: {
      bettors: drawBettors,
      pool: drawPool,
      prize: drawPrize,
    },
  };
}
