import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
  },
  resolve: {
    alias: {
      '@backend/api': path.resolve(__dirname, './apps/api/src'),
      '@backend/common': path.resolve(__dirname, './libs/common/src'),
      '@backend/domain': path.resolve(__dirname, './libs/domain/src'),
      '@backend/outbound/google': path.resolve(__dirname, './libs/outbound/google/src'),
      '@backend/outbound/rdb': path.resolve(__dirname, './libs/outbound/rdb/src'),
      '@backend/places': path.resolve(__dirname, './libs/places/src'),
      '@backend/routes': path.resolve(__dirname, './libs/routes/src'),
    },
  },
});
