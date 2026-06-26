// Origine : tests/specs/e2e/bootstrap/start-up.spec.js
import fs from 'node:fs/promises'
import path from 'node:path'
import { test, expect, pane1 } from '../__setup__.js'

const appRoot = path.resolve(process.cwd(), '..')
const dataDir = path.join(appRoot, 'data')


test('l’application démarre correctement', async ({ page }) => {
  page.on('pageerror', error => console.error(error))

  await fs.rm(dataDir, { recursive: true, force: true })

  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toHaveCount(1)
  await expect(pane1(page).locator('#projects-panel')).toHaveClass(/project-list/)
  await expect(pane1(page).locator('.project-list')).toHaveCount(1)
  await expect(pane1(page).locator('.project-item')).toHaveCount(1)
  await expect(pane1(page).locator('.project-item').nth(0)).toContainText('Projet modèle')

})