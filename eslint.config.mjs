import baseConfig from "@rcps/config/eslint/base";

/**
 * Root ESLint config for RCPS monorepo
 * Apps and packages should have their own config extending the shared configs
 */
export default [
	...baseConfig,
	{
		ignores: ["apps/**", "packages/**"],
	},
];
