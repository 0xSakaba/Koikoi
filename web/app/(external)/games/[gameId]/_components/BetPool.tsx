import SolanaLogo from "@/app/(external)/_assets/solana-black.png";
import clsx from "clsx";
import Image from "next/image";

export function BetPool({
  poolSize,
  className,
}: {
  poolSize: number | null;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "h-12 rounded-md bg-gradient-to-r from-[#fff006] via-[#fe2fc6] to-[#2abbf7] flex items-center justify-center gap-2 text-white px-2",
        className
      )}
    >
      <div className="size-9 rounded-full grid place-items-center">
        <Image src={SolanaLogo.src} alt="Solana Logo" width={37} height={37} />
      </div>
      <span className="text-2xl font-semibold">
        Bet size{" "}
        {poolSize
          ? Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(
              poolSize
            )
          : "..."}{" "}
        SOL
      </span>
    </div>
  );
}
