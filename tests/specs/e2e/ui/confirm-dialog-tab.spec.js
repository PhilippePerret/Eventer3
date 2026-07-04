//Origine: tests/specs/e2e/ui/confirm-dialog-tab.spec.js
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('depth-move')
})

// Ouvre le ConfirmDialog man_depth (2 boutons : Non / Oui)
// Fixture depth-move : project_nature déjà 'roman' dans project_meta
async function openManDepthConfirm(page) {
  await page.goto('/')
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '2')
  await press(page, 't')
  await press(page, 'ArrowDown') // → row 1 (nature évènemencier)
  await press(page, 'Enter')     // → ouvre popup lister nature
  await press(page, 'ArrowUp')  // manuscrit
  await press(page, 'Enter')    // sélectionne manuscrit
  await press(page, 'Tab')      // footer → Annuler
  await press(page, 'Tab')      // footer → Appliquer
  await press(page, 'Enter')    // appliquer
  await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
}

// ─── Focus par défaut ─────────────────────────────────────────────────────────

test("ConfirmDialog : bouton 'Oui' focused par défaut (dernier bouton = action principale)", async ({ page }) => {
  await openManDepthConfirm(page)
  const btns = pane1(page).locator('.ftpanel-btn')
  // Dernier bouton = Oui → doit avoir la classe focused
  const lastBtn = btns.last()
  await expect(lastBtn).toHaveClass(/ftpanel-btn--focused/)
  await expect(lastBtn).toContainText('Oui')
})

// ─── Tab cycle ────────────────────────────────────────────────────────────────

test("Tab bascule le focus de Oui vers Non", async ({ page }) => {
  await openManDepthConfirm(page)
  // Par défaut : Oui focused
  await expect(pane1(page).locator('.ftpanel-btn--focused')).toContainText('Oui')
  await press(page, 'Tab')
  // Après Tab : Non focused
  await expect(pane1(page).locator('.ftpanel-btn--focused')).toContainText('Non')
})

test("Tab cycle complet : Non → Oui → Non", async ({ page }) => {
  await openManDepthConfirm(page)
  await press(page, 'Tab')  // Non
  await expect(pane1(page).locator('.ftpanel-btn--focused')).toContainText('Non')
  await press(page, 'Tab')  // Oui
  await expect(pane1(page).locator('.ftpanel-btn--focused')).toContainText('Oui')
  await press(page, 'Tab')  // Non
  await expect(pane1(page).locator('.ftpanel-btn--focused')).toContainText('Non')
})

// ─── Enter active le bouton focused ──────────────────────────────────────────

test("Enter avec Oui focused → man_depth sauvegardé, sibling devient roman-man", async ({ page }) => {
  await openManDepthConfirm(page)
  // Oui focused par défaut → Enter
  await press(page, 'Enter')
  await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  // Vérifier que man_depth a été sauvegardé : sibling lister est roman-man
  await press(page, 'ArrowLeft')
  await press(page, 'ArrowDown')
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toHaveClass(/roman-man/)
})

test("Tab→Non puis Enter → man_depth non sauvegardé", async ({ page }) => {
  await openManDepthConfirm(page)
  await press(page, 'Tab')  // bascule sur Non
  await press(page, 'Enter')
  await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  // man_depth non sauvegardé : sibling ne devient pas roman-man
  await press(page, 'ArrowLeft')
  await press(page, 'ArrowDown')
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).not.toHaveClass(/roman-man/)
})

// ─── Escape annule toujours ───────────────────────────────────────────────────

test("⌘↩ annule même si Oui est focused", async ({ page }) => {
  await openManDepthConfirm(page)
  // Oui est focused par défaut
  await press(page, 'Meta+Enter')
  await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  await press(page, 'ArrowLeft')
  await press(page, 'ArrowDown')
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).not.toHaveClass(/roman-man/)
})

// ─── CSS : bouton focused est vert ────────────────────────────────────────────

test("bouton focused a une couleur verte (background non-transparent)", async ({ page }) => {
  await openManDepthConfirm(page)
  const focusedBtn = pane1(page).locator('.ftpanel-btn--focused')
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
