import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('with-persos')
})

// Fixture with-persos :
//   project-a, events e1/e2, brin b1 (MON, perso_ids=[c2])
//   c1 Cyrano  (CY, direct sur e1,       sans avatar)
//   c2 Roxane  (RO, sur brin b1,          sans avatar) → hérité par e1
//   c3 Christian (CH, non assigné,        avatar 🎭)
//   c4 Valvert   (VA, non assigné,        avatar 👑)

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

// ─── Ouverture / fermeture ───────────────────────────────────────────────────

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

// ─── Sélection visuelle ──────────────────────────────────────────────────────

test("le perso sélectionné a un fond coloré visible (pas transparent)", async ({ page }) => {
  await openPersoPanel(page)
  await expect(page.locator('.perso-item').nth(0)).toHaveClass(/selected/)
  await expect(page.locator('.perso-item').nth(0)).toHaveCSS('background-color', 'rgb(77, 158, 254)')
})

// ─── Affichage ───────────────────────────────────────────────────────────────

test("le panneau affiche tous les personnages du projet", async ({ page }) => {
  await openPersoPanel(page)
  await expect(page.locator('.perso-item')).toHaveCount(4)
})

test("les pseudos sont affichés", async ({ page }) => {
  await openPersoPanel(page)
  await expect(page.locator('.perso-item').nth(0).locator('.perso-item__title')).toHaveText('Cyrano')
  await expect(page.locator('.perso-item').nth(1).locator('.perso-item__title')).toHaveText('Roxane')
})

test("les badges sont affichés (2 lettres)", async ({ page }) => {
  await openPersoPanel(page)
  await expect(page.locator('.perso-item').nth(0).locator('.perso-item__badge')).toHaveText('CY')
  await expect(page.locator('.perso-item').nth(1).locator('.perso-item__badge')).toHaveText('RO')
})

test("le premier perso est sélectionné à l'ouverture", async ({ page }) => {
  await openPersoPanel(page)
  await expect(page.locator('.perso-item').nth(0)).toHaveClass(/selected/)
})

// ─── Cochés : direct vs hérité ───────────────────────────────────────────────

test("c1 (direct e1) est coché et décochable", async ({ page }) => {
  await openPersoPanel(page)
  await expect(page.locator('.perso-item').nth(0)).toHaveClass(/checked/)
  await expect(page.locator('.perso-item').nth(0)).not.toHaveClass(/inherited/)
})

test("c2 (via brin b1) est coché et grisé (hérité)", async ({ page }) => {
  await openPersoPanel(page)
  await expect(page.locator('.perso-item').nth(1)).toHaveClass(/checked/)
  await expect(page.locator('.perso-item').nth(1)).toHaveClass(/inherited/)
})

test("c3 et c4 ne sont pas cochés", async ({ page }) => {
  await openPersoPanel(page)
  await expect(page.locator('.perso-item').nth(2)).not.toHaveClass(/checked/)
  await expect(page.locator('.perso-item').nth(3)).not.toHaveClass(/checked/)
})

test("Space ne décroche pas un perso hérité (grisé)", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('ArrowDown') // → c2 (inherited)
  await expect(page.locator('.perso-item').nth(1)).toHaveClass(/inherited/)
  await page.keyboard.press(' ')
  await expect(page.locator('.perso-item').nth(1)).toHaveClass(/checked/) // toujours coché
})

test("e2 (sans brins ni persos directs) : aucun perso coché", async ({ page }) => {
  await goToEventLister(page)
  await page.keyboard.press('ArrowDown') // e2
  await page.keyboard.press('p')
  await expect(page.locator('.perso-item').nth(0)).not.toHaveClass(/checked/)
  await expect(page.locator('.perso-item').nth(1)).not.toHaveClass(/checked/)
  await expect(page.locator('.perso-item').nth(2)).not.toHaveClass(/checked/)
  await expect(page.locator('.perso-item').nth(3)).not.toHaveClass(/checked/)
})

// ─── Navigation ──────────────────────────────────────────────────────────────

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

