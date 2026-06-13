import { test, expect, pane1 } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'

test.beforeEach(() => installFixtures('with-links'))

async function gotoApp(page) {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
}

async function openSplit(page) {
  await page.keyboard.press('Alt+2')
  await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
  await expect(page.frameLocator('#pane-2').locator('.project-item').first()).toBeVisible()
  // après openSplit : data-focused = pane-2, Playwright keyboard focus = pane-1
}

// ─── Cmd+→ cycle ──────────────────────────────────────────────────────────────

test('Cmd+→ depuis pane-1 → data-focused passe à pane-2', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  // pane-2 a déjà data-focused après openSplit — on force pane-1 d'abord
  await page.keyboard.press('Alt+1')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  // Cmd+→ depuis pane-1 (Playwright keyboard focus = pane-1)
  await page.keyboard.press('Meta+ArrowRight')
  await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
})

test('Cmd+→ depuis pane-2 → data-focused passe à pane-1 (cycle)', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  // pane-2 a data-focused — on bascule Playwright keyboard focus sur pane-2 via click
  await page.frameLocator('#pane-2').locator('body').click()
  await page.keyboard.press('Meta+ArrowRight')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
})

// ─── Cmd+← cycle ──────────────────────────────────────────────────────────────

test('Cmd+← depuis pane-2 → data-focused passe à pane-1', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await page.frameLocator('#pane-2').locator('body').click()
  await page.keyboard.press('Meta+ArrowLeft')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
})

test('Cmd+← depuis pane-1 → data-focused passe à pane-2', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await page.keyboard.press('Alt+1')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  await page.keyboard.press('Meta+ArrowLeft')
  await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
})

// ─── Sans split, Cmd+←/→ ne fait rien ────────────────────────────────────────

test('Cmd+→ sans split → aucun changement (pane-1 reste actif)', async ({ page }) => {
  await gotoApp(page)
  await page.keyboard.press('Meta+ArrowRight')
  const focused = await page.evaluate(() => document.activeElement?.id)
  expect(focused).toBe('pane-1')
})
