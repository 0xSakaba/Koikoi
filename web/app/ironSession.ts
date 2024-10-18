if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not set");
}

export type AdminSession = {
  admin: boolean;
};

export type UserSession = {
  userId: string;
  walletNonce?: string;
};

export const ironSessionConfig = {
  password: process.env.SESSION_SECRET!,
  cookieName: "koikoi-session",
};
