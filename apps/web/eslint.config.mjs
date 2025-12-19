import nextConfig from "@rcps/config/eslint/next";

/**
 * ESLint config for RCPS web app (Next.js)
 */
export default [
  ...nextConfig,
  {
    name: "web/api-routes",
    files: ["src/app/api/**/*.ts"],
    rules: {
      // NextAuth and API routes often require flexible typing
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
