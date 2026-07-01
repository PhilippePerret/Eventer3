import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

// ─── Fixture : deep-events ─────────────────────────────────────────────────
// Projet A (UUID-1)
//   lister 2 → [e1 "Évènement un", e2 "Évènement deux", e3 "Évènement trois"]
//   e1 → lister 3 → [e4 "Évènement e4", e5 "Évènement e5"]  (2 enfants)
//   e2, e3 → pas d'enfants

// ─── Évènement ─────────────────────────────────────────────────────────────

test.describe('Delete avec cascade — évènement', () => {

  test.beforeEach(() => installFixtures('deep-events'))
  test.afterEach(async ({ page }) => { await page.waitForLoadState('networkidle') })

  test('Delete sur évènement sans enfants → pas de dialog', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    await press(page, 'ArrowDown')    // e2 sélectionné (sans enfants)
    await press(page, 'Delete')
    await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
    await expect(pane1(page).locator('.event-item')).toHaveCount(2)
  })

  test('Delete sur évènement avec enfants → dialog affiché', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    // e1 sélectionné (2 enfants)
    await press(page, 'Delete')
    await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  })

  test('dialog : titre contient "Destruction de" et le titre de l\'évènement', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    await press(page, 'Delete')
    await expect(pane1(page).locator('.confirm-dialog__title')).toContainText('Destruction de')
    await expect(pane1(page).locator('.confirm-dialog__title')).toContainText('Évènement un')
  })

  test('dialog : corps mentionne le bon nombre d\'évènements imbriqués', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    await press(page, 'Delete')
    await expect(pane1(page).locator('.confirm-dialog__message')).toContainText('2')
    await expect(pane1(page).locator('.confirm-dialog__message')).toContainText('évènement')
  })

  test('Annuler dans le dialog (Tab+Enter) → annulation, évènement intact', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    await press(page, 'Delete')
    await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
    await press(page, 'Tab')    // focus passe sur "Annuler"
    await press(page, 'Enter')  // déclenche Annuler → _choose(false)
    await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
    await expect(pane1(page).locator('.event-item')).toHaveCount(3)
  })

  test('saisie incorrecte + Enter → dialog reste, rien n\'est effacé', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    await press(page, 'Delete')
    await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
    await pane1(page).locator('.confirm-dialog__input').fill('5')
    await press(page, 'Enter')
    await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
    await expect(pane1(page).locator('.event-item')).toHaveCount(3)
  })

  test('saisie correcte (2) + Enter → cascade détruite, dialog fermé', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    await press(page, 'Delete')
    await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
    await pane1(page).locator('.confirm-dialog__input').fill('2')
    await press(page, 'Enter')
    await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
    await expect(pane1(page).locator('.event-item')).toHaveCount(2)   // e2 + e3 restent
  })

  test('suppression cascade persistante après rechargement', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    await press(page, 'Delete')
    await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
    await pane1(page).locator('.confirm-dialog__input').fill('2')
    await press(page, 'Enter')
    await expect(pane1(page).locator('.event-item')).toHaveCount(2)
    await page.waitForLoadState('networkidle')
    await page.reload()
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    await expect(pane1(page).locator('.event-item')).toHaveCount(2)
  })

})
