import { test, expect, pane1 } from '../__setup__.js'
import fs from 'node:fs/promises'
import path from 'node:path'

const appRoot = path.resolve(process.cwd(), '..')
const dataDir = path.join(appRoot, 'data')

test.beforeEach(async ({ page }) => {
  await fs.rm(dataDir, { recursive: true, force: true })
  await page.goto('/')
  await expect(pane1(page).locator('.project-item')).toHaveCount(1)
})

test('projet seed → "Intrigue principale" dans le panneau brins', async ({ page }) => {
  await pane1(page).locator('.project-item.selected').press('ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await pane1(page).locator('.event-item.selected').press('b')
  await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  await expect(pane1(page).locator('.brin-item').first()).toContainText('Intrigue principale')
})

test('projet seed → "Votre protagoniste" dans le panneau persos', async ({ page }) => {
  await pane1(page).locator('.project-item.selected').press('ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await pane1(page).locator('.event-item.selected').press('p')
  await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  await expect(pane1(page).locator('.perso-item__title').first()).toContainText('Votre protagoniste')
})
