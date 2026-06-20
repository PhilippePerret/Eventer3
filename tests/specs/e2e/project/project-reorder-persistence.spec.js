import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-projects')
})

test("l'ordre des projets est persisté après rechargement", async ({ page }) => {
  await page.goto('/')

  const items = pane1(page).locator('.project-item')

  // Ordre initial
  await expect(items.nth(0)).toContainText('Projet A')
  await expect(items.nth(1)).toContainText('Projet B')

  // Déplacer Projet A après Projet B
  await pane1(page).locator('body').press('Meta+ArrowDown')
  await expect(items.nth(0)).toContainText('Projet B')
  await expect(items.nth(1)).toContainText('Projet A')

  // Attendre la sauvegarde (debounce 300ms)
  await page.waitForTimeout(500)

  // Recharger la page
  await page.reload()
  await page.waitForLoadState('networkidle')

  // L'ordre doit être persisté
  await expect(items.nth(0)).toContainText('Projet B')
  await expect(items.nth(1)).toContainText('Projet A')
})

test("plusieurs déplacements sont persistés", async ({ page }) => {
  await page.goto('/')

  const items = pane1(page).locator('.project-item')

  // Projet A → bas × 2 : [B, C, A, ...]
  await pane1(page).locator('body').press('Meta+ArrowDown')
  await pane1(page).locator('body').press('Meta+ArrowDown')
  await expect(items.nth(0)).toContainText('Projet B')
  await expect(items.nth(1)).toContainText('Projet C')
  await expect(items.nth(2)).toContainText('Projet A')

  await page.waitForTimeout(500)
  await page.reload()
  await page.waitForLoadState('networkidle')

  await expect(items.nth(0)).toContainText('Projet B')
  await expect(items.nth(1)).toContainText('Projet C')
  await expect(items.nth(2)).toContainText('Projet A')
})
