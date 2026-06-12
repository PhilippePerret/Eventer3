import { test, expect } from '../__setup__.js'
import fs from 'node:fs/promises'
import path from 'node:path'

const appRoot = path.resolve(process.cwd(), '..')
const dataDir = path.join(appRoot, 'data')

test.beforeEach(async ({ page }) => {
  await fs.rm(dataDir, { recursive: true, force: true })
  await page.goto('/')
  await expect(page.locator('.project-item')).toHaveCount(1)
})

test('projet seed → "Intrigue principale" dans le panneau brins', async ({ page }) => {
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  await page.keyboard.press('b')
  await expect(page.locator('#brin-panel')).toBeVisible()
  await expect(page.locator('.brin-item').first()).toContainText('Intrigue principale')
})

test('projet seed → "Votre protagoniste" dans le panneau persos', async ({ page }) => {
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  await page.keyboard.press('p')
  await expect(page.locator('#perso-panel')).toBeVisible()
  await expect(page.locator('.perso-item__title').first()).toContainText('Votre protagoniste')
})
