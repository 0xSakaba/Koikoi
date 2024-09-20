import SolanaLogo from "@/app/(external)/_assets/solana-black.png";
import Team1 from "@/app/(external)/_assets/teams/1.png";
import Team2 from "@/app/(external)/_assets/teams/2.png";
import Logo from "./logo.png";
import Bettor from "@/app/(external)/bets/[gameId]/_components/MatchCard/assets/Bettor.svg";
import Prize from "@/app/(external)/bets/[gameId]/_components/MatchCard/assets/Prize.svg";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
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
            src={new URL(Team1.src, req.url).toString()}
            width={200}
            height={200}
            tw="absolute object-contain object-center -top-16"
          />
          <span tw="font-bold text-[2.25rem]">Arsenal</span>
          <div tw="px-6 w-full flex">
            <div tw="rounded-md bg-[#F8F2F7] flex justify-between items-center w-full text-[#9787A5] text-[2.25rem] pl-2 pr-4 py-2">
              <Bettor width={60} height={60} />
              <span>{3}</span>
            </div>
          </div>
          <div tw="px-6 w-full flex">
            <div tw="rounded-md bg-[#F8F2F7] flex justify-between items-center w-full text-[#9787A5] text-[2.25rem] pl-2 pr-4 py-2">
              <img
                src={new URL(SolanaLogo.src, req.url).toString()}
                alt="Pool size (SOL)"
                width={60}
                height={60}
              />
              <span>{3}</span>
            </div>
          </div>
          <div tw="px-6 w-full flex">
            <div tw="rounded-md bg-[#F8F2F7] flex justify-between items-center w-full text-[#9787A5] text-[2.25rem] pl-2 pr-4 py-2">
              <Prize width={60} height={60} />
              <span>{3}</span>
            </div>
          </div>
        </div>
        <div
          tw="flex-1 flex flex-col justify-end items-center h-[24rem] rounded-xl"
          style={{
            rowGap: "1.5rem",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          <img
            src={new URL(Logo.src, req.url).toString()}
            width={180}
            tw="absolute object-contain object-center -top-44"
          />
          <span tw="font-bold text-[2.25rem] text-center">Draw</span>
          <div tw="px-6 w-full flex">
            <div tw="rounded-md bg-[#F8F2F7] flex justify-between items-center w-full text-[#9787A5] text-[2.25rem] pl-2 pr-4 py-2">
              <Bettor width={60} height={60} />
              <span>{3}</span>
            </div>
          </div>
          <div tw="px-6 w-full flex">
            <div tw="rounded-md bg-[#F8F2F7] flex justify-between items-center w-full text-[#9787A5] text-[2.25rem] pl-2 pr-4 py-2">
              <img
                src={new URL(SolanaLogo.src, req.url).toString()}
                alt="Pool size (SOL)"
                width={60}
                height={60}
              />
              <span>{3}</span>
            </div>
          </div>
          <div tw="px-6 w-full flex">
            <div tw="rounded-md bg-[#F8F2F7] flex justify-between items-center w-full text-[#9787A5] text-[2.25rem] pl-2 pr-4 py-2">
              <Prize width={60} height={60} />
              <span>{3}</span>
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
            src={new URL(Team2.src, req.url).toString()}
            width={200}
            height={200}
            tw="absolute object-contain object-center -top-16"
          />
          <span tw="font-bold text-[1.55rem] text-center">
            Manchester United
          </span>
          <div tw="px-6 w-full flex">
            <div tw="rounded-md bg-[#F8F2F7] flex justify-between items-center w-full text-[#9787A5] text-[2.25rem] pl-2 pr-4 py-2">
              <Bettor width={60} height={60} />
              <span>{3}</span>
            </div>
          </div>
          <div tw="px-6 w-full flex">
            <div tw="rounded-md bg-[#F8F2F7] flex justify-between items-center w-full text-[#9787A5] text-[2.25rem] pl-2 pr-4 py-2">
              <img
                src={new URL(SolanaLogo.src, req.url).toString()}
                alt="Pool size (SOL)"
                width={60}
                height={60}
              />
              <span>{3}</span>
            </div>
          </div>
          <div tw="px-6 w-full flex">
            <div tw="rounded-md bg-[#F8F2F7] flex justify-between items-center w-full text-[#9787A5] text-[2.25rem] pl-2 pr-4 py-2">
              <Prize width={60} height={60} />
              <span>{3}</span>
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
