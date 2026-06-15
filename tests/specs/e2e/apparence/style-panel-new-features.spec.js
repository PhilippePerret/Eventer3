import { test, expect, pane1 } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'

async function openStylePanel(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  await page.keyboard.press('s')
  await expect(pane1(page).locator('#style-panel')).toBeVisible()
}

// ─── ↩︎ coche/décoche ──────────────────────────────────────────────────────────

test('Enter coche le style sélectionné', async ({ page }) => {
  installFixtures('with-styles')
  await openStylePanel(page)
  await expect(pane1(page).locator('.style-item').nth(0)).not.toHaveClass(/checked/)
  await page.keyboard.press('Enter')
  await expect(pane1(page).locator('.style-item').nth(0)).toHaveClass(/checked/)
})

test('Enter décoche le style déjà coché', async ({ page }) => {
  installFixtures('with-styles')
  await openStylePanel(page)
  await page.keyboard.press('Enter')
  await page.keyboard.press('Enter')
  await expect(pane1(page).locator('.style-item').nth(0)).not.toHaveClass(/checked/)
})

// ─── Lettres a/b/c ─────────────────────────────────────────────────────────────

test("'a' coche/décoche le premier style", async ({ page }) => {
  installFixtures('with-styles')
  await openStylePanel(page)
  await page.keyboard.press('a')
  await expect(pane1(page).locator('.style-item').nth(0)).toHaveClass(/checked/)
  await page.keyboard.press('a')
  await expect(pane1(page).locator('.style-item').nth(0)).not.toHaveClass(/checked/)
})

test("'b' coche/décoche le deuxième style", async ({ page }) => {
  installFixtures('with-styles')
  await openStylePanel(page)
  await page.keyboard.press('b')
  await expect(pane1(page).locator('.style-item').nth(1)).toHaveClass(/checked/)
  await page.keyboard.press('b')
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

// ─── Escape → état initial ──────────────────────────────────────────────────────

test('Escape annule les styles cochés et restaure le CSS initial', async ({ page }) => {
  installFixtures('with-styles')
  await openStylePanel(page)
  await page.keyboard.press(' ')  // cocher .titre → font-size 26px
  await expect(pane1(page).locator('.event-item').nth(0).locator('.event-text'))
    .toHaveCSS('font-size', '26px')
  await page.keyboard.press('Escape')
  // CSS restauré : plus de 26px
  const fontSize = await pane1(page).locator('.event-item').nth(0).locator('.event-text').evaluate(el =>
    parseFloat(getComputedStyle(el).fontSize)
  )
  expect(fontSize).not.toBe(26)
})

test('Escape → à la réouverture, aucun style coché', async ({ page }) => {
  installFixtures('with-styles')
  await openStylePanel(page)
  await page.keyboard.press(' ')  // cocher .titre
  await page.keyboard.press('Escape')
  await expect(pane1(page).locator('#style-panel')).not.toBeVisible()
  await page.keyboard.press('s')
  await expect(pane1(page).locator('#style-panel')).toBeVisible()
  await expect(pane1(page).locator('.style-item').nth(0)).not.toHaveClass(/checked/)
})

test('Cmd+Enter applique et conserve les changements', async ({ page }) => {
  installFixtures('with-styles')
  await openStylePanel(page)
  await page.keyboard.press(' ')  // cocher .titre
  await page.keyboard.press('Meta+Enter')
  await expect(pane1(page).locator('#style-panel')).not.toBeVisible()
  // CSS conservé
  await expect(pane1(page).locator('.event-item').nth(0).locator('.event-text'))
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
