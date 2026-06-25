import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1 } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('with-brins')
})

// Fixture with-brins :
//   project-a, events e1/e2, brins b1/b2 — AUCUN personnage défini

async function openPersoPanel(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  await pane1(page).locator('#main-panel').press('p')
  await expect(pane1(page).locator('#persos-panel')).toBeVisible()
}

// ─── Règle : toujours au moins un élément ─────────────────────────────────────

test("ouvrir le panneau sans perso existant → 'Votre protagoniste' créé automatiquement", async ({ page }) => {
  await openPersoPanel(page)
  await expect(pane1(page).locator('.perso-item')).toHaveCount(1)
  await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-item__title')).toHaveText('Votre protagoniste')
})

test("le perso auto-créé est sélectionné", async ({ page }) => {
  await openPersoPanel(page)
  await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
})

test("'Votre protagoniste' survit au rechargement", async ({ page }) => {
  await openPersoPanel(page)
  await page.waitForLoadState('networkidle')
  await page.reload()
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  await pane1(page).locator('#main-panel').press('p')
  await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  await expect(pane1(page).locator('.perso-item')).toHaveCount(1)
  await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-item__title')).toHaveText('Votre protagoniste')
})
