import nextPlugin from "@next/eslint-plugin-next";
import reactConfig from "./react.mjs";

/**
 * Next.js ESLint config for RCPS web app
 * Extends React config with Next.js specific rules
 */
export default [
	...reactConfig,
	{
		name: "rcps/next",
		plugins: {
			"@next/next": nextPlugin,
		},
		rules: {
			// Next.js core rules
			"@next/next/no-html-link-for-pages": "error",
			"@next/next/no-img-element": "warn",
			"@next/next/no-head-import-in-document": "error",
			"@next/next/no-duplicate-head": "error",
			"@next/next/google-font-display": "warn",
			"@next/next/google-font-preconnect": "warn",
			"@next/next/no-sync-scripts": "error",

			// Performance
			"@next/next/no-css-tags": "warn",
			"@next/next/no-page-custom-font": "warn",
		},
	},
];
