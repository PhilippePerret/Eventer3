import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('with-brins')
})

// fixture with-brins : project-a, events e1/e2, brins b1 (MON) / b2 (AUT)

async function openBrinPanel(page) {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  await page.keyboard.press('b')
  await expect(page.locator('#brin-panel')).toBeVisible()
}

test("brin créé persiste après rechargement de la page", async ({ page }) => {
  await openBrinPanel(page)

  await page.keyboard.press('n')
  await page.locator('.brin-item.selected input[name="title"]').fill('Brin persistant')
  await page.keyboard.press('Enter')

  // Vérification immédiate
  await expect(page.locator('.brin-item').nth(1)).toContainText('Brin persistant')

  // Rechargement de la page
  await page.reload()

  // Navigation vers le panel brins
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  await page.keyboard.press('b')
  await expect(page.locator('#brin-panel')).toBeVisible()

  // Le brin créé doit être visible
  const brins = page.locator('.brin-item')
  const brinPersistant = brins.filter({ hasText: 'Brin persistant' })
  await expect(brinPersistant).toBeVisible()

  // Le badge du nouveau brin doit être non vide (stocké en DB)
  const badge = brinPersistant.locator('[data-property="badge"]')
  await expect(badge).not.toHaveText('')
})

test("brin créé a bien un badge affiché après rechargement", async ({ page }) => {
  await openBrinPanel(page)

  await page.keyboard.press('n')
  await page.locator('.brin-item.selected input[name="title"]').fill('Nouveau Brin')
  await page.keyboard.press('Enter')

  // Attendre que le DOM reflète la création et que le save réseau soit terminé
  await expect(page.locator('.brin-item').nth(1)).toContainText('Nouveau Brin')
  await page.waitForLoadState('networkidle')

  // Recharger
  await page.reload()
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  await page.keyboard.press('b')
  await expect(page.locator('#brin-panel')).toBeVisible()

  // Le second brin (inséré après le premier) doit avoir un badge non vide
  const newBrin = page.locator('.brin-item').nth(1)
  await expect(newBrin).toContainText('Nouveau Brin')
  await expect(newBrin.locator('[data-property="badge"]')).not.toHaveText('')
})
