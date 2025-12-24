import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.mts'],
    coverage: {
      reporter: ['text', 'html'],
      provider: 'v8',
    },
  },
  plugins: [tsconfigPaths()],
});
