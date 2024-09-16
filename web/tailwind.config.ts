import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@premieroctet/next-admin/dist/**/*.{js,ts,jsx,tsx}",
  ],
  // --- for admin ---
  darkMode: "class",
  presets: [require("@premieroctet/next-admin/dist/preset")],
  // -----------------
  theme: {
    extend: {
      colors: {
        solana: {
          light: "#9945FF",
          dark: "#5C2999",
        },
        gray: {
          100: "#E2E9F1",
          200: "#DBDBDB",
          300: "#9C9C9C",
        },
      },
    },
  },
  plugins: [],
};
export default config;
