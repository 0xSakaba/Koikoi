if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not set");
}

export const ironSessionConfig = {
  password: process.env.SESSION_SECRET!,
  cookieName: "koikoi-session",
};
