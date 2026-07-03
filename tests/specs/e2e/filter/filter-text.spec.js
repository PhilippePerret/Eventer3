// Origine : specs/e2e/filter/filter-text.spec.js
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('filter-events')
})

// Fixture : 4 events
//   e1 "Scène du bal"     brin_ids: [b1]
//   e2 "Arrivée à Paris"  brin_ids: [b2]
//   e3 "La trahison"      brin_ids: [b1,b2]
//   e4 "Retour au bal"    brin_ids: []

async function enterListerEvent(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
}

// ── : ouvre la filter-bar ──────────────────────────────────────────

test(': ouvre la filter-bar avec le champ titre focusé', async ({ page }) => {
  await enterListerEvent(page)
  await expect(pane1(page).locator('#events-panel .filter-bar')).not.toBeVisible()

  await press(page, ':')

  await expect(pane1(page).locator('#events-panel .filter-bar')).toBeVisible()
  await expect(pane1(page).locator('#events-panel .panel-search')).toBeFocused()
})

// ── filtrage live ─────────────────────────────────────────────────

test('filtrage live : "bal" filtre dès la frappe sans Enter', async ({ page }) => {
  await enterListerEvent(page)
  await press(page, ':')
  await pane1(page).locator('#events-panel .panel-search').fill('bal')

  const items = pane1(page).locator('.event-item')
  await expect(items.nth(0)).not.toHaveClass(/hidden/)  // "Scène du bal"
  await expect(items.nth(1)).toHaveClass(/hidden/)       // "Arrivée à Paris"
  await expect(items.nth(2)).toHaveClass(/hidden/)       // "La trahison"
  await expect(items.nth(3)).not.toHaveClass(/hidden/)  // "Retour au bal"
})

test('filtrage live : insensible à la casse', async ({ page }) => {
  await enterListerEvent(page)
  await press(page, ':')
  await pane1(page).locator('#events-panel .panel-search').fill('BAL')

  await expect(pane1(page).locator('.event-item').nth(0)).not.toHaveClass(/hidden/)
  await expect(pane1(page).locator('.event-item').nth(3)).not.toHaveClass(/hidden/)
  await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/hidden/)
})

// ── : une 2e fois efface les filtres ─────────────────────────────

test(': une 2e fois efface le filtre texte et ferme la bar', async ({ page }) => {
  await enterListerEvent(page)
  await press(page, ':')
  await pane1(page).locator('#events-panel .panel-search').fill('bal')
  await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/hidden/)

  await press(page, ':')

  const items = pane1(page).locator('.event-item')
  await expect(items.nth(0)).not.toHaveClass(/hidden/)
  await expect(items.nth(1)).not.toHaveClass(/hidden/)
  await expect(items.nth(2)).not.toHaveClass(/hidden/)
  await expect(items.nth(3)).not.toHaveClass(/hidden/)
})

// ── navigation saute les items cachés ─────────────────────────────

test('navigation ↓ saute les items cachés par le filtre', async ({ page }) => {
  await enterListerEvent(page)
  await press(page, ':')
  await pane1(page).locator('#events-panel .panel-search').fill('bal')

  await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  // refocus lister
  await press(page, 'Escape')
  await press(page, 'ArrowDown')

  await expect(pane1(page).locator('.event-item').nth(3)).toHaveClass(/selected/)
  await expect(pane1(page).locator('.event-item').nth(1)).not.toHaveClass(/selected/)
})
