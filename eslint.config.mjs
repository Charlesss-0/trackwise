import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
})

const eslintConfig = [
	{
		ignores: ['**/node_modules', '**/.next'],
	},
	...compat.config({
		extends: [
			'eslint:recommended',
			'plugin:@typescript-eslint/recommended',
			'plugin:import/typescript',
			'plugin:react/recommended',
			'plugin:jsx-a11y/recommended',
			'plugin:import/errors',
			'plugin:import/warnings',
		],
		plugins: ['@typescript-eslint', 'react', 'jsx-a11y', 'import'],
		settings: {
			'import/resolver': {
				typescript: {
					alwaysTryTypes: true,
					project: './tsconfig.json',
				},
			},
		},
		rules: {
			'no-console': 'warn',
			'no-unused-vars': 'off',
			'no-var': 'error',
			'prefer-const': 'error',
			eqeqeq: ['error', 'always'],
			'@typescript-eslint/explicit-function-return-type': 'warn',
			'@typescript-eslint/no-empty-function': 'warn',
			'@typescript-eslint/no-unused-expressions': 'error',
			'@typescript-eslint/no-unused-vars': 'error',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/consistent-type-imports': 'error',
			'@typescript-eslint/array-type': [
				'error',
				{
					default: 'array-simple',
				},
			],
			'@typescript-eslint/no-inferrable-types': 'error',
			'react/react-in-jsx-scope': 'off',
			'react/prop-types': 'off',
			'react/jsx-key': 'error',
			'react/jsx-no-target-blank': 'error',
			'react/self-closing-comp': 'error',
			'jsx-a11y/alt-text': 'warn',
			'jsx-a11y/anchor-is-valid': [
				'error',
				{
					components: ['Link'],
					specialLink: ['hrefLeft', 'hrefRight'],
					aspects: ['noHref', 'invalidHref', 'preferButton'],
				},
			],
			'jsx-a11y/label-has-associated-control': 'error',
			'jsx-a11y/no-redundant-roles': 'error',
			'import/no-unresolved': 'error',
		},
	}),
]

export default eslintConfig
