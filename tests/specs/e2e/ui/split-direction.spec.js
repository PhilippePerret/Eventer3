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

// ─── Alt+2 (clavier principal et pavé numérique) ──────────────────────────────

test('Alt+2 affiche un popup vertical/horizontal', async ({ page }) => {
  await gotoApp(page)
  await press(page, 'Alt+2')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
})

test('Alt+2 pavé numérique affiche aussi le popup', async ({ page }) => {
  await gotoApp(page)
  await press(page, 'Alt+Numpad2')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
})

test('popup contient les options Vertical et Horizontal', async ({ page }) => {
  await gotoApp(page)
  await press(page, 'Alt+2')
  const popup = pane1(page).locator('.popup-select')
  await expect(popup.locator('.popup-select__option', { hasText: 'Vertical' })).toBeVisible()
  await expect(popup.locator('.popup-select__option', { hasText: 'Horizontal' })).toBeVisible()
})

// ─── Choix Vertical ───────────────────────────────────────────────────────────

test('choisir Vertical → pane-2 visible', async ({ page }) => {
  await gotoApp(page)
  await press(page, 'Alt+2')
  await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
  await expect(page.locator('#pane-2')).toBeVisible()
})

test('split Vertical → body#shell flex-direction = row', async ({ page }) => {
  await gotoApp(page)
  await press(page, 'Alt+2')
  await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
  const dir = await page.evaluate(() => document.body.style.flexDirection || getComputedStyle(document.body).flexDirection)
  expect(dir).toBe('row')
})

// ─── Choix Horizontal ─────────────────────────────────────────────────────────

test('choisir Horizontal → pane-2 visible', async ({ page }) => {
  await gotoApp(page)
  await press(page, 'Alt+2')
  await pane1(page).locator('.popup-select__option', { hasText: 'Horizontal' }).click()
  await expect(page.locator('#pane-2')).toBeVisible()
})

test('split Horizontal → body#shell flex-direction = column', async ({ page }) => {
  await gotoApp(page)
  await press(page, 'Alt+2')
  await pane1(page).locator('.popup-select__option', { hasText: 'Horizontal' }).click()
  await expect(page.locator('#pane-2')).toBeVisible()
  await page.waitForFunction(() => document.body.style.flexDirection === 'column')
  const dir = await page.evaluate(() => document.body.style.flexDirection)
  expect(dir).toBe('column')
})

// ─── Alt+2 split déjà actif → focus pane-2 ───────────────────────────────────

test('Alt+2 split actif → focus sur pane-2', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await press(page, 'Alt+1')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  await press(page, 'Alt+2')
  await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
})
