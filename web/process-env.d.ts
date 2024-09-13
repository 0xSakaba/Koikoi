declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      POSTGRES_URL: string;
      SESSION_SECRET: string;
      SERVICE_KEY: string;
    }
  }
}

export {};
