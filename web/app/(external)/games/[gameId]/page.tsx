import prisma from "@/prisma";
import Home from "./Home";
import { getIronSession } from "iron-session";
import { ironSessionConfig, UserSession } from "@/app/ironSession";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { SolanaService } from "@/app/(external)/_lib/solana";
import { uuidToBase64 } from "@/app/(external)/_lib/uuidToBase64";
import { ElectionProvider } from "../../_components/ElectionProvider";

export default async function Game({ params }: { params: { gameId: string } }) {
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
  const session = await getIronSession<UserSession>(
    cookies(),
    ironSessionConfig
  );

  if (game === null) notFound();
  if (!game.inited) {
    const solana = new SolanaService();
    const created = await solana.checkGameAccountCreated(uuidToBase64(game.id));

    if (!created && game.creatorId !== session.userId) {
      notFound();
    }

    if (created) {
      await prisma.game.update({
        where: { id: game.id },
        data: { inited: true },
      });
      game.inited = true;
    }
  }

  return (
    <ElectionProvider
      isElection={game.match.id === "698a6d62-fa7c-45e0-be9c-70eff4f368f2"}
    >
      <Home game={game} />
    </ElectionProvider>
  );
}
