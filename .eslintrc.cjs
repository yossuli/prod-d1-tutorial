module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    '@hono/eslint-config',
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: { jsx: true },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'comma-style': ['error', 'always'],
    complexity: ['error', 5],
    'max-depth': ['error', 2],
    'max-nested-callbacks': ['error', 3],
    'max-lines': [
      'error',
      { max: 200, skipBlankLines: true, skipComments: true },
    ],
  },
  overrides: [
    {
      files: ['*.js'],
      rules: { '@typescript-eslint/no-var-requires': ['off'] },
    },
  ],
}
