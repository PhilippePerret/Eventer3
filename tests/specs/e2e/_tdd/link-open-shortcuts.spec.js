import { test, expect, pane1, press, getErr } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'

test.beforeEach(() => {
  installFixtures('with-links')
})

async function gotoEventList(page) {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
}

async function enterSubLister(page) {
  const depthAttr = await pane1(page).locator('#events-panel').getAttribute('data-depth')
  const nextDepth  = String((depthAttr != null ? parseInt(depthAttr) : 0) + 1)
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', nextDepth)
}

// Navigue jusqu'à sc3s2a2 (item avec liens) et active le premier lien
async function activateFirstLink(page) {
  await gotoEventList(page)
  await press(page, 'ArrowDown') // → a2
  await enterSubLister(page)
  await press(page, 'ArrowDown') // → s2a2
  await enterSubLister(page)
  await press(page, 'ArrowDown')
  await press(page, 'ArrowDown') // → sc3s2a2
  await press(page, 'Tab')       // active premier lien
  await expect(pane1(page).locator('.item-link--active')).toHaveCount(1)
}

// ─── Labels et badges dans le popup ──────────────────────────────────────────

test("popup : première option contient badge 'g'", async ({ page }) => {
  await activateFirstLink(page)
  await press(page, 'o')
  await expect(pane1(page).locator('.floating-panel__item').nth(0).locator('.link-open-popup__key')).toHaveText('g')
})

test("popup : deuxième option contient badge 'c' et texte 'Afficher sa carte'", async ({ page }) => {
  await activateFirstLink(page)
  await press(page, 'o')
  const second = pane1(page).locator('.floating-panel__item').nth(1)
  await expect(second.locator('.link-open-popup__key')).toHaveText('c')
  await expect(second).toContainText('Afficher sa carte')
})

test("popup : troisième option contient badge 'a' et texte 'Dans une autre fenêtre'", async ({ page }) => {
  await activateFirstLink(page)
  await press(page, 'o')
  const third = pane1(page).locator('.floating-panel__item').nth(2)
  await expect(third.locator('.link-open-popup__key')).toHaveText('a')
  await expect(third).toContainText('Dans une autre fenêtre')
})

// ─── Raccourcis g/c/a dans le popup ──────────────────────────────────────────

test("popup : 'g' ferme le popup et navigue vers la cible", async ({ page }) => {
  await activateFirstLink(page)
  await press(page, 'o')
  await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  await press(page, 'g')
  await expect(pane1(page).locator('.link-open-popup')).not.toBeVisible()
})

test("popup : 'c' ferme le popup", async ({ page }) => {
  await activateFirstLink(page)
  await press(page, 'o')
  await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  await press(page, 'c')
  await expect(pane1(page).locator('.link-open-popup')).not.toBeVisible()
})

test("popup : 'a' ferme le popup", async ({ page }) => {
  await activateFirstLink(page)
  await press(page, 'o')
  await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  await press(page, 'a')
  await expect(pane1(page).locator('.link-open-popup')).not.toBeVisible()
})

// ─── Raccourcis g/c/a sans popup (lien actif sélectionné) ────────────────────

test("'g' avec lien actif (sans popup) → navigue et popup ne s'ouvre pas", async ({ page }) => {
  await activateFirstLink(page)
  await press(page, 'g')
  await expect(pane1(page).locator('.link-open-popup')).not.toBeVisible()
})

test("'c' avec lien actif (sans popup) → action déclenchée, pas de popup", async ({ page }) => {
  await activateFirstLink(page)
  await press(page, 'c')
  await expect(pane1(page).locator('.link-open-popup')).not.toBeVisible()
})

test("'a' avec lien actif (sans popup) → action déclenchée, pas de popup", async ({ page }) => {
  await activateFirstLink(page)
  await press(page, 'a')
  await expect(pane1(page).locator('.link-open-popup')).not.toBeVisible()
})

// ─── Raccourcis g/c/a sans cible sélectionnée ────────────────────────────────

test("'g' sans cible sélectionnée → notification 'Aucune cible'", async ({ page }) => {
  await gotoEventList(page)
  await press(page, 'g')
  await expect(pane1(page).locator('.notification')).toBeVisible()
  await expect(pane1(page).locator('.notification')).toContainText(getErr(5200))
})

test("'c' sans cible sélectionnée → notification 'Aucune cible'", async ({ page }) => {
  await gotoEventList(page)
  await press(page, 'c')
  await expect(pane1(page).locator('.notification')).toBeVisible()
  await expect(pane1(page).locator('.notification')).toContainText(getErr(5200))
})

test("'a' sans cible sélectionnée → notification 'Aucune cible'", async ({ page }) => {
  await gotoEventList(page)
  await press(page, 'a')
  await expect(pane1(page).locator('.notification')).toBeVisible()
  await expect(pane1(page).locator('.notification')).toContainText(getErr(5200))
})
