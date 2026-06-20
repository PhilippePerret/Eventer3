import { test, expect, pane1 } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'

test.beforeEach(() => {
  installFixtures('with-links')
})

async function gotoEventList(page) {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  await pane1(page).locator('body').press('ArrowRight')
  await page.waitForLoadState('networkidle')
  await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
}

async function enterSubLister(page) {
  const depthAttr = await pane1(page).locator('#main-panel').getAttribute('data-depth')
  const nextDepth  = String((depthAttr != null ? parseInt(depthAttr) : 0) + 1)
  await pane1(page).locator('body').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', nextDepth)
}

// ─── TAB navigation ──────────────────────────────────────────────────────────

test('TAB sur item sans lien → notification "aucun lien"', async ({ page }) => {
  await gotoEventList(page)
  // a1 sélectionné : "Acte I", pas de lien
  await pane1(page).locator('body').press('Tab')
  await expect(pane1(page).locator('.notification')).toBeVisible()
  await expect(pane1(page).locator('.notification')).toContainText('aucun lien')
})

test('TAB sur item avec lien → premier lien activé', async ({ page }) => {
  await gotoEventList(page)
  await enterSubLister(page) // entre dans a1 (séquences Acte I)
  await pane1(page).locator('body').press('ArrowDown') // → s2a1
  await pane1(page).locator('body').press('Tab')
  await expect(pane1(page).locator('.event-item.selected .item-link--active')).toHaveCount(1)
  await expect(pane1(page).locator('.event-item.selected .item-link--active')).toContainText('Acte III')
})

test('TAB cycle : 2e TAB → 2e lien activé', async ({ page }) => {
  await gotoEventList(page)
  await pane1(page).locator('body').press('ArrowDown') // → a2
  await enterSubLister(page)             // entre dans Acte II
  await pane1(page).locator('body').press('ArrowDown') // → s2a2
  await enterSubLister(page)             // entre dans Séquence 2
  await pane1(page).locator('body').press('ArrowDown')
  await pane1(page).locator('body').press('ArrowDown') // → sc3s2a2 (3e scène, 2 liens)
  await pane1(page).locator('body').press('Tab') // lien 1
  await pane1(page).locator('body').press('Tab') // lien 2
  await expect(pane1(page).locator('.event-item.selected .item-link--active')).toContainText('Scène 1 de Séquence 4 de Acte III')
})

test('TAB bouclage : après dernier lien → retour au premier', async ({ page }) => {
  await gotoEventList(page)
  await pane1(page).locator('body').press('ArrowDown') // → a2
  await enterSubLister(page)
  await pane1(page).locator('body').press('ArrowDown') // → s2a2
  await enterSubLister(page)
  await pane1(page).locator('body').press('ArrowDown')
  await pane1(page).locator('body').press('ArrowDown') // → sc3s2a2 (3 liens)
  await pane1(page).locator('body').press('Tab') // lien 1
  await pane1(page).locator('body').press('Tab') // lien 2
  await pane1(page).locator('body').press('Tab') // lien 3
  await pane1(page).locator('body').press('Tab') // bouclage → lien 1
  await expect(pane1(page).locator('.event-item.selected .item-link--active')).toContainText('Séquence 3 de Acte I')
})

test('changer item sélectionné efface le lien actif', async ({ page }) => {
  await gotoEventList(page)
  await pane1(page).locator('body').press('ArrowDown') // → a2
  await enterSubLister(page)
  await pane1(page).locator('body').press('ArrowDown') // → s2a2
  await enterSubLister(page)
  await pane1(page).locator('body').press('ArrowDown')
  await pane1(page).locator('body').press('ArrowDown') // → sc3s2a2
  await pane1(page).locator('body').press('Tab')
  await expect(pane1(page).locator('.item-link--active')).toHaveCount(1)
  await pane1(page).locator('body').press('ArrowUp')
  await expect(pane1(page).locator('.item-link--active')).toHaveCount(0)
})

test('MAJ+TAB cycle à l\'envers : TAB → lien 1, Shift+TAB → lien 3 (wrap arrière)', async ({ page }) => {
  await gotoEventList(page)
  await pane1(page).locator('body').press('ArrowDown') // → a2
  await enterSubLister(page)
  await pane1(page).locator('body').press('ArrowDown') // → s2a2
  await enterSubLister(page)
  await pane1(page).locator('body').press('ArrowDown')
  await pane1(page).locator('body').press('ArrowDown') // → sc3s2a2 (3 liens)
  await pane1(page).locator('body').press('Tab')       // lien 1 : "Séquence 3 de Acte I"
  // Shift+TAB depuis index 0 → backward wrap → index 2 (lien 3 : "Acte II")
  await pane1(page).locator('body').press('Shift+Tab')
  await expect(pane1(page).locator('.event-item.selected .item-link--active')).toContainText('Acte II')
})

// ─── 'o' sans lien actif ─────────────────────────────────────────────────────

test("'o' sans lien actif sur item sans liens → notification", async ({ page }) => {
  await gotoEventList(page)
  await pane1(page).locator('body').press('o')
  await expect(pane1(page).locator('.notification')).toBeVisible()
  await expect(pane1(page).locator('.notification')).toContainText('aucun lien')
})

test("'o' sans TAB sur item avec liens → notification", async ({ page }) => {
  await gotoEventList(page)
  await pane1(page).locator('body').press('ArrowDown') // → a2
  await enterSubLister(page)
  await pane1(page).locator('body').press('ArrowDown') // → s2a2
  await enterSubLister(page)
  await pane1(page).locator('body').press('ArrowDown')
  await pane1(page).locator('body').press('ArrowDown') // → sc3s2a2
  await pane1(page).locator('body').press('o')
  await expect(pane1(page).locator('.notification')).toBeVisible()
  await expect(pane1(page).locator('.notification')).toContainText('lien')
})

// ─── Popup 'o' ───────────────────────────────────────────────────────────────

test("TAB puis 'o' → popup s'ouvre", async ({ page }) => {
  await gotoEventList(page)
  await enterSubLister(page) // entre dans a1
  await pane1(page).locator('body').press('ArrowDown') // → s2a1
  await pane1(page).locator('body').press('Tab')
  await pane1(page).locator('body').press('o')
  await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
})

test('popup : 3 options présentes', async ({ page }) => {
  await gotoEventList(page)
  await enterSubLister(page)
  await pane1(page).locator('body').press('ArrowDown') // → s2a1
  await pane1(page).locator('body').press('Tab')
  await pane1(page).locator('body').press('o')
  const items = pane1(page).locator('.floating-panel__item')
  await expect(items).toHaveCount(3)
  await expect(items.nth(0)).toContainText('évènemencier')
  await expect(items.nth(1)).toContainText('carte')
  await expect(items.nth(2)).toContainText('fenêtre')
})

test('Escape ferme le popup, lien reste actif', async ({ page }) => {
  await gotoEventList(page)
  await enterSubLister(page)
  await pane1(page).locator('body').press('ArrowDown') // → s2a1
  await pane1(page).locator('body').press('Tab')
  await pane1(page).locator('body').press('o')
  await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  await pane1(page).locator('body').press('Escape')
  await expect(pane1(page).locator('.link-open-popup')).not.toBeVisible()
  await expect(pane1(page).locator('.item-link--active')).toHaveCount(1)
})
