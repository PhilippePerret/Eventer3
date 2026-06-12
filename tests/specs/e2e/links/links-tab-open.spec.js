import { test, expect } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'

test.beforeEach(() => {
  installFixtures('with-links')
})

async function gotoEventList(page) {
  await page.goto('/')
  await expect(page.locator('.project-item').first()).toHaveClass(/selected/)
  await page.keyboard.press('ArrowRight')
  await page.waitForLoadState('networkidle')
  await expect(page.locator('.event-item').first()).toHaveClass(/selected/)
}

async function enterSubLister(page) {
  const depthAttr = await page.locator('#main-panel').getAttribute('data-depth')
  const nextDepth  = String((depthAttr != null ? parseInt(depthAttr) : 0) + 1)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', nextDepth)
}

// ─── TAB navigation ──────────────────────────────────────────────────────────

test('TAB sur item sans lien → notification "aucun lien"', async ({ page }) => {
  await gotoEventList(page)
  // a1 sélectionné : "Acte I", pas de lien
  await page.keyboard.press('Tab')
  await expect(page.locator('.notification')).toBeVisible()
  await expect(page.locator('.notification')).toContainText('aucun lien')
})

test('TAB sur item avec lien → premier lien activé', async ({ page }) => {
  await gotoEventList(page)
  await enterSubLister(page) // entre dans a1 (séquences Acte I)
  await page.keyboard.press('ArrowDown') // → s2a1
  await page.keyboard.press('Tab')
  await expect(page.locator('.event-item.selected .item-link--active')).toHaveCount(1)
  await expect(page.locator('.event-item.selected .item-link--active')).toContainText('Acte III')
})

test('TAB cycle : 2e TAB → 2e lien activé', async ({ page }) => {
  await gotoEventList(page)
  await page.keyboard.press('ArrowDown') // → a2
  await enterSubLister(page)             // entre dans Acte II
  await page.keyboard.press('ArrowDown') // → s2a2
  await enterSubLister(page)             // entre dans Séquence 2
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown') // → sc3s2a2 (3e scène, 2 liens)
  await page.keyboard.press('Tab') // lien 1
  await page.keyboard.press('Tab') // lien 2
  await expect(page.locator('.event-item.selected .item-link--active')).toContainText('Scène 1 de Séquence 4 de Acte III')
})

test('TAB bouclage : après dernier lien → retour au premier', async ({ page }) => {
  await gotoEventList(page)
  await page.keyboard.press('ArrowDown') // → a2
  await enterSubLister(page)
  await page.keyboard.press('ArrowDown') // → s2a2
  await enterSubLister(page)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown') // → sc3s2a2 (3 liens)
  await page.keyboard.press('Tab') // lien 1
  await page.keyboard.press('Tab') // lien 2
  await page.keyboard.press('Tab') // lien 3
  await page.keyboard.press('Tab') // bouclage → lien 1
  await expect(page.locator('.event-item.selected .item-link--active')).toContainText('Séquence 3 de Acte I')
})

test('changer item sélectionné efface le lien actif', async ({ page }) => {
  await gotoEventList(page)
  await page.keyboard.press('ArrowDown') // → a2
  await enterSubLister(page)
  await page.keyboard.press('ArrowDown') // → s2a2
  await enterSubLister(page)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown') // → sc3s2a2
  await page.keyboard.press('Tab')
  await expect(page.locator('.item-link--active')).toHaveCount(1)
  await page.keyboard.press('ArrowUp')
  await expect(page.locator('.item-link--active')).toHaveCount(0)
})

test('MAJ+TAB cycle à l\'envers : TAB → lien 1, Shift+TAB → lien 3 (wrap arrière)', async ({ page }) => {
  await gotoEventList(page)
  await page.keyboard.press('ArrowDown') // → a2
  await enterSubLister(page)
  await page.keyboard.press('ArrowDown') // → s2a2
  await enterSubLister(page)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown') // → sc3s2a2 (3 liens)
  await page.keyboard.press('Tab')       // lien 1 : "Séquence 3 de Acte I"
  // Shift+TAB depuis index 0 → backward wrap → index 2 (lien 3 : "Acte II")
  await page.keyboard.press('Shift+Tab')
  await expect(page.locator('.event-item.selected .item-link--active')).toContainText('Acte II')
})

// ─── 'o' sans lien actif ─────────────────────────────────────────────────────

test("'o' sans lien actif sur item sans liens → notification", async ({ page }) => {
  await gotoEventList(page)
  await page.keyboard.press('o')
  await expect(page.locator('.notification')).toBeVisible()
  await expect(page.locator('.notification')).toContainText('aucun lien')
})

test("'o' sans TAB sur item avec liens → notification", async ({ page }) => {
  await gotoEventList(page)
  await page.keyboard.press('ArrowDown') // → a2
  await enterSubLister(page)
  await page.keyboard.press('ArrowDown') // → s2a2
  await enterSubLister(page)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown') // → sc3s2a2
  await page.keyboard.press('o')
  await expect(page.locator('.notification')).toBeVisible()
  await expect(page.locator('.notification')).toContainText('lien')
})

// ─── Popup 'o' ───────────────────────────────────────────────────────────────

test("TAB puis 'o' → popup s'ouvre", async ({ page }) => {
  await gotoEventList(page)
  await enterSubLister(page) // entre dans a1
  await page.keyboard.press('ArrowDown') // → s2a1
  await page.keyboard.press('Tab')
  await page.keyboard.press('o')
  await expect(page.locator('.link-open-popup')).toBeVisible()
})

test('popup : 3 options présentes', async ({ page }) => {
  await gotoEventList(page)
  await enterSubLister(page)
  await page.keyboard.press('ArrowDown') // → s2a1
  await page.keyboard.press('Tab')
  await page.keyboard.press('o')
  const items = page.locator('.floating-panel__item')
  await expect(items).toHaveCount(3)
  await expect(items.nth(0)).toContainText('évènemencier')
  await expect(items.nth(1)).toContainText('carte')
  await expect(items.nth(2)).toContainText('fenêtre')
})

test('Escape ferme le popup, lien reste actif', async ({ page }) => {
  await gotoEventList(page)
  await enterSubLister(page)
  await page.keyboard.press('ArrowDown') // → s2a1
  await page.keyboard.press('Tab')
  await page.keyboard.press('o')
  await expect(page.locator('.link-open-popup')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('.link-open-popup')).not.toBeVisible()
  await expect(page.locator('.item-link--active')).toHaveCount(1)
})
