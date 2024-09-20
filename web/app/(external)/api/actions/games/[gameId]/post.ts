import {
  clusterApiUrl,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

type Input = {
  account: PublicKey;
  gameId: string;
  option: string;
  amount: number;
};

export async function POST(
  req: NextRequest,
  { params }: { params: { gamdId: string } }
) {
  const input = await validator(req, params.gamdId);
  if ("error" in input) {
    return NextResponse.json(input, { status: 400 });
  }

  //// placeholder
  const tx = new Transaction();
  const connection = new Connection(
    clusterApiUrl(process.env.NEXT_PUBLIC_SOLANA_NET)
  );
  tx.add(
    SystemProgram.transfer({
      fromPubkey: input.account,
      toPubkey: new PublicKey("AthTeFmzMkeQE2p8ZMAGZoZ8dUNP79eAJXwB5VZWTDDt"),
      lamports: input.amount * 1e9,
    })
  );
  const recentBlockhash = await connection.getLatestBlockhash();
  tx.recentBlockhash = recentBlockhash.blockhash;
  tx.feePayer = input.account;
  /////////////////

  return NextResponse.json({
    transaction: tx
      .serialize({ requireAllSignatures: false })
      .toString("base64"),
    message: `Bet ${input.amount} SOL for the win of ${input.option}`,
    links: {
      next: {
        type: "inline",
        action: {
          type: "completed",
          label: "Joined",
          icon: `${process.env.SERVER_BASE_URL}/api/actions/games/${params.gamdId}/image`,
          title: "You Joined the Game!",
          description: "Wait for the match to end and see if you win",
        },
      },
    },
  });
}

async function validator(
  req: NextRequest,
  gameId: string
): Promise<Input | { error: string }> {
  const body = await req.json();
  const searchParams = req.nextUrl.searchParams;
  if (!("account" in body)) {
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

  const data = {
    account,
    gameId,
    option: searchParams.get("option") || "",
    amount: Number(searchParams.get("amount")),
  };

  if (data.option.length === 0) {
    return { error: "Invalid Option" };
  }
  if (isNaN(data.amount)) {
    return { error: "Invalid Amount" };
  }

  return data;
}
