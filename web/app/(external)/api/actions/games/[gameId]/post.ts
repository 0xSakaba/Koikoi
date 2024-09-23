import { SolanaService } from "@/app/(external)/_lib/solana";
import { uuidToBase64 } from "@/app/(external)/_lib/uuidToBase64";
import prisma from "@/prisma";
import { PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

type Input = {
  account: PublicKey;
  gameId: string;
  option: string;
  amount: number;
};

export async function POST(
  req: NextRequest,
  { params }: { params: { gameId: string } }
) {
  const input = await validator(req, params.gameId);
  if ("error" in input) {
    return NextResponse.json(input, { status: 400 });
  }
  const game = await prisma.game.findUnique({
    where: { id: params.gameId },
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
  const teams = game.match.teams.map((e) => e.id).sort();
  const option = input.option === "DRAW" ? 2 : teams.indexOf(input.option);
  if (option === -1) {
    return NextResponse.json({ error: "Invalid Option" }, { status: 400 });
  }

  let user = await prisma.user.findFirst({
    where: {
      wallet: input.account.toString(),
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "",
        wallet: input.account.toString(),
      },
    });
  }

  const identifier = uuidToBase64(user.id);
  const solana = new SolanaService();

  if (!(await solana.checkSpendingAccountCreated(identifier))) {
    solana.createSpendingAccount(identifier);
  }

  const balance = await solana.getSpendingWalletBalance(identifier);
  const requiredBalance = (input.amount + 0.002) * 1e9;
  if (balance < requiredBalance) {
    solana.topup(identifier, requiredBalance - balance, input.account);
  }

  solana.placeBet(
    uuidToBase64(game.id),
    identifier,
    option,
    input.amount * 1e9,
    input.account
  );

  const serialized = await solana.serializeSigned();
  if (!serialized) {
    return NextResponse.json({ error: "Transaction failed" }, { status: 500 });
  }

  await prisma.bet.create({
    data: {
      gameId: game.id,
      bettorId: user.id,
      option: input.option,
      signedBlock: serialized.block.toString(),
      confirmed: false,
    },
  });

  return NextResponse.json({
    transaction: serialized.tx.toString("base64"),
    message: `Bet ${input.amount} SOL for the win of ${input.option}`,
    links: {
      next: {
        type: "inline",
        action: {
          type: "completed",
          label: "Joined",
          icon: `${process.env.SERVER_BASE_URL}/api/actions/games/${params.gameId}/image`,
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
