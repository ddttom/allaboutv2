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
import { existsSync } from 'node:fs';
import { defineConfig } from 'vitest/config';

// Optional cross-check against the MX hub's signer (public-cog-store tests).
// The hub package imports '@mx-reginald-vnext/core' by name; map it to the
// hub source when that checkout exists. Absent, the cross-check test skips.
const HUB_CORE = '/Users/tomcranstoun/Code/MX-hub/mx-reginald/packages/core/src/index.js';

export default defineConfig({
  resolve: {
    alias: existsSync(HUB_CORE) ? { '@mx-reginald-vnext/core': HUB_CORE } : {},
  },
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
