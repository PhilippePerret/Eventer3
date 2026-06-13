import { test, expect } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { ERRORS } from '../../../../public/locale/fr/ERRORS.js'

test.beforeEach(() => {
  installFixtures('with-links')
})

async function gotoApp(page) {
  await page.goto('/')
  await expect(page.locator('.project-item').first()).toHaveClass(/selected/)
}

// ─── État initial ─────────────────────────────────────────────────────────────

test('pas de second panneau au démarrage', async ({ page }) => {
  await gotoApp(page)
  await expect(page.locator('#split-pane')).not.toBeVisible()
})

// ─── Cmd+2 ouvre le split ─────────────────────────────────────────────────────

test('Cmd+2 → second panneau visible', async ({ page }) => {
  await gotoApp(page)
  await page.keyboard.press('Meta+2')
  await expect(page.locator('#split-pane')).toBeVisible()
})

test('Cmd+2 → second panneau contient un iframe', async ({ page }) => {
  await gotoApp(page)
  await page.keyboard.press('Meta+2')
  await expect(page.locator('#split-pane iframe')).toHaveCount(1)
})

test("Cmd+2 → l'iframe charge la liste des projets", async ({ page }) => {
  await gotoApp(page)
  await page.keyboard.press('Meta+2')
  const frame = page.frameLocator('#split-pane iframe')
  await expect(frame.locator('.project-item').first()).toBeVisible()
})

test('Cmd+2 une deuxième fois → pas de second iframe créé (idempotent)', async ({ page }) => {
  await gotoApp(page)
  await page.keyboard.press('Meta+2')
  await page.keyboard.press('Meta+2')
  await expect(page.locator('#split-pane iframe')).toHaveCount(1)
})

// ─── Cmd+0 ferme le split ─────────────────────────────────────────────────────

test('Cmd+0 après Cmd+2 → second panneau masqué', async ({ page }) => {
  await gotoApp(page)
  await page.keyboard.press('Meta+2')
  await expect(page.locator('#split-pane')).toBeVisible()
  await page.keyboard.press('Meta+0')
  await expect(page.locator('#split-pane')).not.toBeVisible()
})

test('Cmd+0 sans split actif → notification erreur 6100', async ({ page }) => {
  await gotoApp(page)
  await page.keyboard.press('Meta+0')
  await expect(page.locator('.notification')).toBeVisible()
  await expect(page.locator('.notification')).toContainText(ERRORS[6100])
})

// ─── Maj+Tab bascule entre les panneaux ──────────────────────────────────────

test('Maj+Tab depuis pane 1 → focus dans le pane 2', async ({ page }) => {
  await gotoApp(page)
  await page.keyboard.press('Meta+2')
  await page.keyboard.press('Shift+Tab')
  const frame = page.frameLocator('#split-pane iframe')
  await expect(frame.locator('body')).toBeFocused()
})

test('Maj+Tab depuis pane 2 → focus revient dans pane 1', async ({ page }) => {
  await gotoApp(page)
  await page.keyboard.press('Meta+2')
  await page.keyboard.press('Shift+Tab') // → pane 2
  await page.keyboard.press('Shift+Tab') // → pane 1
  await expect(page.locator('#main-panel')).toBeVisible()
  // Le pane 1 est actif : une touche clavier doit répondre
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.project-item').nth(1)).toHaveClass(/selected/)
})

// ─── Cmd+1 active le pane 1 ───────────────────────────────────────────────────

test('Cmd+1 → focus dans pane 1', async ({ page }) => {
  await gotoApp(page)
  await page.keyboard.press('Meta+2')
  await page.keyboard.press('Shift+Tab') // → pane 2
  await page.keyboard.press('Meta+1')   // → pane 1
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.project-item').nth(1)).toHaveClass(/selected/)
})
