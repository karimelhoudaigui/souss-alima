import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended
});

export default [
  { ignores: [".next/**", "node_modules/**", "playwright-report/**"] },
  ...compat.config({
    extends: ["next/core-web-vitals"]
  }),
  ...tseslint.configs.recommended,
  {
    plugins: {
      "@next/next": nextPlugin
    },
    rules: {
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }]
    }
  }
];
