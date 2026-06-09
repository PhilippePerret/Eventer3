import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

// fixture with-brins : project-a, e1/e2, b1 (MON) / b2 (AUT), pas de persos
// fixture with-brins-and-persos : project-a, e1/e2, b1 (MON)/b2 (AUT), c1 (CY)/c2 (RO)

async function goToEventLister(page) {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
}

// ─── Brin panel : ⌥↓↑ navigue les events ────────────────────────────────────

test("brin panel : ⌥↓ sélectionne l'event suivant", async ({ page }) => {
  installFixtures('with-brins')
  await goToEventLister(page)
  await page.keyboard.press('b')
  await expect(page.locator('#brin-panel')).toBeVisible()
  await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)
  await page.keyboard.press('Alt+ArrowDown')
  await expect(page.locator('.event-item').nth(1)).toHaveClass(/selected/)
})

test("brin panel : ⌥↑ sélectionne l'event précédent", async ({ page }) => {
  installFixtures('with-brins')
  await goToEventLister(page)
  await page.keyboard.press('b')
  await expect(page.locator('#brin-panel')).toBeVisible()
  await page.keyboard.press('Alt+ArrowDown')
  await expect(page.locator('.event-item').nth(1)).toHaveClass(/selected/)
  await page.keyboard.press('Alt+ArrowUp')
  await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)
})

test("brin panel : ⌥↓ ne change pas la sélection du brin actif", async ({ page }) => {
  installFixtures('with-brins')
  await goToEventLister(page)
  await page.keyboard.press('b')
  await expect(page.locator('.brin-item').nth(0)).toHaveClass(/selected/)
  await page.keyboard.press('Alt+ArrowDown')
  await expect(page.locator('.brin-item').nth(0)).toHaveClass(/selected/)
})

// ─── Perso panel depuis EventLister : ⌥↓↑ navigue les events ───────────────

test("perso panel (depuis EventLister) : ⌥↓ sélectionne l'event suivant", async ({ page }) => {
  installFixtures('with-brins-and-persos')
  await goToEventLister(page)
  await page.keyboard.press('p')
  await expect(page.locator('#perso-panel')).toBeVisible()
  await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)
  await page.keyboard.press('Alt+ArrowDown')
  await expect(page.locator('.event-item').nth(1)).toHaveClass(/selected/)
})

test("perso panel (depuis EventLister) : ⌥↑ sélectionne l'event précédent", async ({ page }) => {
  installFixtures('with-brins-and-persos')
  await goToEventLister(page)
  await page.keyboard.press('p')
  await expect(page.locator('#perso-panel')).toBeVisible()
  await page.keyboard.press('Alt+ArrowDown')
  await expect(page.locator('.event-item').nth(1)).toHaveClass(/selected/)
  await page.keyboard.press('Alt+ArrowUp')
  await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)
})

test("perso panel (depuis EventLister) : ⌥↓ ne change pas la sélection du perso", async ({ page }) => {
  installFixtures('with-brins-and-persos')
  await goToEventLister(page)
  await page.keyboard.press('p')
  await expect(page.locator('.perso-item').nth(0)).toHaveClass(/selected/)
  await page.keyboard.press('Alt+ArrowDown')
  await expect(page.locator('.perso-item').nth(0)).toHaveClass(/selected/)
})

// ─── Perso panel depuis BrinPanel : ⌥↓↑ navigue les brins ──────────────────

test("perso panel (depuis BrinPanel) : ⌥↓ sélectionne le brin suivant", async ({ page }) => {
  installFixtures('with-brins-and-persos')
  await goToEventLister(page)
  await page.keyboard.press('b')
  await expect(page.locator('#brin-panel')).toBeVisible()
  await expect(page.locator('.brin-item').nth(0)).toHaveClass(/selected/)
  await page.keyboard.press('p')
  await expect(page.locator('#perso-panel')).toBeVisible()
  await page.keyboard.press('Alt+ArrowDown')
  await expect(page.locator('.brin-item').nth(1)).toHaveClass(/selected/)
})

