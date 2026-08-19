import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F5F3EE",
        surface: "#FFFEFA",
        subtle: "#E9E3D8",
        line: "#D8CDBC",
        ink: "#17130F",
        muted: "#655D51",
        faint: "#958878",
        brand: {
          DEFAULT: "#123F36",
          hover: "#0D3029",
          soft: "#E4E1D7",
          line: "#9C8C72"
        }
      }
    }
  },
  plugins: []
};

export default config;
