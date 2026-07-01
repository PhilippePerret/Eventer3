import { test, expect, pane1, press, getErr } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { ERRORS } from '../../../../public/locale/fr/ERRORS.js'

test.beforeEach(() => {
  installFixtures('with-links')
})

async function gotoApp(page) {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
}

// ─── État initial ─────────────────────────────────────────────────────────────

test('pas de second panneau au démarrage', async ({ page }) => {
  await gotoApp(page)
  await expect(page.locator('#pane-2')).not.toBeVisible()
})

async function openSplit(page) {
  await press(page, 'Alt+2')
  await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
  await expect(page.frameLocator('#pane-2').locator('.project-item').first()).toBeVisible()
}

// ─── Alt+2 ouvre le split ─────────────────────────────────────────────────────

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

test('Alt+2 une deuxième fois → idempotent (pane-2 reste unique)', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await press(page, 'Alt+1')
  await press(page, 'Alt+2')
  // split déjà actif → focus pane-2 seulement, pas de popup ni nouveau pane
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

// ─── Maj+Tab bascule entre les panneaux ──────────────────────────────────────

test('Maj+Tab depuis pane 1 → focus passe dans pane 2', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await press(page, 'Alt+1')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  await press(page, 'Shift+Tab')
  await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
})

test('Maj+Tab depuis pane 2 → focus revient dans pane 1', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await press(page, 'Alt+1')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  await press(page, 'Shift+Tab') // → pane 2
  await press(page, 'Shift+Tab') // → pane 1
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
})

// ─── Alt+1 active le pane 1 ──────────────────────────────────────────────────

test('Alt+1 depuis pane 2 → focus revient dans pane 1', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await page.frameLocator('#pane-2').locator('body').click()
  await press(page, 'Alt+1')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
})
