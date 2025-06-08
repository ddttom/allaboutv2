import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'spectrum-card.js',
      name: 'SpectrumCard',
      fileName: () => 'spectrum-card.js',
      formats: ['es'],
    },
    outDir: 'dist',
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
    emptyOutDir: true,
  },
}); 
