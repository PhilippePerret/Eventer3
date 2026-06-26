// Origine : tests/specs/e2e/brin/brins-panel.spec.js
import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1 } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('with-brins')
})

// fixture with-brins : project-a (hl:true), events e1/e2, brins b1 (MON, non-coché) / b2 (AUT, coché)

async function goToListerEvent(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await pane1(page).locator('.project-item.selected').press('ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
}

async function openBrinPanel(page) {
  await goToListerEvent(page)
  await pane1(page).locator('.event-item.selected').press('b')
  await expect(pane1(page).locator('#brins-panel')).toBeVisible()
}

// --- Ouverture / fermeture ---

test("b ouvre le panneau des brins", async ({ page }) => {
  await goToListerEvent(page)
  await pane1(page).locator('.event-item.selected').press('b')
  await expect(pane1(page).locator('#brins-panel')).toBeVisible()
})

test("l'ListerEvent reste visible en fond pendant que le panneau est ouvert", async ({ page }) => {
  await openBrinPanel(page)
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
})


test("b ferme le panneau des brins quand il est actif", async ({ page }) => {
  await openBrinPanel(page)
  await pane1(page).locator('.brin-item.selected').press('b')
  await expect(pane1(page).locator('#brins-panel')).not.toBeVisible()
})

test("Cmd+Enter ferme le panneau", async ({ page }) => {
  await openBrinPanel(page)
  await pane1(page).locator('.brin-item.selected').press('Meta+Enter')
  await expect(pane1(page).locator('#brins-panel')).not.toBeVisible()
})

test("après fermeture, l'ListerEvent redevient actif (↓ change la sélection d'event)", async ({ page }) => {
  await openBrinPanel(page)
  await pane1(page).locator('.brin-item.selected').press('b')
  await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  await pane1(page).locator('.event-item.selected').press('ArrowDown')
  await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)
})

// --- Affichage ---

test("le panneau affiche tous les brins existants", async ({ page }) => {
  await openBrinPanel(page)
  await expect(pane1(page).locator('.brin-item')).toHaveCount(2)
  await expect(pane1(page).locator('.brin-item').nth(0).locator('.brin-title')).toHaveText('Mon brin')
  await expect(pane1(page).locator('.brin-item').nth(1).locator('.brin-title')).toHaveText('Autre brin')
})

test("les badges sont affichés", async ({ page }) => {
  await openBrinPanel(page)
  await expect(pane1(page).locator('.brin-item').nth(0).locator('.brin-badge')).toHaveText('MON')
  await expect(pane1(page).locator('.brin-item').nth(1).locator('.brin-badge')).toHaveText('AUT')
})

test("les brins cochés (ch:true) ont la classe checked", async ({ page }) => {
  await openBrinPanel(page)
  await expect(pane1(page).locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/checked/)
})

test("seuls les brins de l'event sélectionné sont cochés à l'ouverture", async ({ page }) => {
  // e1 sélectionné : seul b2 coché (e1 a bi=["b2"])
  await goToListerEvent(page)
  await pane1(page).locator('.event-item.selected').press('b')
  await expect(pane1(page).locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/checked/)
  await pane1(page).locator('.brin-item.selected').press('b')
  // e2 sélectionné : aucun brin coché (e2 n'a pas de bi)
  await pane1(page).locator('.event-item.selected').press('ArrowDown')
  await pane1(page).locator('.event-item.selected').press('b')
  await expect(pane1(page).locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  await expect(pane1(page).locator('.brin-item').nth(1)).not.toHaveClass(/checked/)
  await pane1(page).locator('.brin-item.selected').press('b')
  // retour à e1 : b2 doit de nouveau être coché (pas de stale state)
  await pane1(page).locator('.event-item.selected').press('ArrowUp')
  await pane1(page).locator('.event-item.selected').press('b')
  await expect(pane1(page).locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/checked/)
})

test("le premier brin est sélectionné à l'ouverture", async ({ page }) => {
  await openBrinPanel(page)
  await expect(pane1(page).locator('.brin-item').nth(0)).toHaveClass(/selected/)
})

// --- Navigation ---

test("↓ sélectionne le brin suivant", async ({ page }) => {
  await openBrinPanel(page)
  await pane1(page).locator('.brin-item.selected').press('ArrowDown')
  await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/selected/)
})

