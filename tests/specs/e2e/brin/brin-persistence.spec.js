import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('with-brins')
})

// fixture with-brins : project-a, events e1/e2, brins b1 (MON) / b2 (AUT)

async function openBrinPanel(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  await pane1(page).locator('#main-panel').press('b')
  await expect(pane1(page).locator('#brin-panel')).toBeVisible()
}

test("brin créé persiste après rechargement de la page", async ({ page }) => {
  await openBrinPanel(page)

  await pane1(page).locator('#main-panel').press('n')
  await pane1(page).locator('.brin-item.selected input[name="title"]').fill('Brin persistant')
  await pane1(page).locator('#main-panel').press('Enter')

  // Vérification immédiate
  await expect(pane1(page).locator('.brin-item').nth(1)).toContainText('Brin persistant')

  // Rechargement de la page
  await page.reload()

  // Navigation vers le panel brins
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  await pane1(page).locator('#main-panel').press('b')
  await expect(pane1(page).locator('#brin-panel')).toBeVisible()

  // Le brin créé doit être visible
  const brins = pane1(page).locator('.brin-item')
  const brinPersistant = brins.filter({ hasText: 'Brin persistant' })
  await expect(brinPersistant).toBeVisible()

  // Le badge du nouveau brin doit être non vide (stocké en DB)
  const badge = brinPersistant.locator('[data-property="badge"]')
  await expect(badge).not.toHaveText('')
})

test("brin créé a bien un badge affiché après rechargement", async ({ page }) => {
  await openBrinPanel(page)

  await pane1(page).locator('#main-panel').press('n')
  await pane1(page).locator('.brin-item.selected input[name="title"]').fill('Nouveau Brin')
  await pane1(page).locator('#main-panel').press('Enter')

  // Attendre que le DOM reflète la création et que le save réseau soit terminé
  await expect(pane1(page).locator('.brin-item').nth(1)).toContainText('Nouveau Brin')
  await page.waitForLoadState('networkidle')

  // Recharger
  await page.reload()
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  await pane1(page).locator('#main-panel').press('b')
  await expect(pane1(page).locator('#brin-panel')).toBeVisible()

  // Le second brin (inséré après le premier) doit avoir un badge non vide
  const newBrin = pane1(page).locator('.brin-item').nth(1)
  await expect(newBrin).toContainText('Nouveau Brin')
  await expect(newBrin.locator('[data-property="badge"]')).not.toHaveText('')
})
