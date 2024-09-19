import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

type Input = {
  account: PublicKey;
  betId: string;
  option: string;
  amount: number;
};

export async function POST(
  req: NextRequest,
  { params }: { params: { betId: string } }
) {
  const input = await validator(req, params.betId);
  if ("error" in input) {
    return NextResponse.json(input, { status: 400 });
  }

  //// placeholder
  const tx = new Transaction();
  tx.add(
    SystemProgram.transfer({
      fromPubkey: input.account,
      toPubkey: new PublicKey("AthTeFmzMkeQE2p8ZMAGZoZ8dUNP79eAJXwB5VZWTDDt"),
      lamports: input.amount * 1e9,
    })
  );
  /////////////////

  return NextResponse.json({
    transaction: tx.serialize(),
    message: `Bet ${input.amount} SOL for the win of ${input.option}`,
    links: {
      next: {
        type: "inline",
        action: {
          type: "completed",
          icon: `/api/actions/bets/${params.betId}/image`,
          title: "You Joined the Game!",
          description: "Wait for the match to end and see if you win",
        },
      },
    },
  });
}

async function validator(
  req: NextRequest,
  betId: string
): Promise<Input | { error: string }> {
  const body = await req.json();
  const searchParams = req.nextUrl.searchParams;
  if (!("account" in body.account)) {
    return { error: "Missing Account" };
  }

  const account = (() => {
    try {
      return new PublicKey(body.account);
    } catch (error) {
      return "err";
    }
  })();
  if (account === "err") {
    return { error: "Invalid Account" };
  }

  if (typeof body.option !== "string") {
    return { error: "Invalid Option" };
  }
  if (isNaN(Number(body.amount))) {
    return { error: "Invalid Amount" };
  }

  return {
    account,
    betId,
    option: body.option,
    amount: body.amount,
  };
}
