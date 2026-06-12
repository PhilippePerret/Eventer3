import { test, expect } from '../__setup__.js'
import fs from 'node:fs/promises'
import path from 'node:path'

const appRoot = path.resolve(process.cwd(), '..')
const dataDir = path.join(appRoot, 'data')

test.beforeEach(async ({ page }) => {
  await fs.rm(dataDir, { recursive: true, force: true })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
})

test('projet seed → "Intrigue principale" dans les brins', async ({ page }) => {
  await expect(page.locator('.project-item')).toHaveCount(1)
  await page.keyboard.press('ArrowRight')
  await page.waitForLoadState('networkidle')
  await expect(page.locator('.brin-item, [data-type="brin"]').first()).toContainText('Intrigue principale')
})

test('projet seed → "Votre protagoniste" dans les persos', async ({ page }) => {
  await expect(page.locator('.project-item')).toHaveCount(1)
  await page.keyboard.press('ArrowRight')
  await page.waitForLoadState('networkidle')
  await expect(page.locator('.perso-item, [data-type="perso"]').first()).toContainText('Votre protagoniste')
})
