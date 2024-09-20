import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { gameId: string } }
) {
  return NextResponse.json({
    icon: `${process.env.SERVER_BASE_URL}/api/actions/games/${params.gameId}/image`,
    title: "Join the Game: Predict & Win",
    description: "Make your picks now for the match",
    links: {
      actions: [
        {
          label: "Place a Bet",
          href: `/api/actions/games/${params.gameId}?option={option}&amount={amount}`,
          parameters: [
            {
              name: "option",
              type: "radio",
              required: true,
              options: [
                { label: "Arsenal", value: "teamA" },
                { label: "Manchester United", value: "teamB" },
                { label: "Draw", value: "draw" },
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
}
