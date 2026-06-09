import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('with-styles')
})

// fixture with-styles :
//   project-a, events e1/e2, brins b1/b2
//   themes/default.css : .style-gros (font-size:26px), .style-petit (font-size:9px)

async function goToEventLister(page) {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
}

async function openStylePanel(page) {
  await goToEventLister(page)
  await page.keyboard.press('s')
  await expect(page.locator('#style-panel')).toBeVisible()
}

// ─── Ouverture / fermeture ──────────────────────────────────────────────────

test("s ouvre le panneau des styles depuis l'EventLister", async ({ page }) => {
  await goToEventLister(page)
  await page.keyboard.press('s')
  await expect(page.locator('#style-panel')).toBeVisible()
})

test("l'EventLister reste visible en fond pendant que le panneau est ouvert", async ({ page }) => {
  await openStylePanel(page)
  await expect(page.locator('#main-panel')).toBeVisible()
})

test("Escape ferme le panneau des styles", async ({ page }) => {
  await openStylePanel(page)
  await page.keyboard.press('Escape')
  await expect(page.locator('#style-panel')).not.toBeVisible()
})

test("s ferme le panneau quand il est actif", async ({ page }) => {
  await openStylePanel(page)
  await page.keyboard.press('s')
  await expect(page.locator('#style-panel')).not.toBeVisible()
})

test("Cmd+Enter ferme le panneau des styles", async ({ page }) => {
  await openStylePanel(page)
  await page.keyboard.press('Meta+Enter')
  await expect(page.locator('#style-panel')).not.toBeVisible()
})

test("après fermeture, l'EventLister redevient actif (↓ change la sélection)", async ({ page }) => {
  await openStylePanel(page)
  await page.keyboard.press('Escape')
  await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.event-item').nth(1)).toHaveClass(/selected/)
})

// ─── Affichage ──────────────────────────────────────────────────────────────

test("le panneau affiche les styles disponibles (2 dans le fixture)", async ({ page }) => {
  await openStylePanel(page)
  await expect(page.locator('.style-item')).toHaveCount(2)
})

test("chaque style-item a un attribut data-name avec le nom de la classe CSS", async ({ page }) => {
  await openStylePanel(page)
  const name0 = await page.locator('.style-item').nth(0).getAttribute('data-name')
  const name1 = await page.locator('.style-item').nth(1).getAttribute('data-name')
  expect(name0).toBeTruthy()
  expect(name1).toBeTruthy()
  expect(name0).not.toBe(name1)
})

test("chaque style-item a un aperçu textuel (.style-item__preview)", async ({ page }) => {
  await openStylePanel(page)
  await expect(page.locator('.style-item').nth(0).locator('.style-item__preview')).toBeVisible()
  await expect(page.locator('.style-item').nth(1).locator('.style-item__preview')).toBeVisible()
})

test("le premier style est sélectionné à l'ouverture", async ({ page }) => {
  await openStylePanel(page)
  await expect(page.locator('.style-item').nth(0)).toHaveClass(/selected/)
  await expect(page.locator('.style-item').nth(1)).not.toHaveClass(/selected/)
})

test("aucun style n'est coché à l'ouverture (event sans css)", async ({ page }) => {
  await openStylePanel(page)
  await expect(page.locator('.style-item').nth(0)).not.toHaveClass(/checked/)
  await expect(page.locator('.style-item').nth(1)).not.toHaveClass(/checked/)
})

// ─── Navigation ─────────────────────────────────────────────────────────────

test("↓ sélectionne le style suivant", async ({ page }) => {
  await openStylePanel(page)
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.style-item').nth(1)).toHaveClass(/selected/)
  await expect(page.locator('.style-item').nth(0)).not.toHaveClass(/selected/)
})

test("↑ sélectionne le style précédent", async ({ page }) => {
  await openStylePanel(page)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowUp')
  await expect(page.locator('.style-item').nth(0)).toHaveClass(/selected/)
})

test("↓↑ ne modifient pas la sélection de l'EventLister", async ({ page }) => {
  await openStylePanel(page)
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)
})

// ─── Cocher / décocher ───────────────────────────────────────────────────────

test("Space coche un style non-coché", async ({ page }) => {
  await openStylePanel(page)
  await expect(page.locator('.style-item').nth(0)).not.toHaveClass(/checked/)
  await page.keyboard.press(' ')
  await expect(page.locator('.style-item').nth(0)).toHaveClass(/checked/)
})

test("Space décoche un style coché", async ({ page }) => {
  await openStylePanel(page)
  await page.keyboard.press(' ')
  await page.keyboard.press(' ')
  await expect(page.locator('.style-item').nth(0)).not.toHaveClass(/checked/)
})

// ─── Application CSS immédiate ───────────────────────────────────────────────

test("cocher style-gros applique font-size:26px à .event-body de l'event courant", async ({ page }) => {
  await openStylePanel(page)
  // s'assurer que style-gros est bien en position 0
  const name0 = await page.locator('.style-item').nth(0).getAttribute('data-name')
  expect(name0).toBe('style-gros')
  await page.keyboard.press(' ')
  await expect(page.locator('.event-item').nth(0).locator('.event-body'))
    .toHaveCSS('font-size', '26px')
})

test("cocher style-petit applique font-size:9px à .event-body", async ({ page }) => {
  await openStylePanel(page)
  await page.keyboard.press('ArrowDown') // → style-petit
  const name1 = await page.locator('.style-item').nth(1).getAttribute('data-name')
  expect(name1).toBe('style-petit')
  await page.keyboard.press(' ')
  await expect(page.locator('.event-item').nth(0).locator('.event-body'))
    .toHaveCSS('font-size', '9px')
})

