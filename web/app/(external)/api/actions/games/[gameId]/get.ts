import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

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

  if (game.match.status === "PENDING") {
    return NextResponse.json({
      type: "action",
      icon: `${process.env.SERVER_BASE_URL}/api/actions/games/${params.gameId}/image`,
      title: "Join the Game: Predict & Win",
      description: "Make your picks now for the match",
      links: {
        actions: [
          {
            label: "Place SOL",
            href: `/api/actions/games/${params.gameId}?option={option}&amount={amount}`,
            parameters: [
              {
                name: "option",
                type: "radio",
                required: true,
                options:
                  game.match.id === "698a6d62-fa7c-45e0-be9c-70eff4f368f2"
                    ? [
                        { label: teams[0].name, value: teams[0].id },
                        { label: teams[1].name, value: teams[1].id },
                      ]
                    : [
                        { label: teams[0].name, value: teams[0].id },
                        { label: teams[1].name, value: teams[1].id },
                        { label: "Draw", value: "DRAW" },
                      ],
              },
              {
                name: "amount",
                label: "SOL Amount",
                required: true,
              },
            ],
          },
        ],
      },
    });
  } else {
    return NextResponse.json({
      type: "action",
      icon: `${process.env.SERVER_BASE_URL}/api/actions/games/${params.gameId}/image`,
      title: "Join the Game: Predict & Win",
      description: "Make your picks now for the match",
      label: "Game Finished",
      disabled: true,
    });
  }
}
