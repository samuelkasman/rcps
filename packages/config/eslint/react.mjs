import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import baseConfig from "./base.mjs";

/**
 * React ESLint config for RCPS React projects
 * Extends base config with React and React Hooks rules
 */
export default [
	...baseConfig,
	{
		name: "rcps/react",
		files: ["**/*.{jsx,tsx}"],
		plugins: {
			react,
			"react-hooks": reactHooks,
		},
		languageOptions: {
			globals: {
				...globals.browser,
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		settings: {
			react: {
				version: "detect",
			},
		},
		rules: {
			// React
			"react/react-in-jsx-scope": "off",
			"react/prop-types": "off",
			"react/jsx-uses-react": "off",
			"react/jsx-key": "warn",
			"react/no-unescaped-entities": "warn",
			"react/self-closing-comp": "warn",

			// React Hooks
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "warn",
		},
	},
];
