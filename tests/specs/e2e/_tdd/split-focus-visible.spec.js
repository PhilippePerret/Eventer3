import { test, expect, pane1 } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'

test.beforeEach(() => {
  installFixtures('with-links')
})

async function gotoApp(page) {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
}

async function openSplit(page) {
  await page.keyboard.press('Meta+2')
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

test('Cmd+2 → pane-2 reçoit data-focused (auto-focus au chargement)', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
  await expect(page.locator('#pane-1')).not.toHaveAttribute('data-focused', '')
})

test('Shift+Tab depuis pane-2 → pane-1 reçoit data-focused', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await page.keyboard.press('Shift+Tab')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  await expect(page.locator('#pane-2')).not.toHaveAttribute('data-focused', '')
})

test('Cmd+1 depuis pane-2 → pane-1 reçoit data-focused', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await page.keyboard.press('Meta+1')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  await expect(page.locator('#pane-2')).not.toHaveAttribute('data-focused', '')
})

test('Cmd+0 ferme split → pane-1 reçoit data-focused', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await page.keyboard.press('Meta+0')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  await expect(page.locator('#pane-2')).not.toHaveAttribute('data-focused', '')
})
