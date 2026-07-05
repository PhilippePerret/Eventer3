//Origine: tests/specs/e2e/ui/split-focus.spec.js
import { test, expect, pane1, press, getErr } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'

test.beforeEach(() => installFixtures('with-links'))

async function gotoApp(page) {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
}

async function openSplit(page) {
  await press(page, 'Alt+2')
  await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
  await expect(page.frameLocator('#pane-2').locator('.project-item').first()).toBeVisible()
}

// ─── data-focused ─────────────────────────────────────────────────────────────

test('au démarrage, pane-1 a data-focused', async ({ page }) => {
  await gotoApp(page)
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
})

test('pane-2 na pas data-focused au démarrage (pas de split)', async ({ page }) => {
  await gotoApp(page)
  await expect(page.locator('#pane-2')).not.toHaveAttribute('data-focused', '')
})

test('Alt+2 → pane-2 reçoit data-focused (auto-focus au chargement)', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
  await expect(page.locator('#pane-1')).not.toHaveAttribute('data-focused', '')
})

// ─── Ctrl+Tab bascule entre panneaux ─────────────────────────────────────────

test('Ctrl+Tab depuis pane-1 → focus passe dans pane-2', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await press(page, 'Alt+1')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  await press(page, 'Control+Tab')
  await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
})

test('Ctrl+Tab depuis pane-2 → focus revient dans pane-1', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await press(page, 'Alt+1')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  await press(page, 'Control+Tab') // → pane-2
  await press(page, 'Control+Tab') // → pane-1
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
})

test('Ctrl+Tab depuis pane-2 → pane-1 reçoit data-focused', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await press(page, 'Control+Tab')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  await expect(page.locator('#pane-2')).not.toHaveAttribute('data-focused', '')
})

// ─── Alt+1 active pane-1 ─────────────────────────────────────────────────────

test('Alt+1 depuis pane-2 → focus revient dans pane-1', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await page.frameLocator('#pane-2').locator('body').click()
  await press(page, 'Alt+1')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
})

test('Alt+1 depuis pane-2 → pane-1 reçoit data-focused', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await press(page, 'Alt+1')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  await expect(page.locator('#pane-2')).not.toHaveAttribute('data-focused', '')
})

// ─── Alt+2 split actif → focus pane-2 ────────────────────────────────────────

test('Alt+2 split actif → focus sur pane-2', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await press(page, 'Alt+1')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  await press(page, 'Alt+2')
  await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
})

// ─── Alt+0 ferme → focus sur pane-1 ─────────────────────────────────────────

test('Alt+0 ferme split → pane-1 reçoit data-focused', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await press(page, 'Alt+0')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  await expect(page.locator('#pane-2')).not.toHaveAttribute('data-focused', '')
})

// ─── Cmd+→/← cycle entre panneaux ────────────────────────────────────────────

test('Cmd+→ depuis pane-1 → data-focused passe à pane-2', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await press(page, 'Alt+1')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  await press(page, 'Meta+ArrowRight')
  await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
})

test('Cmd+→ depuis pane-2 → data-focused passe à pane-1 (cycle)', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await page.frameLocator('#pane-2').locator('body').click()
  await press(page, 'Meta+ArrowRight')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
})

test('Cmd+← depuis pane-2 → data-focused passe à pane-1', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await page.frameLocator('#pane-2').locator('body').click()
  await press(page, 'Meta+ArrowLeft')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
})

test('Cmd+← depuis pane-1 → data-focused passe à pane-2', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await press(page, 'Alt+1')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  await press(page, 'Meta+ArrowLeft')
  await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
})

test('Cmd+→ sans split → aucun changement (pane-1 reste actif)', async ({ page }) => {
  await gotoApp(page)
  await press(page, 'Meta+ArrowRight')
  const focused = await page.evaluate(() => document.activeElement?.id)
  expect(focused).toBe('pane-1')
})
