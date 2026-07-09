// Origine : tests/specs/e2e/apparence/style-panel-new-features.spec.js
import { test, expect, pane1, press, getErr } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'

async function openStylePanel(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await press(page, 's')
  await expect(pane1(page).locator('#style-panel')).toBeVisible()
}

// ─── ↩︎ coche/décoche ──────────────────────────────────────────────────────────

test('Enter coche le style sélectionné', async ({ page }) => {
  installFixtures('with-styles')
  await openStylePanel(page)
  await expect(pane1(page).locator('.style-item').nth(0)).not.toHaveClass(/checked/)
  await press(page, 'Enter')
  await expect(pane1(page).locator('.style-item').nth(0)).toHaveClass(/checked/)
})

test('Enter décoche le style déjà coché', async ({ page }) => {
  installFixtures('with-styles')
  await openStylePanel(page)
  await press(page, 'Enter')
  await press(page, 'Enter')
  await expect(pane1(page).locator('.style-item').nth(0)).not.toHaveClass(/checked/)
})

// ─── Lettres a/b/c ─────────────────────────────────────────────────────────────

test("'a' coche/décoche le premier style", async ({ page }) => {
  installFixtures('with-styles')
  await openStylePanel(page)
  await press(page, 'a')
  await expect(pane1(page).locator('.style-item').nth(0)).toHaveClass(/checked/)
  await press(page, 'a')
  await expect(pane1(page).locator('.style-item').nth(0)).not.toHaveClass(/checked/)
})

test("'b' coche/décoche le deuxième style", async ({ page }) => {
  installFixtures('with-styles')
  await openStylePanel(page)
  await press(page, 'b')
  await expect(pane1(page).locator('.style-item').nth(1)).toHaveClass(/checked/)
  await press(page, 'b')
  await expect(pane1(page).locator('.style-item').nth(1)).not.toHaveClass(/checked/)
})

test("lettre affichée dans le style-item (data-letter ou classe visuelle)", async ({ page }) => {
  installFixtures('with-styles')
  await openStylePanel(page)
  const first = pane1(page).locator('.style-item').nth(0)
  const second = pane1(page).locator('.style-item').nth(1)
  await expect(first).toContainText('a')
  await expect(second).toContainText('b')
})

test('Cmd+Enter applique et conserve les changements', async ({ page }) => {
  installFixtures('with-styles')
  await openStylePanel(page)
  await press(page, ' ')  // cocher .titre
  await press(page, 'Meta+Enter')
  await expect(pane1(page).locator('#style-panel')).not.toBeVisible()
  // CSS conservé
  await expect(pane1(page).locator('.event-item').nth(0).locator('.event-title'))
    .toHaveCSS('font-size', '26px')
})

// ─── Titre corrigé (tokens/badges) ─────────────────────────────────────────────

test('titre du panneau affiche le rendu des badges (pas le badge brut)', async ({ page }) => {
  installFixtures('with-styles-badge')
  await openStylePanel(page)
  // e1.title = '@proto arrive', perso c1 badge='@proto' title='Proto'
  // le panel doit afficher "Styles · Proto arrive", pas "@proto arrive"
  const titleEl = pane1(page).locator('#style-panel .panel-title')
  await expect(titleEl).toContainText('Proto arrive')
  await expect(titleEl).not.toContainText('@proto')
})
