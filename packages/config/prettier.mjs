/**
 * Shared Prettier config for RCPS monorepo
 * @type {import("prettier").Config}
 */
const config = {
  // Basics
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed",

  // JSX
  jsxSingleQuote: false,

  // Trailing commas
  trailingComma: "es5",

  // Brackets & spacing
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",

  // Special
  endOfLine: "lf",
  embeddedLanguageFormatting: "auto",
  singleAttributePerLine: false,

  // Plugins
  plugins: [],

  // Overrides for specific file types
  overrides: [
    {
      files: "*.json",
      options: {
        tabWidth: 2,
      },
    },
    {
      files: ["*.yml", "*.yaml"],
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
    {
      files: "*.md",
      options: {
        proseWrap: "preserve",
      },
    },
  ],
};

export default config;
