import nodeConfig from "@rcps/config/eslint/node";

/**
 * ESLint config for RCPS API (Express/Node.js)
 */
export default [
  ...nodeConfig,
  {
    name: "api/overrides",
    rules: {
      // Add any api-specific rule overrides here
    },
  },
];
