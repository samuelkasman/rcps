import nodeConfig from "@rcps/config/eslint/node";

/**
 * ESLint config for RCPS Prisma package
 */
export default [
  ...nodeConfig,
  {
    name: "prisma/overrides",
    rules: {
      // Allow any for Prisma global type declaration
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    name: "prisma/seed",
    files: ["prisma/seed.ts"],
    rules: {
      // Seed scripts need console.log for progress output
      "no-console": "off",
    },
  },
];