// ─── Space (cocher/décocher perso direct) ────────────────────────────────────

test("Space coche un perso non-coché (c3)", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown') // → c3
  await expect(page.locator('.perso-item').nth(2)).not.toHaveClass(/checked/)
  await page.keyboard.press(' ')
  await expect(page.locator('.perso-item').nth(2)).toHaveClass(/checked/)
})

test("Space décoche un perso direct coché (c1)", async ({ page }) => {
  await openPersoPanel(page)
  await expect(page.locator('.perso-item').nth(0)).toHaveClass(/checked/)
  await page.keyboard.press(' ')
  await expect(page.locator('.perso-item').nth(0)).not.toHaveClass(/checked/)
})

// ─── Badges persos sur la ligne de l'event ───────────────────────────────────

test("la ligne de e1 affiche le badge de c1 (direct) quand le panneau est ouvert", async ({ page }) => {
  await openPersoPanel(page)
  const eventEl = page.locator('.event-item').nth(0)
  await expect(eventEl.locator('.event-persos-marks')).toContainText('CY')
})

test("la ligne de e1 affiche le badge de c2 (hérité via brin b1) quand le panneau est ouvert", async ({ page }) => {
  await openPersoPanel(page)
  const eventEl = page.locator('.event-item').nth(0)
  await expect(eventEl.locator('.event-persos-marks')).toContainText('RO')
})

test("la ligne de e2 n'affiche aucun badge perso", async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('ArrowRight')
  const eventEl = page.locator('.event-item').nth(1)
  await expect(eventEl.locator('.event-persos-marks .perso-mark')).toHaveCount(0)
})

test("cocher c3 depuis le panneau perso de e1 ajoute son avatar sur la ligne de e1", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown') // → c3
  await page.keyboard.press(' ')
  const eventEl = page.locator('.event-item').nth(0)
  await expect(eventEl.locator('.event-persos-marks')).toContainText('🎭')
})

// ─── Avatar prioritaire sur badge ────────────────────────────────────────────

test("si un perso a un avatar, l'avatar s'affiche à la place du badge dans le panneau", async ({ page }) => {
  await openPersoPanel(page)
  // c3 (index 2) a avatar 🎭 → afficher 🎭 pas CH
  await expect(page.locator('.perso-item').nth(2).locator('.perso-item__badge')).toHaveText('🎭')
  await expect(page.locator('.perso-item').nth(3).locator('.perso-item__badge')).toHaveText('👑')
})

test("si perso assigné à l'event a un avatar, la ligne event affiche l'avatar pas le badge", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown') // → c3
  await page.keyboard.press(' ') // assigner c3 à e1
  const eventEl = page.locator('.event-item').nth(0)
  await expect(eventEl.locator('.event-persos-marks')).toContainText('🎭')
})

// ─── Unicité des avatars ─────────────────────────────────────────────────────

test("les avatars déjà utilisés ne sont pas proposés lors du choix pour un autre perso", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('Enter') // éditer c1
  await page.keyboard.press('Tab') // → patronyme
  await page.keyboard.press('Tab') // → badge
  await page.keyboard.press('Tab') // → avatar trigger
  await page.keyboard.press('ArrowDown') // → ouvre popup avatar
  await expect(page.locator('.popup-select')).toBeVisible()
  // 🎭 (c3) et 👑 (c4) ne doivent pas apparaître parmi les options régulières
  const options = page.locator('.popup-select__option:not(.popup-select__option--custom)')
  await expect(options.filter({ hasText: '🎭' })).toHaveCount(0)
  await expect(options.filter({ hasText: '👑' })).toHaveCount(0)
})

// ─── Création ────────────────────────────────────────────────────────────────

test("n ouvre l'éditeur pour un nouveau perso (input title focalisé)", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('n')
  await expect(page.locator('.perso-item.selected input[name="title"]')).toBeFocused()
})

