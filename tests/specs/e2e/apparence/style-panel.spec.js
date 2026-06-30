// Origine : tests/specs/e2e/apparence/style-panel.spec.js
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1, press } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('with-styles')
})

// fixture with-styles :
//   project-a, events e1/e2, brins b1/b2
//   themes/default.css : .titre (font-size:26px, underline), .note-rouge (font-size:9px, red, margin)

async function goToListerEvent(page) {
  await page.goto('/')
  await pane1(page).locator('#projects-panel').waitFor()
  await press(page, 'ArrowRight')
  await pane1(page).locator('#events-panel').waitFor()
}

async function openStylePanel(page) {
  await goToListerEvent(page)
  await press(page, 's')
  await pane1(page).locator('#style-panel').waitFor()
}

// ─── Ouverture / fermeture ──────────────────────────────────────────────────

test("s ouvre le panneau des styles depuis l'ListerEvent", async ({ page }) => {
  await goToListerEvent(page)
  await press(page, 's')
  await pane1(page).locator('#style-panel').waitFor()
})

test("l'ListerEvent reste visible en fond pendant que le panneau est ouvert", async ({ page }) => {
  await openStylePanel(page)
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
})

test("s ferme le panneau quand il est actif", async ({ page }) => {
  await openStylePanel(page)
  await press(page, 's')
  await expect(pane1(page).locator('#style-panel')).not.toBeVisible()
})

test("Cmd+Enter ferme le panneau des styles", async ({ page }) => {
  await openStylePanel(page)
  await press(page, 'Meta+Enter')
  await expect(pane1(page).locator('#style-panel')).not.toBeVisible()
})

test("après fermeture, l'ListerEvent redevient actif (↓ change la sélection)", async ({ page }) => {
  await openStylePanel(page)
  await press(page, 's')
  await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)
})

// ─── Affichage ──────────────────────────────────────────────────────────────

test("le panneau affiche les styles disponibles (2 dans le fixture)", async ({ page }) => {
  await openStylePanel(page)
  await expect(pane1(page).locator('.style-item')).toHaveCount(2)
})

test("chaque style-item a un attribut data-name avec le nom de la classe CSS", async ({ page }) => {
  await openStylePanel(page)
  const name0 = await pane1(page).locator('.style-item').nth(0).getAttribute('data-name')
  const name1 = await pane1(page).locator('.style-item').nth(1).getAttribute('data-name')
  expect(name0).toBeTruthy()
  expect(name1).toBeTruthy()
  expect(name0).not.toBe(name1)
})

test("chaque style-item a un aperçu textuel (.style-item__preview)", async ({ page }) => {
  await openStylePanel(page)
  await expect(pane1(page).locator('.style-item').nth(0).locator('.style-item__preview')).toBeVisible()
  await expect(pane1(page).locator('.style-item').nth(1).locator('.style-item__preview')).toBeVisible()
})

test("le premier style est sélectionné à l'ouverture", async ({ page }) => {
  await openStylePanel(page)
  await expect(pane1(page).locator('.style-item').nth(0)).toHaveClass(/selected/)
  await expect(pane1(page).locator('.style-item').nth(1)).not.toHaveClass(/selected/)
})

test("aucun style n'est coché à l'ouverture (event sans css)", async ({ page }) => {
  await openStylePanel(page)
  await expect(pane1(page).locator('.style-item').nth(0)).not.toHaveClass(/checked/)
  await expect(pane1(page).locator('.style-item').nth(1)).not.toHaveClass(/checked/)
})

// ─── Navigation ─────────────────────────────────────────────────────────────

test("↓ sélectionne le style suivant", async ({ page }) => {
  await openStylePanel(page)
  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.style-item').nth(1)).toHaveClass(/selected/)
  await expect(pane1(page).locator('.style-item').nth(0)).not.toHaveClass(/selected/)
})

test("↑ sélectionne le style précédent", async ({ page }) => {
  await openStylePanel(page)
  await press(page, 'ArrowDown')
  await press(page, 'ArrowUp')
  await expect(pane1(page).locator('.style-item').nth(0)).toHaveClass(/selected/)
})

