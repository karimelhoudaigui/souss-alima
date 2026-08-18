import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FAFAF9",
        surface: "#FFFFFF",
        subtle: "#F5F5F4",
        line: "#E7E5E4",
        ink: "#171717",
        muted: "#737373",
        faint: "#A3A3A3",
        brand: {
          DEFAULT: "#165B4B",
          hover: "#10463B",
          soft: "#E7F1EE",
          line: "#BCD8D1"
        }
      }
    }
  },
  plugins: []
};

export default config;
