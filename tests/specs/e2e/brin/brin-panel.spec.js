import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('with-brins')
})

// fixture with-brins : project-a (hl:true), events e1/e2, brins b1 (MON, non-coché) / b2 (AUT, coché)

async function goToEventLister(page) {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
}

async function openBrinPanel(page) {
  await goToEventLister(page)
  await page.keyboard.press('b')
  await expect(page.locator('#brin-panel')).toBeVisible()
}

// --- Ouverture / fermeture ---

test("b ouvre le panneau des brins", async ({ page }) => {
  await goToEventLister(page)
  await page.keyboard.press('b')
  await expect(page.locator('#brin-panel')).toBeVisible()
})

test("l'EventLister reste visible en fond pendant que le panneau est ouvert", async ({ page }) => {
  await openBrinPanel(page)
  await expect(page.locator('#main-panel')).toBeVisible()
})

test("Escape ferme le panneau", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press('Escape')
  await expect(page.locator('#brin-panel')).not.toBeVisible()
})

test("Cmd+Enter ferme le panneau", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press('Meta+Enter')
  await expect(page.locator('#brin-panel')).not.toBeVisible()
})

test("après fermeture, l'EventLister redevient actif (↓ change la sélection d'event)", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press('Escape')
  await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.event-item').nth(1)).toHaveClass(/selected/)
})

// --- Affichage ---

test("le panneau affiche tous les brins existants", async ({ page }) => {
  await openBrinPanel(page)
  await expect(page.locator('.brin-item')).toHaveCount(2)
  await expect(page.locator('.brin-item').nth(0).locator('.brin-item__title')).toHaveText('Mon brin')
  await expect(page.locator('.brin-item').nth(1).locator('.brin-item__title')).toHaveText('Autre brin')
})

test("les badges sont affichés", async ({ page }) => {
  await openBrinPanel(page)
  await expect(page.locator('.brin-item').nth(0).locator('.brin-item__badge')).toHaveText('MON')
  await expect(page.locator('.brin-item').nth(1).locator('.brin-item__badge')).toHaveText('AUT')
})

test("les brins cochés (ch:true) ont la classe checked", async ({ page }) => {
  await openBrinPanel(page)
  await expect(page.locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  await expect(page.locator('.brin-item').nth(1)).toHaveClass(/checked/)
})

test("seuls les brins de l'event sélectionné sont cochés à l'ouverture", async ({ page }) => {
  // e1 sélectionné : seul b2 coché (e1 a bi=["b2"])
  await goToEventLister(page)
  await page.keyboard.press('b')
  await expect(page.locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  await expect(page.locator('.brin-item').nth(1)).toHaveClass(/checked/)
  await page.keyboard.press('Escape')
  // e2 sélectionné : aucun brin coché (e2 n'a pas de bi)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('b')
  await expect(page.locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  await expect(page.locator('.brin-item').nth(1)).not.toHaveClass(/checked/)
  await page.keyboard.press('Escape')
  // retour à e1 : b2 doit de nouveau être coché (pas de stale state)
  await page.keyboard.press('ArrowUp')
  await page.keyboard.press('b')
  await expect(page.locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  await expect(page.locator('.brin-item').nth(1)).toHaveClass(/checked/)
})

test("le premier brin est sélectionné à l'ouverture", async ({ page }) => {
  await openBrinPanel(page)
  await expect(page.locator('.brin-item').nth(0)).toHaveClass(/selected/)
})

// --- Navigation ---

test("↓ sélectionne le brin suivant", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.brin-item').nth(1)).toHaveClass(/selected/)
})

test("↑ sélectionne le brin précédent", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowUp')
  await expect(page.locator('.brin-item').nth(0)).toHaveClass(/selected/)
})

test("↓↑ dans le panneau ne modifient pas la sélection de l'EventLister", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)
})

// --- Space (cocher / décocher) ---

test("Space coche un brin non-coché", async ({ page }) => {
  await openBrinPanel(page)
  await expect(page.locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  await page.keyboard.press(' ')
  await expect(page.locator('.brin-item').nth(0)).toHaveClass(/checked/)
})

test("Space décoche un brin déjà coché", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.brin-item').nth(1)).toHaveClass(/checked/)
  await page.keyboard.press(' ')
  await expect(page.locator('.brin-item').nth(1)).not.toHaveClass(/checked/)
})

// --- Création ---

