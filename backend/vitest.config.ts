/// <reference types="vitest/config" />
import path from 'path';
import { defineConfig } from 'vite';
import { loadEnv } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@libs': path.resolve(__dirname, 'src/libs'),
      '@config': path.resolve(__dirname, 'src/config'),
    },
  },
  test: {
    name: 'ts-only',
    //Enable globals like describe, it, expect
    globals: true,

    isolate: true,
    env: loadEnv('test', process.cwd(), ''),

    pool: 'forks',

    environment: 'node',

    exclude: ['**/node_modules/**', '**/dist/**'],

    coverage: {
      provider: 'v8', // or 'istanbul' — v8 is faster & more accurate
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['**/*.d.ts', '**/*.entity.ts', '**/main.ts', '**/*.module.ts', '**/index.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },

    reporters: ['default', 'verbose'],
    testTimeout: 120000,
    hookTimeout: 120000,
  },
});
