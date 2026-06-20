import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

// ─── Fixture : deep-events ─────────────────────────────────────────────────
// Projet A (UUID-1)
//   lister 2 → [e1 "Évènement un", e2 "Évènement deux", e3 "Évènement trois"]
//   e1 → lister 3 → [e4 "Évènement e4", e5 "Évènement e5"]  (2 enfants)
//   e2, e3 → pas d'enfants

// ─── Évènement ─────────────────────────────────────────────────────────────

test.describe('Delete avec cascade — évènement', () => {

  test.beforeEach(() => installFixtures('deep-events'))

  test('Delete sur évènement sans enfants → pas de dialog', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    await pane1(page).locator('body').press('ArrowDown')    // e2 sélectionné (sans enfants)
    await pane1(page).locator('body').press('Delete')
    await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
    await expect(pane1(page).locator('.event-item')).toHaveCount(2)
  })

  test('Delete sur évènement avec enfants → dialog affiché', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    // e1 sélectionné (2 enfants)
    await pane1(page).locator('body').press('Delete')
    await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  })

  test('dialog : titre contient "Destruction de" et le titre de l\'évènement', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    await pane1(page).locator('body').press('Delete')
    await expect(pane1(page).locator('.confirm-dialog__title')).toContainText('Destruction de')
    await expect(pane1(page).locator('.confirm-dialog__title')).toContainText('Évènement un')
  })

  test('dialog : corps mentionne le bon nombre d\'évènements imbriqués', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    await pane1(page).locator('body').press('Delete')
    await expect(pane1(page).locator('.confirm-dialog__message')).toContainText('2')
    await expect(pane1(page).locator('.confirm-dialog__message')).toContainText('évènement')
  })

  test('Escape dans le dialog → annulation, évènement intact', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    await pane1(page).locator('body').press('Delete')
    await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
    await pane1(page).locator('body').press('Escape')
    await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
    await expect(pane1(page).locator('.event-item')).toHaveCount(3)
  })

  test('saisie incorrecte + Enter → dialog reste, rien n\'est effacé', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    await pane1(page).locator('body').press('Delete')
    await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
    await pane1(page).locator('.confirm-dialog__input').fill('5')
    await pane1(page).locator('body').press('Enter')
    await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
    await expect(pane1(page).locator('.event-item')).toHaveCount(3)
  })

  test('saisie correcte (2) + Enter → cascade détruite, dialog fermé', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    await pane1(page).locator('body').press('Delete')
    await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
    await pane1(page).locator('.confirm-dialog__input').fill('2')
    await pane1(page).locator('body').press('Enter')
    await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
    await expect(pane1(page).locator('.event-item')).toHaveCount(2)   // e2 + e3 restent
  })

  test('suppression cascade persistante après rechargement', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    await pane1(page).locator('body').press('Delete')
    await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
    await pane1(page).locator('.confirm-dialog__input').fill('2')
    await pane1(page).locator('body').press('Enter')
    await expect(pane1(page).locator('.event-item')).toHaveCount(2)
    await page.waitForLoadState('networkidle')
    await page.reload()
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    await pane1(page).locator('body').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    await expect(pane1(page).locator('.event-item')).toHaveCount(2)
  })

})

