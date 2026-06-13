import { test, expect, pane1 } from '../__setup__.js'
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
  await page.keyboard.press('Meta+2')
  await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
  await expect(page.frameLocator('#pane-2').locator('.project-item').first()).toBeVisible()
}

// ─── Cmd+2 ouvre le split ─────────────────────────────────────────────────────

test('Cmd+2 + Vertical → second panneau visible', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await expect(page.locator('#pane-2')).toBeVisible()
})

test("Cmd+2 + Vertical → l'iframe pane-2 charge la liste des projets", async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await expect(page.frameLocator('#pane-2').locator('.project-item').first()).toBeVisible()
})

test('Cmd+2 une deuxième fois → idempotent (pane-2 reste unique)', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await page.keyboard.press('Meta+1')
  await page.keyboard.press('Meta+2')
  await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
  await expect(page.locator('#pane-2')).toHaveCount(1)
})

// ─── Cmd+0 ferme le split ─────────────────────────────────────────────────────

test('Cmd+0 après Cmd+2 → second panneau masqué', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await page.keyboard.press('Meta+0')
  await expect(page.locator('#pane-2')).not.toBeVisible()
})

test('Cmd+0 sans split actif → notification erreur 6100', async ({ page }) => {
  await gotoApp(page)
  await page.keyboard.press('Meta+0')
  await expect(pane1(page).locator('.notification')).toBeVisible()
  await expect(pane1(page).locator('.notification')).toContainText(ERRORS[6100])
})

// ─── Maj+Tab bascule entre les panneaux ──────────────────────────────────────

test('Maj+Tab depuis pane 1 → focus passe dans pane 2', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await page.keyboard.press('Meta+1')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  await page.keyboard.press('Shift+Tab')
  await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
})

test('Maj+Tab depuis pane 2 → focus revient dans pane 1', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await page.keyboard.press('Meta+1')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  await page.keyboard.press('Shift+Tab') // → pane 2
  await page.keyboard.press('Shift+Tab') // → pane 1
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
})

// ─── Cmd+1 active le pane 1 ───────────────────────────────────────────────────

test('Cmd+1 depuis pane 2 → focus revient dans pane 1', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await page.frameLocator('#pane-2').locator('body').click()
  await page.keyboard.press('Meta+1')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
})
