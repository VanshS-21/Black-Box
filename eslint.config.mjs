import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Additional ignores for generated/external files:
    "playwright-report/**",
    "coverage/**",
    "chrome-extension/**",
    "load-tests/**",
  ]),
  // Custom rules
  {
    rules: {
      // Allow unescaped entities like ' in JSX (displays correctly)
      "react/no-unescaped-entities": "off",
      // Allow explicit any when needed (use sparingly)
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);

export default eslintConfig;
