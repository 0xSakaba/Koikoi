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
    colors: {
      solana: "#9945FF",
      gray: {
        300: "#9C9C9C",
      },
    },
  },
  plugins: [],
};
export default config;
