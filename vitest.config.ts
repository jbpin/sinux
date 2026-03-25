import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@sinuxjs/core': './packages/core/src',
      '@sinuxjs/react': './packages/react/src',
    },
  },
});
