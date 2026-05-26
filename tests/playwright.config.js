import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  workers: 1,
  fullyParallel: false,
  timeout: 15000,
  expect: { timeout: 5000 },
  globalSetup: './global-setup.js',
  globalTeardown: './global-teardown.js',
  use: {
    baseURL: 'http://127.0.0.1:4567',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'bundle exec ruby app.rb',
    cwd: '..',
    url: 'http://127.0.0.1:4567',
    reuseExistingServer: true,
    timeout: 10000
  }
})