test("créer un perso : Enter valide et l'ajoute à la liste", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('n')
  await page.locator('.perso-item.selected input[name="title"]').fill('Nouveau perso')
  await page.keyboard.press('Enter')
  await expect(page.locator('.perso-item')).toHaveCount(5)
  await expect(page.locator('.perso-item').nth(0).locator('.perso-item__title')).toHaveText('Nouveau perso')
})

test("créer un perso : Escape annule, liste inchangée", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('n')
  await page.keyboard.press('Escape')
  await expect(page.locator('.perso-item')).toHaveCount(4)
})

// ─── Édition ─────────────────────────────────────────────────────────────────

test("Enter édite le perso sélectionné (input title avec valeur courante)", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('Enter')
  const titleInput = page.locator('.perso-item.selected input[name="title"]')
  await expect(titleInput).toBeFocused()
  await expect(titleInput).toHaveValue('Cyrano')
})

test("Tab en édition cycle : title → patronyme → badge → avatar → fonction", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('Enter')
  await expect(page.locator('.perso-item.selected input[name="title"]')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.locator('.perso-item.selected input[name="patronyme"]')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.locator('.perso-item.selected input[name="badge"]')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.locator('.perso-item.selected [data-property="avatar"]')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.locator('.perso-item.selected [data-property="fonction"]')).toBeFocused()
})

test("édition : modifier le titre puis Enter met à jour l'affichage", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('Enter')
  await page.locator('.perso-item.selected input[name="title"]').fill('Cyrano de Bergerac')
  await page.keyboard.press('Enter')
  await expect(page.locator('.perso-item').nth(0).locator('.perso-item__title')).toHaveText('Cyrano de Bergerac')
})

// ─── Persistance ─────────────────────────────────────────────────────────────

test("persistance : perso créé survit au rechargement", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('n')
  await page.locator('.perso-item.selected input[name="title"]').fill('Perso persisté')
  await page.keyboard.press('Enter')
  await page.waitForLoadState('networkidle')
  await page.reload()
  await goToEventLister(page)
  await page.keyboard.press('p')
  await expect(page.locator('.perso-item')).toHaveCount(5)
  await expect(page.locator('.perso-item').nth(0).locator('.perso-item__title')).toHaveText('Perso persisté')
})

test("persistance : cochage direct survit au rechargement", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown') // → c3
  await page.keyboard.press(' ')
  await page.waitForLoadState('networkidle')
  await page.reload()
  await goToEventLister(page)
  await page.keyboard.press('p')
  await expect(page.locator('.perso-item').nth(2)).toHaveClass(/checked/)
})

// ─── Sélection après création ─────────────────────────────────────────────────

test("après création (Enter), le nouveau perso est sélectionné", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('n')
  await page.locator('.perso-item.selected input[name="title"]').fill('Nouveau')
  await page.keyboard.press('Enter')
  await expect(page.locator('.perso-item').nth(0)).toHaveClass(/selected/)
})

// ─── Sélection après édition ──────────────────────────────────────────────────

test("après édition (Enter), le perso modifié reste sélectionné", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('Enter') // édite c1
  await page.locator('.perso-item.selected input[name="title"]').fill('Cyrano modifié')
  await page.keyboard.press('Enter')
  await expect(page.locator('.perso-item').nth(0)).toHaveClass(/selected/)
})

// ─── Sélection à la réouverture ───────────────────────────────────────────────

test("réouverture : le premier perso est sélectionné", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('Escape')
  await expect(page.locator('#perso-panel')).not.toBeVisible()
  await page.keyboard.press('p')
  await expect(page.locator('#perso-panel')).toBeVisible()
  await expect(page.locator('.perso-item').nth(0)).toHaveClass(/selected/)
})

test("réouverture : ↓ change bien la sélection", async ({ page }) => {
  await openPersoPanel(page)
  await page.keyboard.press('Escape')
  await page.keyboard.press('p')
  await expect(page.locator('#perso-panel')).toBeVisible()
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.perso-item').nth(1)).toHaveClass(/selected/)
  await expect(page.locator('.perso-item').nth(0)).not.toHaveClass(/selected/)
})
