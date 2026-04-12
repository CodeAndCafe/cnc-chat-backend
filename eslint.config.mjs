import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
      },
    },
  },
  {
    rules: {
      /* ===== Node / Express ===== */
      "no-console": "off",
      "no-undef": "off",

      /* ===== TypeScript ===== */
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",

      /* ===== Clean code ===== */
      "prefer-const": "warn",
    },
  },
  prettier,
];
