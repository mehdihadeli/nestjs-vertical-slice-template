import { defineConfig } from 'vitest/config';

import { createVitestTestInlineConfig } from './create-vitest-test-inline-config.js';

export default defineConfig({
  test: createVitestTestInlineConfig('(unit|e2e)'),
});
