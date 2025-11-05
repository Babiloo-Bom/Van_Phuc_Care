import vue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.nuxt/**',
      '.output/**',
      '*.config.js',
      '*.config.ts',
      'public/**',
      '**/*.vue', // Tạm thời bỏ qua Vue files do parsing error với ESLint v9
    ],
  },
  // Vue files - must come first with proper parser
  ...vue.configs['flat/recommended'].map((config) => ({
    ...config,
    languageOptions: {
      ...config.languageOptions,
      parser: vueParser,
      parserOptions: {
        ...config.languageOptions?.parserOptions,
        parser: tseslint.parser,
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: false,
        },
      },
    },
  })),
  {
    files: ['**/*.vue'],
    rules: {
      'vue/html-indent': ['error', 2],
      'vue/script-indent': ['error', 2, {
        baseIndent: 1,
        switchCase: 1,
      }],
      'vue/max-attributes-per-line': ['warn', {
        singleline: 3,
        multiline: 1,
      }],
      'vue/html-self-closing': ['error', {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      }],
      'vue/require-default-prop': 'off',
      'vue/require-prop-types': 'warn',
      'no-console': 'warn',
      'no-debugger': 'warn',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'arrow-parens': ['error', 'as-needed'],
      'max-len': ['warn', 120, {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      }],
      'indent': 'off', // Turn off base indent rule for Vue files
      'no-shadow': ['error', { allow: ['state', 'getters', 'commit', 'dispatch'] }],
      'no-param-reassign': ['error', { props: false }],
      'prefer-destructuring': 'off',
      'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
      'no-underscore-dangle': 'off',
    },
  },
  // JavaScript files
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'warn',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'arrow-parens': ['error', 'as-needed'],
      'max-len': ['warn', 120, {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      }],
      'indent': ['error', 2, {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        MemberExpression: 1,
        FunctionDeclaration: { parameters: 1, body: 1 },
        FunctionExpression: { parameters: 1, body: 1 },
        CallExpression: { arguments: 1 },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        ignoreComments: false,
      }],
      'no-shadow': ['error', { allow: ['state', 'getters', 'commit', 'dispatch'] }],
      'no-param-reassign': ['error', { props: false }],
      'prefer-destructuring': 'off',
      'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
      'no-underscore-dangle': 'off',
    },
  },
  // TypeScript files
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      'no-console': 'warn',
      'no-debugger': 'warn',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'arrow-parens': ['error', 'as-needed'],
      'max-len': ['warn', 120, {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      }],
      'indent': ['error', 2, {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        MemberExpression: 1,
        FunctionDeclaration: { parameters: 1, body: 1 },
        FunctionExpression: { parameters: 1, body: 1 },
        CallExpression: { arguments: 1 },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        ignoreComments: false,
      }],
      'no-shadow': ['warn', { allow: ['state', 'getters', 'commit', 'dispatch', 'item', 'error', 'params', 'token', 'authData', 'config', 'lesson', 'to', 'from', 'event', 'request', 'nuxtApp'] }],
      'no-param-reassign': ['error', { props: false }],
      'prefer-destructuring': 'off',
      'no-use-before-define': ['warn', { functions: false, classes: true, variables: true }],
      'no-underscore-dangle': 'off',
    },
  },
);
