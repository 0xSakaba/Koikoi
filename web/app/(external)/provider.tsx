"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { ReactNode } from "react";
import { SolanaProvider } from "./_lib/solana/provider";
import { SpendingBalanceProvider } from "./_lib/solana/useSpendingBalance";

export function Provider({ children }: { children: ReactNode }) {
  return (
    <SolanaProvider>
      <PrivyProvider appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}>
        <SpendingBalanceProvider>{children}</SpendingBalanceProvider>
      </PrivyProvider>
    </SolanaProvider>
  );
}
