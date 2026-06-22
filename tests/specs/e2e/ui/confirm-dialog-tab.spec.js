import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('depth-move')
})

// Ouvre le ConfirmDialog man_depth (2 boutons : Non / Oui)
async function openManDepthConfirm(page) {
  await page.goto('/')
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  await pane1(page).locator('#main-panel').press('t')
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel').press('ArrowUp')   // film/BD
  await pane1(page).locator('#main-panel').press('ArrowUp')   // roman
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel').press('ArrowDown')
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel').press('ArrowUp')   // manuscrit
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel').press('Tab')       // footer → Annuler
  await pane1(page).locator('#main-panel').press('Tab')       // footer → Appliquer
  await pane1(page).locator('#main-panel').press('Enter')     // appliquer
  await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
}

// ─── Focus par défaut ─────────────────────────────────────────────────────────

test("ConfirmDialog : bouton 'Oui' focused par défaut (dernier bouton = action principale)", async ({ page }) => {
  await openManDepthConfirm(page)
  const btns = pane1(page).locator('.panel-btn')
  // Dernier bouton = Oui → doit avoir la classe focused
  const lastBtn = btns.last()
  await expect(lastBtn).toHaveClass(/panel-btn--focused/)
  await expect(lastBtn).toContainText('Oui')
})

// ─── Tab cycle ────────────────────────────────────────────────────────────────

test("Tab bascule le focus de Oui vers Non", async ({ page }) => {
  await openManDepthConfirm(page)
  // Par défaut : Oui focused
  await expect(pane1(page).locator('.panel-btn--focused')).toContainText('Oui')
  await pane1(page).locator('#main-panel').press('Tab')
  // Après Tab : Non focused
  await expect(pane1(page).locator('.panel-btn--focused')).toContainText('Non')
})

test("Tab cycle complet : Non → Oui → Non", async ({ page }) => {
  await openManDepthConfirm(page)
  await pane1(page).locator('#main-panel').press('Tab')  // Non
  await expect(pane1(page).locator('.panel-btn--focused')).toContainText('Non')
  await pane1(page).locator('#main-panel').press('Tab')  // Oui
  await expect(pane1(page).locator('.panel-btn--focused')).toContainText('Oui')
  await pane1(page).locator('#main-panel').press('Tab')  // Non
  await expect(pane1(page).locator('.panel-btn--focused')).toContainText('Non')
})

// ─── Enter active le bouton focused ──────────────────────────────────────────

test("Enter avec Oui focused → man_depth sauvegardé, sibling devient roman-man", async ({ page }) => {
  await openManDepthConfirm(page)
  // Oui focused par défaut → Enter
  await pane1(page).locator('#main-panel').press('Enter')
  await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  // Vérifier que man_depth a été sauvegardé : sibling lister est roman-man
  await pane1(page).locator('#main-panel').press('ArrowLeft')
  await pane1(page).locator('#main-panel').press('ArrowDown')
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/roman-man/)
})

test("Tab→Non puis Enter → man_depth non sauvegardé", async ({ page }) => {
  await openManDepthConfirm(page)
  await pane1(page).locator('#main-panel').press('Tab')  // bascule sur Non
  await pane1(page).locator('#main-panel').press('Enter')
  await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  // man_depth non sauvegardé : sibling ne devient pas roman-man
  await pane1(page).locator('#main-panel').press('ArrowLeft')
  await pane1(page).locator('#main-panel').press('ArrowDown')
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).not.toHaveClass(/roman-man/)
})

// ─── Escape annule toujours ───────────────────────────────────────────────────

test("Escape annule même si Oui est focused", async ({ page }) => {
  await openManDepthConfirm(page)
  // Oui est focused par défaut
  await pane1(page).locator('#main-panel').press('Escape')
  await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  await pane1(page).locator('#main-panel').press('ArrowLeft')
  await pane1(page).locator('#main-panel').press('ArrowDown')
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).not.toHaveClass(/roman-man/)
})

// ─── CSS : bouton focused est vert ────────────────────────────────────────────

test("bouton focused a une couleur verte (background non-transparent)", async ({ page }) => {
  await openManDepthConfirm(page)
  const focusedBtn = pane1(page).locator('.panel-btn--focused')
  const bg = await focusedBtn.evaluate(el => getComputedStyle(el).backgroundColor)
  // Vert : ne doit pas être transparent ni blanc
  expect(bg).not.toBe('rgba(0, 0, 0, 0)')
  expect(bg).not.toBe('rgb(255, 255, 255)')
  // Doit contenir du vert (G > R et G > B dans rgb)
  const match = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (match) {
    const [, r, g, b] = match.map(Number)
    expect(g).toBeGreaterThan(r)
    expect(g).toBeGreaterThan(b)
  }
})
