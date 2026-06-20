import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('with-styles')
})

// fixture: .titre (font-size:26px, underline), .note-rouge (margin-left:10vw, font-size:9px, color:red)
// --bg: #f3f1eb → rgb(243, 241, 235)
// --text: #2f2d29 → rgb(47, 45, 41)

async function goToEventLister(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await pane1(page).locator('body').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
}

async function applyStyle(page, styleName) {
  await pane1(page).locator('body').press('s')
  await expect(pane1(page).locator('#style-panel')).toBeVisible()
  if (styleName === 'note-rouge') await pane1(page).locator('body').press('ArrowDown')
  await pane1(page).locator('body').press(' ')
  await pane1(page).locator('body').press('Meta+Enter')
  await expect(pane1(page).locator('#style-panel')).not.toBeVisible()
}

// ─── Sélection + style ──────────────────────────────────────────────────────

test("event sélectionné avec style color:red → texte blanc (color overridé)", async ({ page }) => {
  await goToEventLister(page)
  await applyStyle(page, 'note-rouge')
  // e1 est sélectionné avec note-rouge (color:red) appliqué
  const color = await pane1(page).locator('.event-item').nth(0).locator('.event-text').evaluate(el =>
    getComputedStyle(el).color
  )
  expect(color).toBe('rgb(255, 255, 255)')
})

test("event non-sélectionné avec style color:red → texte rouge (pas overridé)", async ({ page }) => {
  await goToEventLister(page)
  await applyStyle(page, 'note-rouge')
  // sélectionner e2 → e1 n'est plus sélectionné
  await pane1(page).locator('body').press('ArrowDown')
  await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)
  const color = await pane1(page).locator('.event-item').nth(0).locator('.event-text').evaluate(el =>
    getComputedStyle(el).color
  )
  expect(color).toBe('rgb(255, 0, 0)')
})

// ─── Édition + style ─────────────────────────────────────────────────────────

test("édition d'un event avec style : input a le fond normal (--bg)", async ({ page }) => {
  await goToEventLister(page)
  await applyStyle(page, 'note-rouge')
  await pane1(page).locator('body').press('Enter')
  await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/editing/)
  const bg = await pane1(page).locator('.event-item').nth(0).locator('.event-text').evaluate(el =>
    getComputedStyle(el).backgroundColor
  )
  expect(bg).toBe('rgb(243, 241, 235)')
})

test("édition d'un event avec style color:red : input a la couleur normale (--text)", async ({ page }) => {
  await goToEventLister(page)
  await applyStyle(page, 'note-rouge')
  await pane1(page).locator('body').press('Enter')
  await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/editing/)
  const color = await pane1(page).locator('.event-item').nth(0).locator('.event-text').evaluate(el =>
    getComputedStyle(el).color
  )
  expect(color).toBe('rgb(47, 45, 41)')
})

test("édition d'un event avec margin-left dans le style : l'input a le margin-left appliqué", async ({ page }) => {
  await goToEventLister(page)
  await applyStyle(page, 'note-rouge') // note-rouge: margin-left:10vw
  await pane1(page).locator('body').press('Enter')
  await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/editing/)
  const ml = await pane1(page).locator('.event-item').nth(0).locator('.event-text').evaluate(el =>
    getComputedStyle(el).marginLeft
  )
  expect(ml).not.toBe('0px')
})