test("perso panel (depuis BrinPanel) : ⌥↑ sélectionne le brin précédent", async ({ page }) => {
  installFixtures('with-brins-and-persos')
  await goToEventLister(page)
  await page.keyboard.press('b')
  await expect(page.locator('#brin-panel')).toBeVisible()
  await page.keyboard.press('p')
  await expect(page.locator('#perso-panel')).toBeVisible()
  await page.keyboard.press('Alt+ArrowDown')
  await expect(page.locator('.brin-item').nth(1)).toHaveClass(/selected/)
  await page.keyboard.press('Alt+ArrowUp')
  await expect(page.locator('.brin-item').nth(0)).toHaveClass(/selected/)
})

test("perso panel (depuis BrinPanel) : ⌥↓ ne change pas la sélection du perso", async ({ page }) => {
  installFixtures('with-brins-and-persos')
  await goToEventLister(page)
  await page.keyboard.press('b')
  await page.keyboard.press('p')
  await expect(page.locator('.perso-item').nth(0)).toHaveClass(/selected/)
  await page.keyboard.press('Alt+ArrowDown')
  await expect(page.locator('.perso-item').nth(0)).toHaveClass(/selected/)
})

// ─── Refresh état coché après ⌥↓↑ ───────────────────────────────────────────

test("brin panel : ⌥↓ rafraîchit l'état coché des brins", async ({ page }) => {
  // with-brins : e1 a brin_ids=["b2"] → b2 coché ; e2 a [] → rien coché
  installFixtures('with-brins')
  await goToEventLister(page)
  await page.keyboard.press('b')
  await expect(page.locator('.brin-item').nth(1)).toHaveClass(/checked/)
  await page.keyboard.press('Alt+ArrowDown')
  await expect(page.locator('.brin-item').nth(1)).not.toHaveClass(/checked/)
})

test("brin panel : ⌥↓ met à jour le titre (nom de l'event en fond)", async ({ page }) => {
  installFixtures('with-brins')
  await goToEventLister(page)
  await page.keyboard.press('b')
  await expect(page.locator('.panel-title')).toContainText('Événement 1')
  await page.keyboard.press('Alt+ArrowDown')
  await expect(page.locator('.panel-title')).toContainText('Événement 2')
})

test("brin panel : espace après ⌥↓ coche pour l'event sélectionné en fond", async ({ page }) => {
  // alt+↓ → e2 ; espace sur b1 → b1 coché pour e2
  installFixtures('with-brins')
  await goToEventLister(page)
  await page.keyboard.press('b')
  await page.keyboard.press('Alt+ArrowDown')
  await expect(page.locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  await page.keyboard.press(' ')
  await expect(page.locator('.brin-item').nth(0)).toHaveClass(/checked/)
  // e1 ne doit pas avoir b1 coché
  await page.keyboard.press('Alt+ArrowUp')
  await expect(page.locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
})

test("perso panel (depuis EventLister) : ⌥↓ rafraîchit l'état coché des persos", async ({ page }) => {
  // with-brins-and-persos : e1 a perso_ids=["c1"] → c1 coché ; e2 a [] → rien
  installFixtures('with-brins-and-persos')
  await goToEventLister(page)
  await page.keyboard.press('p')
  await expect(page.locator('.perso-item').nth(0)).toHaveClass(/checked/)
  await page.keyboard.press('Alt+ArrowDown')
  await expect(page.locator('.perso-item').nth(0)).not.toHaveClass(/checked/)
})

// ─── Footer documentation ────────────────────────────────────────────────────

test("brin panel : footer affiche le raccourci ⌥↓↑", async ({ page }) => {
  installFixtures('with-brins')
  await goToEventLister(page)
  await page.keyboard.press('b')
  await expect(page.locator('#shortcuts-footer')).toContainText('⌥↓')
})

test("perso panel : footer affiche le raccourci ⌥↓↑", async ({ page }) => {
  installFixtures('with-brins-and-persos')
  await goToEventLister(page)
  await page.keyboard.press('p')
  await expect(page.locator('#shortcuts-footer')).toContainText('⌥↓')
})