test("↑ sélectionne le brin précédent", async ({ page }) => {
  await openBrinPanel(page)
  await pane1(page).locator('.brin-item.selected').press('ArrowDown')
  await pane1(page).locator('.brin-item.selected').press('ArrowUp')
  await expect(pane1(page).locator('.brin-item').nth(0)).toHaveClass(/selected/)
})

test("↓↑ dans le panneau ne modifient pas la sélection de l'ListerEvent", async ({ page }) => {
  await openBrinPanel(page)
  await pane1(page).locator('.brin-item.selected').press('ArrowDown')
  await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
})

// --- Space (cocher / décocher) ---

test("Space coche un brin non-coché", async ({ page }) => {
  await openBrinPanel(page)
  await expect(pane1(page).locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  await pane1(page).locator('.brin-item.selected').press(' ')
  await expect(pane1(page).locator('.brin-item').nth(0)).toHaveClass(/checked/)
})

test("Space décoche un brin déjà coché", async ({ page }) => {
  await openBrinPanel(page)
  await pane1(page).locator('.brin-item.selected').press('ArrowDown')
  await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/checked/)
  await pane1(page).locator('.brin-item.selected').press(' ')
  await expect(pane1(page).locator('.brin-item').nth(1)).not.toHaveClass(/checked/)
})

// --- Création ---

test("n ouvre l'éditeur pour un nouveau brin (input title focalisé)", async ({ page }) => {
  await openBrinPanel(page)
  await pane1(page).locator('.brin-item.selected').press('n')
  const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
  await expect(titleInput).toBeFocused()
})

test("créer un brin : Enter valide et l'ajoute à la liste", async ({ page }) => {
  await openBrinPanel(page)
  await pane1(page).locator('.brin-item.selected').press('n')
  const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
  await titleInput.fill('Nouveau brin')
  await pane1(page).locator('.brin-item.selected').press('Enter')
  await expect(pane1(page).locator('.brin-item')).toHaveCount(3)
  await expect(pane1(page).locator('.brin-item').nth(1).locator('.brin-title')).toHaveText('Nouveau brin')
})

test("créer un brin : Escape annule, liste inchangée", async ({ page }) => {
  await openBrinPanel(page)
  await pane1(page).locator('.brin-item.selected').press('n')
  await pane1(page).locator('.brin-item.selected').press('Escape')
  await expect(pane1(page).locator('.brin-item')).toHaveCount(2)
})

// --- Édition ---

test("Enter édite le brin sélectionné (input title focalisé avec valeur courante)", async ({ page }) => {
  await openBrinPanel(page)
  await pane1(page).locator('.brin-item.selected').press('Enter')
  const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
  await expect(titleInput).toBeFocused()
  await expect(titleInput).toHaveText("Mon brin")
})

test("Tab en édition passe du titre au badge", async ({ page }) => {
  await openBrinPanel(page)
  await pane1(page).locator('.brin-item.selected').press('Enter')
  await expect(pane1(page).locator('.brin-item.selected [data-field="title"]')).toBeFocused()
  await pane1(page).locator('.brin-item.selected').press('Tab')
  const badgeInput = pane1(page).locator('.brin-item.selected [data-field="badge"]')
  await expect(badgeInput).toBeFocused()
  await expect(badgeInput).toHaveText('MON')
})

