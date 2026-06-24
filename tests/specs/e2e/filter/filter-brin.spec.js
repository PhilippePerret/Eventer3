import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

// Fixture filter-events :
//   b1 → e1 "Scène du bal", e3 "La trahison"
//   b2 → e2 "Arrivée à Paris", e3 "La trahison"
//   e4 "Retour au bal" → aucun brin

test.beforeEach(() => {
  installFixtures('filter-events')
})

async function enterListerEvent(page) {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
}

// ── Panneau ───────────────────────────────────────────────────────

test('Cmd+: puis b ouvre le sélecteur de brins', async ({ page }) => {
  await enterListerEvent(page)
  await pane1(page).locator('#main-panel').press('Meta+:')
  await pane1(page).locator('#main-panel').press('b')
  await expect(pane1(page).locator('#filter-selector-panel')).toBeVisible()
})

test('le sélecteur affiche les brins du projet', async ({ page }) => {
  await enterListerEvent(page)
  await pane1(page).locator('#main-panel').press('Meta+:')
  await pane1(page).locator('#main-panel').press('b')
  await expect(pane1(page).locator('.filter-selector-row')).toHaveCount(2)
})

// ── Filtrage réel ─────────────────────────────────────────────────

test('sélectionner b1 masque les events sans b1', async ({ page }) => {
  await enterListerEvent(page)
  await pane1(page).locator('#main-panel').press('Meta+:')
  await pane1(page).locator('#main-panel').press('b')
  await expect(pane1(page).locator('#filter-selector-panel')).toBeVisible()
  await pane1(page).locator('#main-panel').press(' ')      // coche b1 (premier brin)
  await pane1(page).locator('#main-panel').press('Enter')  // applique

  const items = pane1(page).locator('.event-item')
  await expect(items.nth(0)).not.toHaveClass(/hidden/)  // e1 a b1 → visible
  await expect(items.nth(1)).toHaveClass(/hidden/)       // e2 n'a pas b1 → masqué
  await expect(items.nth(2)).not.toHaveClass(/hidden/)  // e3 a b1+b2 → visible
  await expect(items.nth(3)).toHaveClass(/hidden/)       // e4 aucun brin → masqué
})

test('Escape dans le sélecteur n\'applique pas le filtre', async ({ page }) => {
  await enterListerEvent(page)
  await pane1(page).locator('#main-panel').press('Meta+:')
  await pane1(page).locator('#main-panel').press('b')
  await expect(pane1(page).locator('#filter-selector-panel')).toBeVisible()
  await pane1(page).locator('#main-panel').press(' ')      // coche b1
  await pane1(page).locator('#main-panel').press('Escape') // annule

  const items = pane1(page).locator('.event-item')
  await expect(items.nth(0)).not.toHaveClass(/hidden/)
  await expect(items.nth(1)).not.toHaveClass(/hidden/)
  await expect(items.nth(2)).not.toHaveClass(/hidden/)
  await expect(items.nth(3)).not.toHaveClass(/hidden/)
})

test('Cmd+:: efface le filtre brin et réaffiche tous les events', async ({ page }) => {
  await enterListerEvent(page)
  await pane1(page).locator('#main-panel').press('Meta+:')
  await pane1(page).locator('#main-panel').press('b')
  await expect(pane1(page).locator('#filter-selector-panel')).toBeVisible()
  await pane1(page).locator('#main-panel').press(' ')
  await pane1(page).locator('#main-panel').press('Enter')

  // filtre actif : e2 et e4 masqués
  await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/hidden/)

  // effacement
  await pane1(page).locator('#main-panel').press('Meta+:')
  await pane1(page).locator('#main-panel').press(':')

  const items = pane1(page).locator('.event-item')
  await expect(items.nth(0)).not.toHaveClass(/hidden/)
  await expect(items.nth(1)).not.toHaveClass(/hidden/)
  await expect(items.nth(2)).not.toHaveClass(/hidden/)
  await expect(items.nth(3)).not.toHaveClass(/hidden/)
})
