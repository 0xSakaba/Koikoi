declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      POSTGRES_URL: string;
      SESSION_SECRET: string;
      SERVICE_KEY: string;
      SERVER_BASE_URL: string;
      NEXT_PUBLIC_PRIVY_APP_ID: string;
      PRIVY_APP_SECRET: string;
      NEXT_PUBLIC_SOLANA_NET: "devnet" | "mainnet-beta";
    }
  }
}

export {};
