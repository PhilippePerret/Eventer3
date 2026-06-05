import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('with-persos')
})

// fixture with-persos : project-a, events e1/e2, brins b1 (MON)
// persos c1 (Cyrano, badge CY, assigné à e1) / c2 (Roxane, badge RO, non assigné)

async function goToEventLister(page) {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
}

async function openPersoPanel(page) {
  await goToEventLister(page)
  await page.keyboard.press('p')
  await expect(page.locator('#perso-panel')).toBeVisible()
}

// --- Ouverture / fermeture ---

test("p ouvre le panneau des personnages depuis EventLister", async ({ page }) => {
  await goToEventLister(page)
  await page.keyboard.press('p')
  await expect(page.locator('#perso-panel')).toBeVisible()
})

test("l'EventLister reste visible en fond pendant que le panneau est ouvert", async ({ page }) => {
  await openPersoPanel(page)
  await expect(page.locator('#main-panel')).toBeVisible()
})

test("Escape ferme le panneau perso", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('Escape')
  await expect(page.locator('#perso-panel')).not.toBeVisible()
})

test("Cmd+Enter ferme le panneau perso", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('Meta+Enter')
  await expect(page.locator('#perso-panel')).not.toBeVisible()
})

test("après fermeture, l'EventLister redevient actif (↓ change la sélection d'event)", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('Escape')
  await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.event-item').nth(1)).toHaveClass(/selected/)
})

// --- Affichage ---

test("le panneau affiche tous les personnages existants", async ({ page }) => {
  await openPersoPanel(page)
  await expect(page.locator('.perso-item')).toHaveCount(2)
  await expect(page.locator('.perso-item').nth(0).locator('.perso-item__title')).toHaveText('Cyrano')
  await expect(page.locator('.perso-item').nth(1).locator('.perso-item__title')).toHaveText('Roxane')
})

test("les badges sont affichés (2 lettres)", async ({ page }) => {
  await openPersoPanel(page)
  await expect(page.locator('.perso-item').nth(0).locator('.perso-item__badge')).toHaveText('CY')
  await expect(page.locator('.perso-item').nth(1).locator('.perso-item__badge')).toHaveText('RO')
})

test("les persos cochés (perso_ids de l'event) ont la classe checked", async ({ page }) => {
  await openPersoPanel(page)
  // e1 sélectionné : c1 (Cyrano) coché
  await expect(page.locator('.perso-item').nth(0)).toHaveClass(/checked/)
  await expect(page.locator('.perso-item').nth(1)).not.toHaveClass(/checked/)
})

test("seuls les persos de l'event sélectionné sont cochés à l'ouverture", async ({ page }) => {
  // e1 : seul c1 coché
  await goToEventLister(page)
  await page.keyboard.press('p')
  await expect(page.locator('.perso-item').nth(0)).toHaveClass(/checked/)
  await expect(page.locator('.perso-item').nth(1)).not.toHaveClass(/checked/)
  await page.keyboard.press('Escape')
  // e2 : aucun coché
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('p')
  await expect(page.locator('.perso-item').nth(0)).not.toHaveClass(/checked/)
  await expect(page.locator('.perso-item').nth(1)).not.toHaveClass(/checked/)
})

test("le premier perso est sélectionné à l'ouverture", async ({ page }) => {
  await openPersoPanel(page)
  await expect(page.locator('.perso-item').nth(0)).toHaveClass(/selected/)
})

// --- Navigation ---

test("↓ sélectionne le perso suivant", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.perso-item').nth(1)).toHaveClass(/selected/)
})

test("↑ sélectionne le perso précédent", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowUp')
  await expect(page.locator('.perso-item').nth(0)).toHaveClass(/selected/)
})

test("↓↑ dans le panneau ne modifient pas la sélection de l'EventLister", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)
})

// --- Space (cocher / décocher) ---

test("Space coche un perso non-coché", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.perso-item').nth(1)).not.toHaveClass(/checked/)
  await page.keyboard.press(' ')
  await expect(page.locator('.perso-item').nth(1)).toHaveClass(/checked/)
})

test("Space décoche un perso déjà coché", async ({ page }) => {
  await openPersoPanel(page)
  await expect(page.locator('.perso-item').nth(0)).toHaveClass(/checked/)
  await page.keyboard.press(' ')
  await expect(page.locator('.perso-item').nth(0)).not.toHaveClass(/checked/)
})

// --- Badges sur l'event ---

test("les badges persos cochés apparaissent sur la ligne de l'event", async ({ page }) => {
  await openPersoPanel(page)
  // c1 (CY) est déjà coché pour e1
  const eventEl = page.locator('.event-item').nth(0)
  await expect(eventEl.locator('.event-persos-badges .badge')).toHaveCount(1)
  await expect(eventEl.locator('.event-persos-badges .badge').nth(0)).toHaveText('CY')
})

test("cocher un perso ajoute son badge sur l'event", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press(' ')
  const eventEl = page.locator('.event-item').nth(0)
  await expect(eventEl.locator('.event-persos-badges .badge')).toHaveCount(2)
})

// --- Création ---

test("n ouvre l'éditeur pour un nouveau perso (input title focalisé)", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('n')
  const titleInput = page.locator('.perso-item.selected input[name="title"]')
  await expect(titleInput).toBeFocused()
})

test("créer un perso : Enter valide et l'ajoute à la liste", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('n')
  const titleInput = page.locator('.perso-item.selected input[name="title"]')
  await titleInput.fill('Nouveau perso')
  await page.keyboard.press('Enter')
  await expect(page.locator('.perso-item')).toHaveCount(3)
  await expect(page.locator('.perso-item').nth(0).locator('.perso-item__title')).toHaveText('Nouveau perso')
})

test("créer un perso : Escape annule, liste inchangée", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('n')
  await page.keyboard.press('Escape')
  await expect(page.locator('.perso-item')).toHaveCount(2)
})

// --- Édition ---

test("Enter édite le perso sélectionné (input title avec valeur courante)", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('Enter')
  const titleInput = page.locator('.perso-item.selected input[name="title"]')
  await expect(titleInput).toBeFocused()
  await expect(titleInput).toHaveValue('Cyrano')
})

test("Tab en édition cycle : title → patronyme → badge → fonction", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('Enter')
  await expect(page.locator('.perso-item.selected input[name="title"]')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.locator('.perso-item.selected input[name="patronyme"]')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.locator('.perso-item.selected input[name="badge"]')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.locator('.perso-item.selected select[data-property="fonction"]')).toBeFocused()
})

// --- Persistance ---

test("persistance : perso créé survit au rechargement", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('n')
  const titleInput = page.locator('.perso-item.selected input[name="title"]')
  await titleInput.fill('Perso persisté')
  await page.keyboard.press('Enter')
  await page.waitForLoadState('networkidle')

  await page.reload()
  await goToEventLister(page)
  await page.keyboard.press('p')
  await expect(page.locator('.perso-item')).toHaveCount(3)
  await expect(page.locator('.perso-item').nth(0).locator('.perso-item__title')).toHaveText('Perso persisté')
})

test("persistance : cochage survit au rechargement", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press(' ')
  await page.waitForLoadState('networkidle')

  await page.reload()
  await goToEventLister(page)
  await page.keyboard.press('p')
  await expect(page.locator('.perso-item').nth(1)).toHaveClass(/checked/)
})