test("décocher un style retire son effet CSS de .event-body", async ({ page }) => {
  await openStylePanel(page)
  await page.keyboard.press(' ') // cocher style-gros
  await page.keyboard.press(' ') // décocher
  // retour à la taille par défaut (pas 26px)
  const fontSize = await page.locator('.event-item').nth(0).locator('.event-body').evaluate(el =>
    parseFloat(getComputedStyle(el).fontSize)
  )
  expect(fontSize).not.toBe(26)
})

// ─── L'ordre compte ──────────────────────────────────────────────────────────

test("ordre [style-gros, style-petit] → font-size 9px (petit appliqué en dernier, gagne)", async ({ page }) => {
  await openStylePanel(page)
  // style-gros est index 0, style-petit est index 1
  await page.keyboard.press(' ')           // cocher style-gros (index 0)
  await page.keyboard.press('ArrowDown')   // → style-petit
  await page.keyboard.press(' ')           // cocher style-petit
  // ordre : [style-gros, style-petit] → petit gagne → 9px
  await expect(page.locator('.event-item').nth(0).locator('.event-body'))
    .toHaveCSS('font-size', '9px')
})

test("inverser l'ordre [style-petit, style-gros] → font-size 26px (gros appliqué en dernier)", async ({ page }) => {
  await openStylePanel(page)
  await page.keyboard.press(' ')           // cocher style-gros (index 0, sélectionné)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press(' ')           // cocher style-petit (index 1)
  await page.keyboard.press('ArrowUp')     // revenir sur style-gros (index 0)
  // ⌘↓ déplace style-gros après style-petit → ordre [style-petit, style-gros]
  await page.keyboard.press('Meta+ArrowDown')
  // gros appliqué en dernier → 26px
  await expect(page.locator('.event-item').nth(0).locator('.event-body'))
    .toHaveCSS('font-size', '26px')
})

// ─── Réordonnancement ────────────────────────────────────────────────────────

test("⌘↓ déplace le style vers le bas dans le panneau", async ({ page }) => {
  await openStylePanel(page)
  const nameBefore = await page.locator('.style-item').nth(0).getAttribute('data-name')
  await page.keyboard.press('Meta+ArrowDown')
  const nameAfter = await page.locator('.style-item').nth(0).getAttribute('data-name')
  expect(nameAfter).not.toBe(nameBefore)
})

test("⌘↑ déplace le style vers le haut dans le panneau", async ({ page }) => {
  await openStylePanel(page)
  await page.keyboard.press('ArrowDown')
  const nameAt1Before = await page.locator('.style-item').nth(1).getAttribute('data-name')
  await page.keyboard.press('Meta+ArrowUp')
  const nameAt0After = await page.locator('.style-item').nth(0).getAttribute('data-name')
  expect(nameAt0After).toBe(nameAt1Before)
})

// ─── Changement d'event en fond (⌥↓/⌥↑) ────────────────────────────────────

test("⌥↓ passe à l'event suivant en fond", async ({ page }) => {
  await openStylePanel(page)
  await page.keyboard.press(' ') // cocher style-gros sur e1
  await page.keyboard.press('Alt+ArrowDown') // passer à e2
  await expect(page.locator('.event-item').nth(1)).toHaveClass(/selected/)
  // e2 n'a pas de style coché
  await expect(page.locator('.style-item').nth(0)).not.toHaveClass(/checked/)
})

test("⌥↑ revient à l'event précédent", async ({ page }) => {
  await openStylePanel(page)
  await page.keyboard.press('Alt+ArrowDown')
  await page.keyboard.press('Alt+ArrowUp')
  await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)
})

// ─── Persistance ─────────────────────────────────────────────────────────────

test("persistance : style coché survit au rechargement", async ({ page }) => {
  await openStylePanel(page)
  await page.keyboard.press(' ') // cocher style-gros
  await page.waitForLoadState('networkidle')

  await page.reload()
  await goToEventLister(page)
  await page.keyboard.press('s')
  await expect(page.locator('#style-panel')).toBeVisible()
  await expect(page.locator('.style-item').nth(0)).toHaveClass(/checked/)
})

test("persistance : style décoché survit au rechargement", async ({ page }) => {
  await openStylePanel(page)
  await page.keyboard.press(' ')
  await page.keyboard.press(' ') // cocher puis décocher
  await page.waitForLoadState('networkidle')

  await page.reload()
  await goToEventLister(page)
  await page.keyboard.press('s')
  await expect(page.locator('.style-item').nth(0)).not.toHaveClass(/checked/)
})

test("persistance : font-size correcte sur .event-body après rechargement", async ({ page }) => {
  await openStylePanel(page)
  await page.keyboard.press(' ') // cocher style-gros → 26px
  await page.waitForLoadState('networkidle')

  await page.reload()
  await goToEventLister(page)
  await expect(page.locator('.event-item').nth(0).locator('.event-body'))
    .toHaveCSS('font-size', '26px')
})

test("persistance : l'ordre inversé survit au rechargement (gros après petit → 26px)", async ({ page }) => {
  await openStylePanel(page)
  await page.keyboard.press(' ')           // cocher style-gros
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press(' ')           // cocher style-petit
  await page.keyboard.press('ArrowUp')
  await page.keyboard.press('Meta+ArrowDown') // ordre → [petit, gros]
  await page.waitForLoadState('networkidle')

  await page.reload()
  await goToEventLister(page)
  await expect(page.locator('.event-item').nth(0).locator('.event-body'))
    .toHaveCSS('font-size', '26px')
})
