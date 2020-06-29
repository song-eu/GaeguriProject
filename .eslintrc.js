module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	extends: [
		// Airbnb style guide 적용
		'airbnb-base',
		// TypeScript ESLint recommanded style 적용
		'plugin:@typescript-eslint/eslint-recommended',
		'prettier',
		'plugin:@typescript-eslint/recommended',
		'prettier/@typescript-eslint',
		'plugin:prettier/recommended',
	],
	root: true,
	env: {
		commonjs: true,
		node: true,
		es6: true,
	},
	rules: {
		'no-console': 'off',
		'import/prefer-default-export': 'off',
		'object-literal-sort-keys': false,
		'ordered-imports': true,
		'interface-name': false,
		'strict-null-checks': false,
		'no-submodule-imports': false,
	},
};
