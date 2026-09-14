import typescriptEslint from "@typescript-eslint/eslint-plugin";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { importX } from "eslint-plugin-import-x";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";

export default [
  {
    ignores: ["**/node_modules/", "src/fonts/", "tests/qunit/"],
  },
  {
    ...js.configs.recommended,
    files: ["**/*.ts", "{demos,tools}/**/*.{js,cjs,mjs}", "*.config.mjs"],
  },
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
      "simple-import-sort": simpleImportSort,
      "import-x": importX,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 5,
      sourceType: "commonjs",

      parserOptions: {
        project: ["./tsconfig.json", "./tsconfig.tools.json"],
      },
    },

    rules: {
      "no-console": "warn",
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
      "import-x/first": "error",
      "import-x/no-duplicates": "error",
      "import-x/newline-after-import": "warn",
      camelcase: "warn",
    },
  },
  ...typescriptEslint.configs["flat/recommended"].map((config) => ({
    ...config,
    files: ["**/*.ts"],
  })),
  {
    files: ["**/*.ts"],

    rules: {
      "@typescript-eslint/no-inferrable-types": "off",

      "simple-import-sort/imports": [
        "warn",
        {
          groups: [
            // Any import that starts with vex goes next.
            ["^.*/vex.*$"],
            // Imports of the index.ts file next.
            ["^.*/index$"],
            // The rest are just the defaults for the eslint-plugin-simple-import-sort plugin:
            // Search for "default groups" here: https://github.com/lydell/eslint-plugin-simple-import-sort
            ["^\\u0000"],
            ["^@?\\w"],
            ["^"],
            ["^\\."],
          ],
        },
      ],
    },
  },
  {
    files: ["{demos,tools}/**/*.{js,cjs,mjs}", "*.config.mjs"],

    // Disable some eslint rules in build scripts and demos.
    rules: {
      "no-console": "off",
      "no-unused-vars": "off",
      "no-undef": "off",
    },
  },
];
