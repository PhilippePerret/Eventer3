import { test, expect, pane1, press, getErr } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'

test.beforeEach(() => {
  installFixtures('with-broken-links')
})

async function enterSubLister(page) {
  const depthAttr = await pane1(page).locator('#events-panel').getAttribute('data-depth')
  const nextDepth = String((depthAttr != null ? parseInt(depthAttr) : 0) + 1)
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', nextDepth)
}

// Navigue jusqu'à e5 dans le sous-lister de Acte I (item avec lien cassé vers e999)
async function gotoItemWithBrokenLink(page) {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  await press(page, 'ArrowRight')
  await page.waitForLoadState('networkidle')
  await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
  // Entrer dans le sous-lister de Acte I (e1 sélectionné par défaut)
  await enterSubLister(page)
  // e4 sélectionné → ArrowDown → e5
  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.event-item.selected')).toContainText('Séquence 2')
}

// ─── TargetsPanel ─────────────────────────────────────────────────────────────

test('TargetsPanel : cibles inexistantes filtrées à l\'ouverture', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  await press(page, 'ArrowRight')
  await page.waitForLoadState('networkidle')
  // Entrer en édition sur le premier item
  await press(page, 'Enter')
  await expect(pane1(page).locator('.event-item.editing input[name="title"]')).toBeFocused()
  // Ouvrir TargetsPanel — fixture a 2 cibles : e999 (inexistant) + e1 (existant)
  await press(page, 'Meta+k')
  await expect(pane1(page).locator('.targets-panel')).toBeVisible()
  // Seulement e1 doit apparaître
  await expect(pane1(page).locator('.floating-panel__item')).toHaveCount(1)
  await expect(pane1(page).locator('.floating-panel__item').first()).toContainText('Acte I')
})

// ─── Liens cassés ─────────────────────────────────────────────────────────────

test("lien cassé : 'o' → notification, pas de popup", async ({ page }) => {
  await gotoItemWithBrokenLink(page)
  await press(page, 'Tab')   // active [Acte III](e3) — valide
  await press(page, 'Tab')   // active [Fantôme](e999) — cassé
  await press(page, 'o')
  await expect(pane1(page).locator('.link-open-popup')).not.toBeVisible()
  await expect(pane1(page).locator('.notification')).toBeVisible()
  await expect(pane1(page).locator('.notification')).toContainText(/supprimée|introuvable/i)
})

test("lien cassé : 'g' → notification sans naviguer", async ({ page }) => {
  await gotoItemWithBrokenLink(page)
  await press(page, 'Tab')
  await press(page, 'Tab')   // active [Fantôme](e999)
  await press(page, 'g')
  await expect(pane1(page).locator('.notification')).toBeVisible()
  await expect(pane1(page).locator('.notification')).toContainText(/supprimée|introuvable/i)
})

test("lien cassé : 'a' → notification sans ouvrir split", async ({ page }) => {
  await gotoItemWithBrokenLink(page)
  await press(page, 'Tab')
  await press(page, 'Tab')   // active [Fantôme](e999)
  await press(page, 'a')
  await expect(pane1(page).locator('.notification')).toBeVisible()
  await expect(pane1(page).locator('.notification')).toContainText(/supprimée|introuvable/i)
})