test("Tab depuis la couleur revient au titre (cycle complet)", async ({ page }) => {
  await openBrinPanel(page)
  await pane1(page).locator('.brin-item.selected').press('Enter')
  await expect(pane1(page).locator('.brin-item.selected [data-field="title"]')).toBeFocused()
  await pane1(page).locator('.brin-item.selected').press('Tab')
  await expect(pane1(page).locator('.brin-item.selected [data-field="badge"]')).toBeFocused()
  await pane1(page).locator('.brin-item.selected').press('Tab')
  await expect(pane1(page).locator('.brin-item.selected [data-field="type"]')).toBeFocused()
  await pane1(page).locator('.brin-item.selected').press('Tab')
  await expect(pane1(page).locator('.brin-item.selected [data-field="color"]')).toBeFocused()
  // color → title (wrap-around)
  await pane1(page).locator('.brin-item.selected').press('Tab')
  await expect(pane1(page).locator('.brin-item.selected [data-field="title"]')).toBeFocused()
})

test("Tab en édition cycle sur les 4 champs : title → badge → type → color", async ({ page }) => {
  await openBrinPanel(page)
  await pane1(page).locator('.brin-item.selected').press('Enter')
  await expect(pane1(page).locator('.brin-item.selected [data-field="title"]')).toBeFocused()
  await pane1(page).locator('.brin-item.selected').press('Tab')
  await expect(pane1(page).locator('.brin-item.selected [data-field="badge"]')).toBeFocused()
  await pane1(page).locator('.brin-item.selected').press('Tab')
  await expect(pane1(page).locator('.brin-item.selected [data-field="type"]')).toBeFocused()
  await pane1(page).locator('.brin-item.selected').press('Tab')
  await expect(pane1(page).locator('.brin-item.selected [data-field="color"]')).toBeFocused()
})

test("édition : modifier le titre puis Enter met à jour l'affichage", async ({ page }) => {
  await openBrinPanel(page)
  await pane1(page).locator('.brin-item.selected').press('Enter')
  const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
  await titleInput.fill('Brin renommé')
  await pane1(page).locator('.brin-item.selected').press('Enter')
  await expect(pane1(page).locator('.brin-item').nth(0).locator('.brin-title')).toHaveText('Brin renommé')
})

test("édition : Escape restaure le titre original", async ({ page }) => {
  await openBrinPanel(page)
  await pane1(page).locator('.brin-item.selected').press('Enter')
  const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
  await titleInput.fill('Titre temporaire')
  await pane1(page).locator('.brin-item.selected').press('Escape')
  await expect(pane1(page).locator('.brin-item').nth(0).locator('.brin-title')).toHaveText('Mon brin')
})

// --- Persistance ---

test("persistance : brin créé survit au rechargement", async ({ page }) => {
  await openBrinPanel(page)
  await pane1(page).locator('.brin-item.selected').press('n')
  const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
  await titleInput.fill('Brin persisté')
  await pane1(page).locator('.brin-item.selected').press('Enter')
  await page.waitForLoadState('networkidle')

  await page.reload()
  await goToListerEvent(page)
  await pane1(page).locator('.event-item.selected').press('b')
  await expect(pane1(page).locator('.brin-item')).toHaveCount(3)
  await expect(pane1(page).locator('.brin-item').nth(1).locator('.brin-title')).toHaveText('Brin persisté')
})

test("persistance : brin édité survit au rechargement", async ({ page }) => {
  await openBrinPanel(page)
  await pane1(page).locator('.brin-item.selected').press('Enter')
  const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
  await titleInput.fill('Brin modifié')
  await pane1(page).locator('.brin-item.selected').press('Enter')
  await page.waitForLoadState('networkidle')

  await page.reload()
  await goToListerEvent(page)
  await pane1(page).locator('.event-item.selected').press('b')
  await expect(pane1(page).locator('.brin-item').nth(0).locator('.brin-title')).toHaveText('Brin modifié')
})

test("persistance : cochage survit au rechargement", async ({ page }) => {
  await openBrinPanel(page)
  await pane1(page).locator('.brin-item.selected').press(' ')
  await page.waitForLoadState('networkidle')

  await page.reload()
  await goToListerEvent(page)
  await pane1(page).locator('.event-item.selected').press('b')
  await expect(pane1(page).locator('.brin-item').nth(0)).toHaveClass(/checked/)
})
