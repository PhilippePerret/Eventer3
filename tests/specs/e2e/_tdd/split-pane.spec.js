//Origine: tests/specs/e2e/ui/split-pane.spec.js
import { test, expect, pane1, press, getErr } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { ERRORS } from '../../../../public/locale/fr/ERRORS.js'

test.beforeEach(() => installFixtures('with-links'))

async function gotoApp(page) {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
}

async function openSplit(page, direction = 'Vertical') {
  await press(page, 'Alt+2')
  await pane1(page).locator('.popup-select__option', { hasText: direction }).click()
  await expect(page.frameLocator('#pane-2').locator('.project-item').first()).toBeVisible()
}

// ─── État initial ─────────────────────────────────────────────────────────────

test('pas de second panneau au démarrage', async ({ page }) => {
  await gotoApp(page)
  await expect(page.locator('#pane-2')).not.toBeVisible()
})

// ─── Alt+2 ouvre le split ─────────────────────────────────────────────────────

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

test('Alt+2 + Vertical → second panneau visible', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await expect(page.locator('#pane-2')).toBeVisible()
})

test("Alt+2 + Vertical → l'iframe pane-2 charge la liste des projets", async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await expect(page.frameLocator('#pane-2').locator('.project-item').first()).toBeVisible()
})

test('split Vertical → body flex-direction = row', async ({ page }) => {
  await gotoApp(page)
  await press(page, 'Alt+2')
  await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
  const dir = await page.evaluate(() => document.body.style.flexDirection || getComputedStyle(document.body).flexDirection)
  expect(dir).toBe('row')
})

test('choisir Horizontal → pane-2 visible', async ({ page }) => {
  await gotoApp(page)
  await press(page, 'Alt+2')
  await pane1(page).locator('.popup-select__option', { hasText: 'Horizontal' }).click()
  await expect(page.locator('#pane-2')).toBeVisible()
})

test('split Horizontal → body flex-direction = column', async ({ page }) => {
  await gotoApp(page)
  await press(page, 'Alt+2')
  await pane1(page).locator('.popup-select__option', { hasText: 'Horizontal' }).click()
  await expect(page.locator('#pane-2')).toBeVisible()
  await page.waitForFunction(() => document.body.style.flexDirection === 'column')
  const dir = await page.evaluate(() => document.body.style.flexDirection)
  expect(dir).toBe('column')
})

test('Alt+2 une deuxième fois → idempotent (pane-2 reste unique)', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await press(page, 'Alt+1')
  await press(page, 'Alt+2')
  await expect(page.locator('#pane-2')).toHaveCount(1)
})

// ─── Alt+0 ferme le split ─────────────────────────────────────────────────────

test('Alt+0 après Alt+2 → second panneau masqué', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await press(page, 'Alt+0')
  await expect(page.locator('#pane-2')).not.toBeVisible()
})

test('Alt+0 sans split actif → notification erreur 6100', async ({ page }) => {
  await gotoApp(page)
  await press(page, 'Alt+0')
  await expect(pane1(page).locator('.notification')).toBeVisible()
  await expect(pane1(page).locator('.notification')).toContainText(ERRORS[6100])
})

// ─── Alt+R rotation ───────────────────────────────────────────────────────────

test('Alt+R sans split actif → notification 6100', async ({ page }) => {
  await gotoApp(page)
  await press(page, 'Alt+r')
  await expect(pane1(page).locator('.notification')).toBeVisible()
  await expect(pane1(page).locator('.notification')).toContainText(ERRORS[6100])
})

test('Alt+R depuis vertical → bascule en horizontal', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page, 'Vertical')
  await expect(page.locator('body')).toHaveCSS('flex-direction', 'row')
  await press(page, 'Alt+r')
  await expect(page.locator('body')).toHaveCSS('flex-direction', 'column')
})

test('Alt+R depuis horizontal → bascule en vertical', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page, 'Horizontal')
  await expect(page.locator('body')).toHaveCSS('flex-direction', 'column')
  await press(page, 'Alt+r')
  await expect(page.locator('body')).toHaveCSS('flex-direction', 'row')
})