test("n ouvre l'éditeur pour un nouveau brin (input title focalisé)", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press('n')
  const titleInput = page.locator('.brin-item.selected input[name="title"]')
  await expect(titleInput).toBeFocused()
})

test("créer un brin : Enter valide et l'ajoute à la liste", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press('n')
  const titleInput = page.locator('.brin-item.selected input[name="title"]')
  await titleInput.fill('Nouveau brin')
  await page.keyboard.press('Enter')
  await expect(page.locator('.brin-item')).toHaveCount(3)
  await expect(page.locator('.brin-item').nth(0).locator('.brin-item__title')).toHaveText('Nouveau brin')
})

test("créer un brin : Escape annule, liste inchangée", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press('n')
  await page.keyboard.press('Escape')
  await expect(page.locator('.brin-item')).toHaveCount(2)
})

// --- Édition ---

test("Enter édite le brin sélectionné (input title focalisé avec valeur courante)", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press('Enter')
  const titleInput = page.locator('.brin-item.selected input[name="title"]')
  await expect(titleInput).toBeFocused()
  await expect(titleInput).toHaveValue('Mon brin')
})

test("Tab en édition passe du titre au badge", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press('Enter')
  await expect(page.locator('.brin-item.selected input[name="title"]')).toBeFocused()
  await page.keyboard.press('Tab')
  const badgeInput = page.locator('.brin-item.selected input[name="badge"]')
  await expect(badgeInput).toBeFocused()
  await expect(badgeInput).toHaveValue('MON')
})

test("Tab depuis la couleur revient au titre (cycle complet)", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press('Enter')
  await expect(page.locator('.brin-item.selected input[name="title"]')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.locator('.brin-item.selected input[name="badge"]')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.locator('.brin-item.selected select[data-property="type"]')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.locator('.brin-item.selected input[data-property="color"]')).toBeFocused()
  // color → title (wrap-around)
  await page.keyboard.press('Tab')
  await expect(page.locator('.brin-item.selected input[name="title"]')).toBeFocused()
})

test("Tab en édition cycle sur les 4 champs : title → badge → type → color", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press('Enter')
  await expect(page.locator('.brin-item.selected input[name="title"]')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.locator('.brin-item.selected input[name="badge"]')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.locator('.brin-item.selected select[data-property="type"]')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.locator('.brin-item.selected input[data-property="color"]')).toBeFocused()
})

test("édition : modifier le titre puis Enter met à jour l'affichage", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press('Enter')
  const titleInput = page.locator('.brin-item.selected input[name="title"]')
  await titleInput.fill('Brin renommé')
  await page.keyboard.press('Enter')
  await expect(page.locator('.brin-item').nth(0).locator('.brin-item__title')).toHaveText('Brin renommé')
})

test("édition : Escape restaure le titre original", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press('Enter')
  const titleInput = page.locator('.brin-item.selected input[name="title"]')
  await titleInput.fill('Titre temporaire')
  await page.keyboard.press('Escape')
  await expect(page.locator('.brin-item').nth(0).locator('.brin-item__title')).toHaveText('Mon brin')
})

// --- Persistance ---

test("persistance : brin créé survit au rechargement", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press('n')
  const titleInput = page.locator('.brin-item.selected input[name="title"]')
  await titleInput.fill('Brin persisté')
  await page.keyboard.press('Enter')
  await page.waitForLoadState('networkidle')

  await page.reload()
  await goToEventLister(page)
  await page.keyboard.press('b')
  await expect(page.locator('.brin-item')).toHaveCount(3)
  await expect(page.locator('.brin-item').nth(0).locator('.brin-item__title')).toHaveText('Brin persisté')
})

test("persistance : brin édité survit au rechargement", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press('Enter')
  const titleInput = page.locator('.brin-item.selected input[name="title"]')
  await titleInput.fill('Brin modifié')
  await page.keyboard.press('Enter')
  await page.waitForLoadState('networkidle')

  await page.reload()
  await goToEventLister(page)
  await page.keyboard.press('b')
  await expect(page.locator('.brin-item').nth(0).locator('.brin-item__title')).toHaveText('Brin modifié')
})

test("persistance : cochage survit au rechargement", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press(' ')
  await page.waitForLoadState('networkidle')

  await page.reload()
  await goToEventLister(page)
  await page.keyboard.press('b')
  await expect(page.locator('.brin-item').nth(0)).toHaveClass(/checked/)
})
