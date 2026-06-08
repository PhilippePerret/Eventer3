import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('filter-events')
})

// Fixture : 4 events
//   e1 "Scène du bal"     brin_ids: [b1]
//   e2 "Arrivée à Paris"  brin_ids: [b2]
//   e3 "La trahison"      brin_ids: [b1,b2]
//   e4 "Retour au bal"    brin_ids: []

async function enterEventLister(page) {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)
}

// ── Cmd+: affiche le hint immédiatement ───────────────────────────

test('Cmd+: affiche filter-bar avec hint des sous-commandes', async ({ page }) => {
  await enterEventLister(page)
  await expect(page.locator('#filter-bar')).not.toBeVisible()

  await page.keyboard.press('Meta+:')

  await expect(page.locator('#filter-bar')).toBeVisible()
  await expect(page.locator('#filter-bar')).toContainText('t')
  await expect(page.locator('#filter-bar')).toContainText('b')
  await expect(page.locator('#filter-bar')).toContainText('p')
})

test('Escape depuis filter-sequence ferme le hint', async ({ page }) => {
  await enterEventLister(page)
  await page.keyboard.press('Meta+:')
  await expect(page.locator('#filter-bar')).toBeVisible()

  await page.keyboard.press('Escape')

  await expect(page.locator('#filter-bar')).not.toBeVisible()
})

// ── Cmd+: + t : ouvre l'input de filtre texte ─────────────────────

test('Cmd+: puis t affiche un input de filtre texte', async ({ page }) => {
  await enterEventLister(page)
  await expect(page.locator('#filter-input')).not.toBeVisible()

  await page.keyboard.press('Meta+:')
  await page.keyboard.press('t')

  await expect(page.locator('#filter-input')).toBeVisible()
  await expect(page.locator('#filter-input')).toBeFocused()
})

// ── filtrage live (sans Enter) ─────────────────────────────────────

test('filtrage live : "bal" filtre dès la frappe sans Enter', async ({ page }) => {
  await enterEventLister(page)

  await page.keyboard.press('Meta+:')
  await page.keyboard.press('t')
  await page.keyboard.type('bal')
  // Pas de Enter — filtre live

  const items = page.locator('.event-item')
  await expect(items.nth(0)).not.toHaveClass(/hidden/)  // "Scène du bal"
  await expect(items.nth(1)).toHaveClass(/hidden/)       // "Arrivée à Paris"
  await expect(items.nth(2)).toHaveClass(/hidden/)       // "La trahison"
  await expect(items.nth(3)).not.toHaveClass(/hidden/)  // "Retour au bal"
})

test('filtrage live : insensible à la casse', async ({ page }) => {
  await enterEventLister(page)

  await page.keyboard.press('Meta+:')
  await page.keyboard.press('t')
  await page.keyboard.type('BAL')

  await expect(page.locator('.event-item').nth(0)).not.toHaveClass(/hidden/)
  await expect(page.locator('.event-item').nth(3)).not.toHaveClass(/hidden/)
  await expect(page.locator('.event-item').nth(1)).toHaveClass(/hidden/)
})

// ── Enter ferme l'input, filtre reste actif ────────────────────────

test("Enter ferme l'input sans annuler le filtre", async ({ page }) => {
  await enterEventLister(page)

  await page.keyboard.press('Meta+:')
  await page.keyboard.press('t')
  await page.keyboard.type('bal')
  await page.keyboard.press('Enter')

  await expect(page.locator('#filter-input')).not.toBeVisible()
  await expect(page.locator('.event-item').nth(1)).toHaveClass(/hidden/)
  await expect(page.locator('.event-item').nth(2)).toHaveClass(/hidden/)
})

// ── navigation saute les items cachés ─────────────────────────────

test('navigation ↓ saute les items cachés par le filtre', async ({ page }) => {
  await enterEventLister(page)

  await page.keyboard.press('Meta+:')
  await page.keyboard.press('t')
  await page.keyboard.type('bal')
  await page.keyboard.press('Enter')

  await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)
  await page.keyboard.press('ArrowDown')

  await expect(page.locator('.event-item').nth(3)).toHaveClass(/selected/)
  await expect(page.locator('.event-item').nth(1)).not.toHaveClass(/selected/)
})

// ── FilterBar affiche le filtre actif ─────────────────────────────

test('FilterBar affiche le terme de filtre texte actif', async ({ page }) => {
  await enterEventLister(page)

  await page.keyboard.press('Meta+:')
  await page.keyboard.press('t')
  await page.keyboard.type('bal')
  await page.keyboard.press('Enter')

  await expect(page.locator('#filter-bar')).toBeVisible()
  await expect(page.locator('#filter-bar')).toContainText('bal')
})

// ── Cmd+: puis : efface le filtre ─────────────────────────────────

test('Cmd+: puis : efface le filtre texte', async ({ page }) => {
  await enterEventLister(page)

  await page.keyboard.press('Meta+:')
  await page.keyboard.press('t')
  await page.keyboard.type('bal')
  await page.keyboard.press('Enter')

  await expect(page.locator('.event-item').nth(1)).toHaveClass(/hidden/)

  await page.keyboard.press('Meta+:')
  await page.keyboard.press(':')

  const items = page.locator('.event-item')
  await expect(items.nth(0)).not.toHaveClass(/hidden/)
  await expect(items.nth(1)).not.toHaveClass(/hidden/)
  await expect(items.nth(2)).not.toHaveClass(/hidden/)
  await expect(items.nth(3)).not.toHaveClass(/hidden/)
})

// ── Escape annule le filtre texte ─────────────────────────────────

test("Escape dans l'input annule le filtre texte", async ({ page }) => {
  await enterEventLister(page)

  await page.keyboard.press('Meta+:')
  await page.keyboard.press('t')
  await page.keyboard.type('bal')
  await page.keyboard.press('Escape')

  await expect(page.locator('#filter-input')).not.toBeVisible()

  const items = page.locator('.event-item')
  await expect(items.nth(0)).not.toHaveClass(/hidden/)
  await expect(items.nth(1)).not.toHaveClass(/hidden/)
  await expect(items.nth(2)).not.toHaveClass(/hidden/)
  await expect(items.nth(3)).not.toHaveClass(/hidden/)
})

// ── Cmd+: + b/p : sélecteur brins / persos ────────────────────────

test('Cmd+: puis b ouvre le sélecteur de brins pour filtre', async ({ page }) => {
  await enterEventLister(page)

  await page.keyboard.press('Meta+:')
  await page.keyboard.press('b')

  await expect(page.locator('#filter-selector-panel')).toBeVisible()
})

test('Cmd+: puis p ouvre le sélecteur de persos pour filtre', async ({ page }) => {
  await enterEventLister(page)

  await page.keyboard.press('Meta+:')
  await page.keyboard.press('p')

  await expect(page.locator('#filter-selector-panel')).toBeVisible()
})