test("↓↑ ne modifient pas la sélection de l'ListerEvent", async ({ page }) => {
  await openStylePanel(page)
  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
})

// ─── Cocher / décocher ───────────────────────────────────────────────────────

test("Space coche un style non-coché", async ({ page }) => {
  await openStylePanel(page)
  await expect(pane1(page).locator('.style-item').nth(0)).not.toHaveClass(/checked/)
  await press(page, ' ')
  await expect(pane1(page).locator('.style-item').nth(0)).toHaveClass(/checked/)
})

test("Space décoche un style coché", async ({ page }) => {
  await openStylePanel(page)
  await press(page, ' ')
  await press(page, ' ')
  await expect(pane1(page).locator('.style-item').nth(0)).not.toHaveClass(/checked/)
})

// ─── Application CSS immédiate ───────────────────────────────────────────────

test("cocher .titre applique font-size:26px à .event-title de l'event courant", async ({ page }) => {
  await openStylePanel(page)
  const name0 = await pane1(page).locator('.style-item').nth(0).getAttribute('data-name')
  expect(name0).toBe('titre')
  await press(page, ' ')
  await expect(pane1(page).locator('.event-item').nth(0).locator('.event-title'))
    .toHaveCSS('font-size', '26px')
})

test("cocher .note-rouge applique font-size:9px à .event-title", async ({ page }) => {
  await openStylePanel(page)
  await press(page, 'ArrowDown')
  const name1 = await pane1(page).locator('.style-item').nth(1).getAttribute('data-name')
  expect(name1).toBe('note-rouge')
  await press(page, ' ')
  await expect(pane1(page).locator('.event-item').nth(0).locator('.event-title'))
    .toHaveCSS('font-size', '9px')
})

test("cocher .note-rouge applique margin-left à .event-title (inline-block requis)", async ({ page }) => {
  await openStylePanel(page)
  await press(page, 'ArrowDown')
  await press(page, ' ')
  const ml = await pane1(page).locator('.event-item').nth(0).locator('.event-title').evaluate(el =>
    getComputedStyle(el).marginLeft
  )
  expect(ml).not.toBe('0px')
})

test("décocher un style retire son effet CSS de .event-title", async ({ page }) => {
  await openStylePanel(page)
  await press(page, ' ')
  await press(page, ' ')
  const fontSize = await pane1(page).locator('.event-item').nth(0).locator('.event-title').evaluate(el =>
    parseFloat(getComputedStyle(el).fontSize)
  )
  expect(fontSize).not.toBe(26)
})

// ─── L'ordre compte ──────────────────────────────────────────────────────────

test("ordre [titre, note-rouge] → font-size 9px (note-rouge appliqué en dernier, gagne)", async ({ page }) => {
  await openStylePanel(page)
  await press(page, ' ')           // cocher .titre (index 0)
  await press(page, 'ArrowDown')   // → .note-rouge
  await press(page, ' ')           // cocher .note-rouge
  // ordre panel : [titre, note-rouge] → note-rouge appliqué en dernier → 9px
  await expect(pane1(page).locator('.event-item').nth(0).locator('.event-title'))
    .toHaveCSS('font-size', '9px')
})

test("inverser l'ordre [note-rouge, titre] → font-size 26px (titre appliqué en dernier)", async ({ page }) => {
  await openStylePanel(page)
  await press(page, ' ')               // cocher .titre (index 0, sélectionné)
  await press(page, 'ArrowDown')
  await press(page, ' ')               // cocher .note-rouge (index 1)
  await press(page, 'ArrowUp')         // revenir sur .titre (index 0)
  await press(page, 'Meta+ArrowDown')  // ⌘↓ déplace .titre après .note-rouge
  // titre appliqué en dernier → 26px
  await expect(pane1(page).locator('.event-item').nth(0).locator('.event-title'))
    .toHaveCSS('font-size', '26px')
})

// ─── Réordonnancement ────────────────────────────────────────────────────────

test("⌘↓ déplace le style vers le bas dans le panneau", async ({ page }) => {
  await openStylePanel(page)
  const nameBefore = await pane1(page).locator('.style-item').nth(0).getAttribute('data-name')
  await press(page, 'Meta+ArrowDown')
  const nameAfter = await pane1(page).locator('.style-item').nth(0).getAttribute('data-name')
  expect(nameAfter).not.toBe(nameBefore)
})

