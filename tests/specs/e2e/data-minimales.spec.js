import { test, expect } from '@playwright/test'
import fs from 'node:fs/promises'
import path from 'node:path'

const appRoot = path.resolve(process.cwd(), '..')
const dataDir = path.join(appRoot, 'data')

test('des données minimales existent toujours à chaque requête serveur', async ({ page }) => {
  await fs.rm(dataDir, { recursive: true, force: true })

  await expect(async () => {
    await fs.access(dataDir)
  }).rejects.toThrow()

  const response = await page.goto('/')

  expect(response.ok()).toBe(true)

  await expect(async () => {
    await fs.access(dataDir)
  }).not.toThrow()
})