import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    // Switch between local and production
    baseURL: process.env.TEST_URL || 'https://mshapir.github.io',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Comment out webServer for production testing
  // Uncomment for local testing
  // webServer: {
  //   command: 'npm run preview',
  //   url: 'http://localhost:4173',
  //   reuseExistingServer: !process.env.CI,
  // },

  globalTeardown: join(__dirname, 'global-teardown.ts'),
});
