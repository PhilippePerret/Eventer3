// Origine : tests/specs/e2e/event/brin-badges-display.spec.js
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

// Fixture filter-events :
//   b1 "Amour romantique" badge=AMO
//   b2 "Intrigue politique" badge=INT
//   e1 "Scène du bal"    brin_ids: [b1]
//   e2 "Arrivée à Paris" brin_ids: [b2]
//   e3 "La trahison"     brin_ids: [b1, b2]
//   e4 "Retour au bal"   brin_ids: []

test.beforeEach(() => {
  installFixtures('filter-events')
})

async function enterListerEvent(page) {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  await pane1(page).locator('.project-item.selected').press('ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
}

test('event avec un brin affiche son badge', async ({ page }) => {
  await enterListerEvent(page)
  const e1 = pane1(page).locator('.event-item').nth(0)
  await expect(e1.locator('.event-brins-marks')).toContainText('AMO')
})

test('event avec deux brins affiche les deux badges', async ({ page }) => {
  await enterListerEvent(page)
  const e3 = pane1(page).locator('.event-item').nth(2)
  await expect(e3.locator('.event-brins-marks')).toContainText('AMO')
  await expect(e3.locator('.event-brins-marks')).toContainText('INT')
})

test('event sans brin a badges vide', async ({ page }) => {
  await enterListerEvent(page)
  const e4 = pane1(page).locator('.event-item').nth(3)
  await expect(e4.locator('.event-brins-marks')).toBeEmpty()
})
