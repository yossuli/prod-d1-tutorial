module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    '@hono/eslint-config',
  ],
  plugins: ['@typescript-eslint', 'import', 'unused-imports'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: { jsx: true },
    extraFileExtensions: ['.json'],
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // 組み込みモジュール
          'external', // npmでインストールした外部ライブラリ
          'internal', // 自作モジュール
          ['parent', 'sibling'],
          'type',
          'object',
          'index',
        ],
        'newlines-between': 'always', // グループ毎にで改行を入れる
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: {
          order: 'asc', // 昇順にソート
          caseInsensitive: true, // 小文字大文字を区別する
        },
        pathGroups: [
          // 指定した順番にソートされる
          {
            pattern: '@/components/common',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/components/hooks',
            group: 'internal',
            position: 'before',
          },
        ],
      },
    ],
    'unused-imports/no-unused-imports': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    complexity: ['error', 5],
    quotes: ['off', 'single', { avoidEscape: true }],
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
