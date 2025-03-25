import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact, { rules } from 'eslint-plugin-react';

// Prettier 관련 플러그인과 설정 import
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
	{ files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		languageOptions: { globals: globals.browser },
	},
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		plugins: { js, prettier: prettierPlugin },
		extends: ['js/recommended'],
		rules: {
			...js.configs.recommended.rules,
			'prettier/prettier': 'warn',
		},
	},
	tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	prettierConfig,
]);
