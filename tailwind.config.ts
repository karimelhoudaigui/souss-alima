import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cedar: "#24483f",
        palm: "#2f6b55",
        linen: "#f6f0e5",
        saffron: "#c7983e"
      }
    }
  },
  plugins: []
};

export default config;
