import { test, expect, pane1 } from '../__setup__.js'
import { ERRORS } from '../../../../public/locale/fr/ERRORS.js'

async function gotoApp(page) {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
}

async function openSplit(page, direction = 'Vertical') {
  await page.keyboard.press('Alt+2')
  await pane1(page).locator('.popup-select__option', { hasText: direction }).click()
  await expect(page.frameLocator('#pane-2').locator('.project-item').first()).toBeVisible()
}

// ─── Alt+R sans split ─────────────────────────────────────────────────────────

test('Alt+R sans split actif → notification 6100', async ({ page }) => {
  await gotoApp(page)
  await page.keyboard.press('Alt+r')
  await expect(pane1(page).locator('.notification')).toBeVisible()
  await expect(pane1(page).locator('.notification')).toContainText(ERRORS[6100])
})

// ─── Alt+R bascule direction ──────────────────────────────────────────────────

test('Alt+R depuis vertical → bascule en horizontal', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page, 'Vertical')
  await expect(page.locator('body')).toHaveCSS('flex-direction', 'row')
  await page.keyboard.press('Alt+r')
  await expect(page.locator('body')).toHaveCSS('flex-direction', 'column')
})

test('Alt+R depuis horizontal → bascule en vertical', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page, 'Horizontal')
  await expect(page.locator('body')).toHaveCSS('flex-direction', 'column')
  await page.keyboard.press('Alt+r')
  await expect(page.locator('body')).toHaveCSS('flex-direction', 'row')
})
