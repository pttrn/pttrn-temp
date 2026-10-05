import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

export default defineConfig([
    { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
    js.configs.recommended,
    ...tsEslint.configs.recommended,
    eslintConfigPrettier,
    globalIgnores(['node_modules/**', 'dist/', 'test-results/', 'playwright-report/']),
]);
