// @ts-check

import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginAstro from "eslint-plugin-astro";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([".astro/", "dist/", "public/"]),
  {
    files: ["**/*.{js,ts,astro}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      ...eslintPluginAstro.configs.recommended,
      eslintConfigPrettier,
    ],
  },
]);
