import { test, expect, pane1 } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'

test.beforeEach(() => {
  installFixtures('with-links')
})

async function gotoEventList(page) {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  await page.keyboard.press('ArrowRight')
  await page.waitForLoadState('networkidle')
  await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
}

async function enterSubLister(page) {
  const depthAttr = await pane1(page).locator('#main-panel').getAttribute('data-depth')
  const nextDepth  = String((depthAttr != null ? parseInt(depthAttr) : 0) + 1)
  await page.keyboard.press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', nextDepth)
}

async function openLinkPopupAndGo(page) {
  await page.keyboard.press('o')
  await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  // "Dans son évènemencier" est la première option (déjà sélectionnée)
  await page.keyboard.press('Enter')
}

// ─── Navigation vers item de niveau 0 ────────────────────────────────────────

test('go vers item racine (e3=Acte III) depuis sous-lister', async ({ page }) => {
  await gotoEventList(page)
  await enterSubLister(page)          // entre dans Acte I
  await page.keyboard.press('ArrowDown') // → e5 (Séq 2 Acte I, lien vers e3)
  await page.keyboard.press('Tab')    // active lien "Acte III"
  await openLinkPopupAndGo(page)
  await expect(pane1(page).locator('.event-item.selected')).toContainText('Acte III')
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '1')
})

// ─── Navigation vers item de niveau 1 ────────────────────────────────────────

test('go vers item depth=1 (e6=Séq 3 Acte I) depuis sous-lister différent', async ({ page }) => {
  await gotoEventList(page)
  await page.keyboard.press('ArrowDown') // → e2 (Acte II)
  await enterSubLister(page)             // entre dans Acte II
  await page.keyboard.press('ArrowDown') // → e9 (Séq 2 Acte II)
  await enterSubLister(page)             // entre dans Séq 2 Acte II
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown') // → e33 (Scène 3, 3 liens)
  await page.keyboard.press('Tab')       // lien 1 : e6 "Séquence 3 de Acte I"
  await openLinkPopupAndGo(page)
  await expect(pane1(page).locator('.event-item.selected')).toContainText('Séquence 3 de Acte I')
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
})

// ─── Navigation vers item de niveau 2 ────────────────────────────────────────

test('go vers item depth=2 (e49=Scène 1 Séq 4 Acte III) depuis sous-lister différent', async ({ page }) => {
  await gotoEventList(page)
  await page.keyboard.press('ArrowDown') // → e2 (Acte II)
  await enterSubLister(page)
  await page.keyboard.press('ArrowDown') // → e9 (Séq 2 Acte II)
  await enterSubLister(page)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown') // → e33
  await page.keyboard.press('Tab')       // lien 1 : e6
  await page.keyboard.press('Tab')       // lien 2 : e49 "Scène 1 de Séquence 4 de Acte III"
  await openLinkPopupAndGo(page)
  await expect(pane1(page).locator('.event-item.selected')).toContainText('Scène 1 de Séquence 4 de Acte III')
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '3')
})
