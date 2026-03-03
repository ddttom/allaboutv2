/**
 * @file vitest.config.js
 * @description vitest config
 * @version 1.0
 * @author Tom Cranstoun
 *
 * @mx:category mx-tools
 * @mx:status active
 * @mx:contentType script
 * @mx:tags test, configuration
 * @mx:partOf mx-os
 */
/*eslint-disable import/no-unresolved*/
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Test environment configuration
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['cloudflare-worker.js'],
      exclude: ['**/*.test.js', 'node_modules/**'],
    },
    // Timeout for integration tests
    testTimeout: 10000,
  },
});
