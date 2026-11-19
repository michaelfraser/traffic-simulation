import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist"; // (Added)
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  { ignores: ["coverage/**", "dist", "node_modules", "vite.config.ts"] },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  perfectionist.configs["recommended-natural"], // (Added preset)
  prettierConfig,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2025,
      },
      parserOptions: {
        projectService: {
          allowDefaultProject: ["eslint.config.js", "vite.config.ts"],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // --- Performance & Strictness Rules for Simulations ---

      // Enforce consistent type imports (keeps bundle size lean for Vite/esbuild)
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "inline-type-imports", prefer: "type-imports" },
      ],

      // Prevent accidental 'any' casting which destroys v8 optimization/inlining in hot loops
      "@typescript-eslint/no-explicit-any": "error",

      // Catch floating promises or unawaited asynchronous logic
      "@typescript-eslint/no-floating-promises": "error",

      // Ban non-null assertions (!) to force proper optional handling in spatial lookups
      "@typescript-eslint/no-non-null-assertion": "error",

      // Disallow unused variables/parameters to keep math helper modules clean
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // Enforce strict equality to avoid silent type-coercion bugs in physics/math checks
      eqeqeq: ["error", "always"],

      "perfectionist/sort-imports": [
        "error",
        {
          groups: [
            "type",
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "unknown",
          ],
          order: "asc",
          type: "natural",
        },
      ],
    },
  },
  {
    files: ["**/*.test.ts", "**/*.spec.ts"],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
]);
