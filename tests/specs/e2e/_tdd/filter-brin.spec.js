// Origine : specs/e2e/filter/filter-brin.spec.js
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

// Fixture filter-events :
//   b1 → e1 "Scène du bal", e3 "La trahison"
//   b2 → e2 "Arrivée à Paris", e3 "La trahison"
//   e4 "Retour au bal" → aucun brin

test.beforeEach(() => {
  installFixtures('filter-events')
})

async function enterListerEvent(page) {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
}

async function openBrinSelector(page) {
  await press(page, ':')
  await expect(pane1(page).locator('#events-panel .filter-bar')).toBeVisible()
  // Tab depuis panel-search : état → météo → effet → brins
  await press(page, 'Tab')
  await press(page, 'Tab')
  await press(page, 'Tab')
  await press(page, 'Tab')
  await expect(pane1(page).locator('#events-panel .filter-widget[data-field="brins"] .filter-widget__btn')).toBeFocused()
  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
}

// ── Panneau ───────────────────────────────────────────────────────

test(': puis Tab×4 puis ArrowDown ouvre le sélecteur de brins', async ({ page }) => {
  await enterListerEvent(page)
  await openBrinSelector(page)
})

test('le sélecteur affiche les brins du projet', async ({ page }) => {
  await enterListerEvent(page)
  await openBrinSelector(page)
  await expect(pane1(page).locator('.popup-select__option')).toHaveCount(2)
})

// ── Filtrage réel ─────────────────────────────────────────────────

test('sélectionner b1 masque les events sans b1', async ({ page }) => {
  await enterListerEvent(page)
  await openBrinSelector(page)
  await press(page, ' ')      // coche b1 (premier brin, déjà focusé)
  await press(page, 'Enter')  // applique

  const items = pane1(page).locator('.event-item')
  await expect(items.nth(0)).not.toHaveClass(/hidden/)  // e1 a b1 → visible
  await expect(items.nth(1)).toHaveClass(/hidden/)       // e2 n'a pas b1 → masqué
  await expect(items.nth(2)).not.toHaveClass(/hidden/)  // e3 a b1+b2 → visible
  await expect(items.nth(3)).toHaveClass(/hidden/)       // e4 aucun brin → masqué
})

test('Escape dans le sélecteur n\'applique pas le filtre', async ({ page }) => {
  await enterListerEvent(page)
  await openBrinSelector(page)
  await press(page, ' ')      // coche b1
  await press(page, 'Escape') // annule

  const items = pane1(page).locator('.event-item')
  await expect(items.nth(0)).not.toHaveClass(/hidden/)
  await expect(items.nth(1)).not.toHaveClass(/hidden/)
  await expect(items.nth(2)).not.toHaveClass(/hidden/)
  await expect(items.nth(3)).not.toHaveClass(/hidden/)
})

test(': puis : efface le filtre brin et réaffiche tous les events', async ({ page }) => {
  await enterListerEvent(page)
  await openBrinSelector(page)
  await press(page, ' ')
  await press(page, 'Enter')

  // filtre actif : e2 et e4 masqués
  await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/hidden/)

  // effacement : `:` une seconde fois ferme la bar et efface les filtres
  await press(page, ':')

  const items = pane1(page).locator('.event-item')
  await expect(items.nth(0)).not.toHaveClass(/hidden/)
  await expect(items.nth(1)).not.toHaveClass(/hidden/)
  await expect(items.nth(2)).not.toHaveClass(/hidden/)
  await expect(items.nth(3)).not.toHaveClass(/hidden/)
})
