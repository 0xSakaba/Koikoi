import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { betId: string } }
) {
  return NextResponse.json({
    icon: `${process.env.SERVER_BASE_URL}/api/actions/bets/${params.betId}/image`,
    title: "Join the Game: Predict & Win",
    description: "Make your picks now for the match",
    links: {
      actions: [
        {
          label: "Place a Bet",
          href: `/api/actions/bets/${params.betId}?option={option}&amount={amount}`,
          parameters: [
            {
              name: "option",
              type: "radio",
              options: [
                { label: "Arsenal", value: "teamA" },
                { label: "Manchester United", value: "teamB" },
                { label: "Draw", value: "draw" },
              ],
            },
            {
              name: "amount",
              label: "SOL Amount",
            },
          ],
        },
      ],
    },
  });
}