test("⌘↑ déplace le style vers le haut dans le panneau", async ({ page }) => {
  await openStylePanel(page)
  await press(page, 'ArrowDown')
  const nameAt1 = await pane1(page).locator('.style-item').nth(1).getAttribute('data-name')
  await press(page, 'Meta+ArrowUp')
  const nameAt0After = await pane1(page).locator('.style-item').nth(0).getAttribute('data-name')
  expect(nameAt0After).toBe(nameAt1)
})

// ─── Changement d'event en fond (⌥↓/⌥↑) ────────────────────────────────────

test("⌥↓ passe à l'event suivant en fond, mise à jour des styles cochés", async ({ page }) => {
  await openStylePanel(page)
  await press(page, ' ')             // cocher .titre sur e1
  await press(page, 'Alt+ArrowDown') // passer à e2
  await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)
  await expect(pane1(page).locator('.style-item').nth(0)).not.toHaveClass(/checked/)
})

test("⌥↑ revient à l'event précédent, styles cochés restaurés", async ({ page }) => {
  await openStylePanel(page)
  await press(page, ' ')             // cocher .titre sur e1
  await press(page, 'Alt+ArrowDown')
  await press(page, 'Alt+ArrowUp')
  await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  await expect(pane1(page).locator('.style-item').nth(0)).toHaveClass(/checked/)
})

// ─── Persistance ─────────────────────────────────────────────────────────────

test("persistance : style coché survit au rechargement", async ({ page }) => {
  await openStylePanel(page)
  await press(page, ' ') // cocher .titre
  await page.waitForLoadState('networkidle')

  await page.reload()
  await goToListerEvent(page)
  await press(page, 's')
  await pane1(page).locator('#style-panel').waitFor()
  await expect(pane1(page).locator('.style-item').nth(0)).toHaveClass(/checked/)
})

test("persistance : style décoché survit au rechargement", async ({ page }) => {
  await openStylePanel(page)
  await press(page, ' ')
  await press(page, ' ') // cocher puis décocher
  await page.waitForLoadState('networkidle')

  await page.reload()
  await goToListerEvent(page)
  await press(page, 's')
  await pane1(page).locator('#style-panel').waitFor()
  await expect(pane1(page).locator('.style-item').nth(0)).not.toHaveClass(/checked/)
})

test("persistance : font-size correcte sur .event-title après rechargement", async ({ page }) => {
  await openStylePanel(page)
  await press(page, ' ') // cocher .titre → 26px
  await page.waitForLoadState('networkidle')

  await page.reload()
  await goToListerEvent(page)
  await expect(pane1(page).locator('.event-item').nth(0).locator('.event-title'))
    .toHaveCSS('font-size', '26px')
})

test("persistance : ordre inversé survit au rechargement (titre après note-rouge → 26px)", async ({ page }) => {
  await openStylePanel(page)
  await press(page, ' ')                 // cocher .titre
  await press(page, 'ArrowDown')
  await press(page, ' ')                 // cocher .note-rouge
  await press(page, 'ArrowUp')
  await press(page, 'Meta+ArrowDown')    // ordre → [note-rouge, titre]
  await page.waitForLoadState('networkidle')

  await page.reload()
  await goToListerEvent(page)
  await expect(pane1(page).locator('.event-item').nth(0).locator('.event-title'))
    .toHaveCSS('font-size', '26px')
})

// ─── Footer ──────────────────────────────────────────────────────────────────

test("le panneau styles n'affiche pas 'nouveau après' dans le footer", async ({ page }) => {
  await openStylePanel(page)
  const footerText = await pane1(page).locator('#shortcuts-footer').textContent()
  expect(footerText).not.toContain('nouveau après')
})

test("le panneau styles affiche 'monter'/'descendre' dans l'aide contextuelle", async ({ page }) => {
  await openStylePanel(page)
  await press(page, 'Meta+?')
  const helpText = await pane1(page).locator('.contextual-help').textContent()
  expect(helpText.toLowerCase()).toContain('monter')
  expect(helpText.toLowerCase()).toContain('descendre')
})
