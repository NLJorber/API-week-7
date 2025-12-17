import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    // Node (backend) files
    files: ["**/*.{js,cjs,mjs}"],
    ignores: ["public/**"],
    extends: [js.configs.recommended],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node
    }
  },
  {
    // Frontend bundle in /public
    files: ["public/**/*.js"],
    extends: [js.configs.recommended],
    languageOptions: {
      sourceType: "script",
      globals: globals.browser
    }
  }
]);
