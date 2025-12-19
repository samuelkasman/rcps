import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

/**
 * Base ESLint config for all RCPS packages
 * Includes: JavaScript, TypeScript, and Prettier compatibility
 */
export default tseslint.config(
	js.configs.recommended,
	...tseslint.configs.recommended,
	prettier,
	{
		name: "rcps/base",
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module",
		},
		rules: {
			// TypeScript specific
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				},
			],
			"@typescript-eslint/consistent-type-imports": [
				"warn",
				{ prefer: "type-imports", fixStyle: "inline-type-imports" },
			],
			"@typescript-eslint/no-empty-object-type": "off",

			// General
			"no-console": ["warn", { allow: ["warn", "error", "info"] }],
			"prefer-const": "warn",
		},
	},
	{
		name: "rcps/ignores",
		ignores: [
			"**/node_modules/**",
			"**/dist/**",
			"**/.next/**",
			"**/.turbo/**",
			"**/coverage/**",
			"**/generated/**",
		],
	},
);
