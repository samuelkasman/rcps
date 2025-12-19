import globals from "globals";
import baseConfig from "./base.mjs";

/**
 * Node.js ESLint config for RCPS API and backend packages
 * Extends base config with Node.js globals
 */
export default [
	...baseConfig,
	{
		name: "rcps/node",
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
		rules: {
			// Allow require in certain cases for Node compatibility
			"@typescript-eslint/no-require-imports": "off",
		},
	},
];
