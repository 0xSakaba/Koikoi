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
        purple: {
          100: "#F8F2F7",
          200: "#9787a5",
        },
        red: {
          200: "#e43756",
        },
      },
      boxShadow: {
        md: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        btn100: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
