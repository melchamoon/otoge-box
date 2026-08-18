import eslint from '@eslint/js';
import next from 'eslint-config-next';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'public/**',
      'pages/**',
      'legacy/**',
      'layouts/**',
      'components/**',
      'composables/**',
      'stores/**',
      'utils/**',
      'types/**',
      'enums/**',
      'data/**',
      'locales/**',
      'assets/**',
      'static/**',
      'plugins/**',
      'content/**',
      'amplify.yml',
      'nuxt.config.ts',
      'vuetify.options.ts',
      'index.d.ts',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...next,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'react/no-unescaped-entities': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'import/no-anonymous-default-export': 'off',
    },
  },
);
