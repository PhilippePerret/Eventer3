// Origine: tests/specs/e2e/perso/perso-panel.spec.js
import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1, getErr } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('with-persos')
})

// Fixture with-persos :
//   project-a, events e1/e2, brin b1 (MON, perso_ids=[c2])
//   c1 Cyrano  (CY, direct sur e1,       sans avatar)
//   c2 Roxane  (RO, sur brin b1,          sans avatar) → hérité par e1
//   c3 Christian (CH, non assigné,        avatar 🎭)
//   c4 Valvert   (VA, non assigné,        avatar 👑)

async function goToListerEvent(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await pane1(page).locator('.project-item.selected').press('ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
}

async function openPersoPanel(page) {
  await goToListerEvent(page)
  await pane1(page).locator('.event-item.selected').press('p')
  await expect(pane1(page).locator('#persos-panel')).toBeVisible()
}

// ─── Ouverture / fermeture ───────────────────────────────────────────────────

test("p ouvre le panneau des personnages depuis ListerEvent", async ({ page }) => {
  await goToListerEvent(page)
  await pane1(page).locator('.event-item.selected').press('p')
  await expect(pane1(page).locator('#persos-panel')).toBeVisible()
})

test("l'ListerEvent reste visible en fond pendant que le panneau est ouvert", async ({ page }) => {
  await openPersoPanel(page)
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
})

test("Escape ferme le panneau perso", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.event-item.selected').press('Escape')
  await expect(pane1(page).locator('#persos-panel')).not.toBeVisible()
})

test("p ferme le panneau des persos quand il est actif", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.event-item.selected').press('p')
  await expect(pane1(page).locator('#persos-panel')).not.toBeVisible()
})

test("Cmd+Enter ferme le panneau perso", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.event-item.selected').press('Meta+Enter')
  await expect(pane1(page).locator('#persos-panel')).not.toBeVisible()
})

test("après fermeture, l'ListerEvent redevient actif (↓ change la sélection d'event)", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.event-item.selected').press('Escape')
  await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  await pane1(page).locator('.event-item.selected').press('ArrowDown')
  await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)
})

// ─── Sélection visuelle ──────────────────────────────────────────────────────

test("le perso sélectionné a un fond coloré visible (pas transparent)", async ({ page }) => {
  await openPersoPanel(page)
  await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
  await expect(pane1(page).locator('.perso-item').nth(0)).toHaveCSS('background-color', 'rgb(77, 158, 254)')
})

test("la coche d'un perso coché sélectionné est blanche (pas verte)", async ({ page }) => {
  await openPersoPanel(page)
  // c1 est sélectionné (index 0) ET coché (direct sur e1)
  const c1 = pane1(page).locator('.perso-item').nth(0)
  await expect(c1).toHaveClass(/selected/)
  await expect(c1).toHaveClass(/checked/)
  // Comme pour tous les items sélectionnés, la coche est blanche
  await expect(c1.locator('.panel-check')).toHaveCSS('color', 'rgb(255, 255, 255)')
})

// ─── Affichage ───────────────────────────────────────────────────────────────

test("le panneau affiche tous les personnages du projet", async ({ page }) => {
  await openPersoPanel(page)
  await expect(pane1(page).locator('.perso-item')).toHaveCount(4)
})

test("les pseudos sont affichés", async ({ page }) => {
  await openPersoPanel(page)
  await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-item__title')).toHaveText('Cyrano')
  await expect(pane1(page).locator('.perso-item').nth(1).locator('.perso-item__title')).toHaveText('Roxane')
})

test("les badges sont affichés (2 lettres)", async ({ page }) => {
  await openPersoPanel(page)
  await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-item__badge')).toHaveText('CY')
  await expect(pane1(page).locator('.perso-item').nth(1).locator('.perso-item__badge')).toHaveText('RO')
})

test("le premier perso est sélectionné à l'ouverture", async ({ page }) => {
  await openPersoPanel(page)
  await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
})

// ─── Cochés : direct vs hérité ───────────────────────────────────────────────

test("c1 (direct e1) est coché et décochable", async ({ page }) => {
  await openPersoPanel(page)
  await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/checked/)
  await expect(pane1(page).locator('.perso-item').nth(0)).not.toHaveClass(/inherited/)
})

test("c2 (via brin b1) est coché et grisé (hérité)", async ({ page }) => {
  await openPersoPanel(page)
  await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/checked/)
  await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/inherited/)
})

test("c3 et c4 ne sont pas cochés", async ({ page }) => {
  await openPersoPanel(page)
  await expect(pane1(page).locator('.perso-item').nth(2)).not.toHaveClass(/checked/)
  await expect(pane1(page).locator('.perso-item').nth(3)).not.toHaveClass(/checked/)
})

test("Space ne décroche pas un perso hérité (grisé)", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.event-item.selected').press('ArrowDown') // → c2 (inherited)
  await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/inherited/)
  await pane1(page).locator('.event-item.selected').press(' ')
  await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/checked/) // toujours coché
})

test("e2 (sans brins ni persos directs) : aucun perso coché", async ({ page }) => {
  await goToListerEvent(page)
  await pane1(page).locator('.event-item.selected').press('ArrowDown') // e2
  await pane1(page).locator('.event-item.selected').press('p')
  await expect(pane1(page).locator('.perso-item').nth(0)).not.toHaveClass(/checked/)
  await expect(pane1(page).locator('.perso-item').nth(1)).not.toHaveClass(/checked/)
  await expect(pane1(page).locator('.perso-item').nth(2)).not.toHaveClass(/checked/)
  await expect(pane1(page).locator('.perso-item').nth(3)).not.toHaveClass(/checked/)
})

// ─── Navigation ──────────────────────────────────────────────────────────────

test("↓ sélectionne le perso suivant", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.event-item.selected').press('ArrowDown')
  await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/selected/)
})

test("↑ sélectionne le perso précédent", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.event-item.selected').press('ArrowDown')
  await pane1(page).locator('.event-item.selected').press('ArrowUp')
  await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
})

test("↓↑ dans le panneau ne modifient pas la sélection de l'ListerEvent", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.event-item.selected').press('ArrowDown')
  await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
})

// ─── Space (cocher/décocher perso direct) ────────────────────────────────────

test("Space coche un perso non-coché (c3)", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.event-item.selected').press('ArrowDown')
  await pane1(page).locator('.event-item.selected').press('ArrowDown') // → c3
  await expect(pane1(page).locator('.perso-item').nth(2)).not.toHaveClass(/checked/)
  await pane1(page).locator('.event-item.selected').press(' ')
  await expect(pane1(page).locator('.perso-item').nth(2)).toHaveClass(/checked/)
})

test("Space décoche un perso direct coché (c1)", async ({ page }) => {
  await openPersoPanel(page)
  await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/checked/)
  await pane1(page).locator('.event-item.selected').press(' ')
  await expect(pane1(page).locator('.perso-item').nth(0)).not.toHaveClass(/checked/)
})

// ─── Badges persos sur la ligne de l'event ───────────────────────────────────

test("la ligne de e1 affiche le badge de c1 (direct) quand le panneau est ouvert", async ({ page }) => {
  await openPersoPanel(page)
  const eventEl = pane1(page).locator('.event-item').nth(0)
  await expect(eventEl.locator('.event-persos-marks')).toContainText('CY')
})

test("la ligne de e1 affiche le badge de c2 (hérité via brin b1) quand le panneau est ouvert", async ({ page }) => {
  await openPersoPanel(page)
  const eventEl = pane1(page).locator('.event-item').nth(0)
  await expect(eventEl.locator('.event-persos-marks')).toContainText('RO')
})

test("la ligne de e2 n'affiche aucun badge perso", async ({ page }) => {
  await page.goto('/')
  await pane1(page).locator('.event-item.selected').press('ArrowRight')
  const eventEl = pane1(page).locator('.event-item').nth(1)
  await expect(eventEl.locator('.event-persos-marks .perso-mark')).toHaveCount(0)
})

test("cocher c3 depuis le panneau perso de e1 ajoute son avatar sur la ligne de e1", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.event-item.selected').press('ArrowDown')
  await pane1(page).locator('.event-item.selected').press('ArrowDown') // → c3
  await pane1(page).locator('.event-item.selected').press(' ')
  const eventEl = pane1(page).locator('.event-item').nth(0)
  await expect(eventEl.locator('.event-persos-marks')).toContainText('🎭')
})

// ─── Badge et avatar : avatar gagne sur badge ────────────────────────────────

test("la colonne badge affiche l'avatar si disponible, sinon le badge", async ({ page }) => {
  await openPersoPanel(page)
  // c3 a avatar 🎭 ET badge CH → badge circle doit montrer 🎭 (avatar gagne)
  await expect(pane1(page).locator('.perso-item').nth(2).locator('.perso-item__badge')).toHaveText('🎭')
  await expect(pane1(page).locator('.perso-item').nth(3).locator('.perso-item__badge')).toHaveText('👑')
  // c1, c2 sans avatar → badge text
  await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-item__badge')).not.toHaveText('🎭')
})

test("la colonne avatar affiche l'avatar si défini, sinon '—'", async ({ page }) => {
  await openPersoPanel(page)
  // c1, c2 sans avatar → '—'
  await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-item__avatar')).toHaveText('—')
  // c3 avatar 🎭
  await expect(pane1(page).locator('.perso-item').nth(2).locator('.perso-item__avatar')).toHaveText('🎭')
  await expect(pane1(page).locator('.perso-item').nth(3).locator('.perso-item__avatar')).toHaveText('👑')
})

test("si perso assigné à l'event a un avatar, la ligne event affiche l'avatar pas le badge", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.event-item.selected').press('ArrowDown')
  await pane1(page).locator('.event-item.selected').press('ArrowDown') // → c3
  await pane1(page).locator('.event-item.selected').press(' ') // assigner c3 à e1
  const eventEl = pane1(page).locator('.event-item').nth(0)
  await expect(eventEl.locator('.event-persos-marks')).toContainText('🎭')
})

// ─── Unicité des avatars ─────────────────────────────────────────────────────

test("les avatars déjà utilisés ne sont pas proposés lors du choix pour un autre perso", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.event-item.selected').press('Enter') // éditer c1
  await expect(pane1(page).locator('.perso-item.selected input[name="title"]')).toBeFocused()
  await pane1(page).locator('.event-item.selected').press('Tab') // → patronyme
  await pane1(page).locator('.event-item.selected').press('Tab') // → badge
  await pane1(page).locator('.event-item.selected').press('Tab') // → avatar trigger
  await pane1(page).locator('.event-item.selected').press('ArrowDown') // → ouvre popup avatar
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  // 🎭 (c3) et 👑 (c4) ne doivent pas apparaître parmi les options régulières
  const options = pane1(page).locator('.popup-select__option:not(.popup-select__option--custom)')
  await expect(options.filter({ hasText: '🎭' })).toHaveCount(0)
  await expect(options.filter({ hasText: '👑' })).toHaveCount(0)
})

// ─── Création ────────────────────────────────────────────────────────────────

test("n ouvre l'éditeur pour un nouveau perso (input title focalisé)", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.event-item.selected').press('n')
  await expect(pane1(page).locator('.perso-item.selected input[name="title"]')).toBeFocused()
})

// ─── Badge auto-calcul ───────────────────────────────────────────────────────

test("créer un perso avec patronyme → badge calculé depuis le patronyme", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.perso-item.selected').press('n')
  await pane1(page).locator('.perso-item.selected [data-field="title"]').fill('Jean')
  await pane1(page).locator('.perso-item.selected').press('Tab') // → patronyme
  await pane1(page).locator('.perso-item.selected [data-field="patronyme"]').fill('Valjean')
  // badge vide : laisser auto-calc
  await pane1(page).locator('.perso-item.selected').press('Enter')
  // 'Valjean' sans espaces → 'VA'
  await expect(pane1(page).locator('.perso-item').nth(1).locator('.perso-item__badge')).toHaveText('VA')
})

test("créer un perso sans patronyme → badge calculé depuis le titre", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.perso-item.selected').press('n')
  await pane1(page).locator('.perso-item.selected [data-field="title"]').fill('Cosette')
  // pas de patronyme, badge vide
  await pane1(page).locator('.perso-item.selected').press('Enter')
  await expect(pane1(page).locator('.perso-item').nth(1).locator('.perso-item__badge')).toHaveText('CO')
})

test("badge unique si collision avec un badge existant", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.perso-item.selected').press('n')
  // 'Cyrus' → 'CY' → collision avec c1 → doit être différent
  await pane1(page).locator('.perso-item.selected [data-field="title"]').fill('Cyrus')
  await pane1(page).locator('.perso-item.selected').press('Enter')
  const badgeEl = pane1(page).locator('.perso-item').nth(1).locator('.perso-item__badge')
  await expect(badgeEl).not.toHaveText('CY')
  const badge = await badgeEl.textContent()
  expect(badge.trim().length).toBe(2)
})

test("éditer un perso et vider le badge → recalculé depuis le patronyme", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.perso-item.selected').press('Enter') // édite c1 (title='Cyrano', patronyme='de Bergerac')
  await pane1(page).locator('.perso-item.selected').press('Tab') // → patronyme
  await pane1(page).locator('.perso-item.selected').press('Tab') // → avatar
  await pane1(page).locator('.perso-item.selected').press('Tab') // → badge
  await pane1(page).locator('.perso-item.selected [data-field="badge"]').fill('') // vider
  await pane1(page).locator('.perso-item.selected').press('Enter')
  // patronyme 'de Bergerac' → 'debergerac'.toUpperCase() → 'DE'
  await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-item__badge')).toHaveText('DE')
})

test("modifier le badge d'un perso vers une valeur déjà prise → notification immédiate + badge non modifié", async ({ page }) => {
  await openPersoPanel(page)
  // c1 badge=CY, c2 badge=RO
  await pane1(page).locator('.perso-item.selected').press('Enter') // édite c1
  await pane1(page).locator('.perso-item.selected').press('Tab')   // title → patronyme
  await pane1(page).locator('.perso-item.selected').press('Tab')   // patronyme → avatar
  await pane1(page).locator('.perso-item.selected').press('Tab')   // avatar → badge
  // Taper RO (déjà pris par c2) → notification immédiate, sans Enter
  await pane1(page).locator('.perso-item.selected [data-field="badge"]').fill('RO')
  await expect(pane1(page).locator('.notification')).toBeVisible()
  await expect(pane1(page).locator('.notification')).toContainText(getErr(3010, 'RO'))
  // Valider → badge doit être resté CY
  await pane1(page).locator('.perso-item.selected').press('Enter')
  await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-item__badge')).toHaveText('CY')
})

test("remettre son propre badge après changement temporaire → pas de notification", async ({ page }) => {
  await openPersoPanel(page)
  // c1 badge=CY — on édite c1, change badge, on remet CY
  await pane1(page).locator('.perso-item.selected').press('Enter')
  await pane1(page).locator('.perso-item.selected').press('Tab')   // title → patronyme
  await pane1(page).locator('.perso-item.selected').press('Tab')   // patronyme → avatar
  await pane1(page).locator('.perso-item.selected').press('Tab')   // avatar → badge
  await pane1(page).locator('.perso-item.selected [data-field="badge"]').fill('XX')
  await pane1(page).locator('.perso-item.selected [data-field="badge"]').fill('CY')
  await expect(pane1(page).locator('.notification')).not.toBeVisible()
})

test("créer un perso : Enter valide et l'ajoute à la liste", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.event-item.selected').press('n')
  await pane1(page).locator('.perso-item.selected input[name="title"]').fill('Nouveau perso')
  await pane1(page).locator('.event-item.selected').press('Enter')
  await expect(pane1(page).locator('.perso-item')).toHaveCount(5)
  await expect(pane1(page).locator('.perso-item').nth(1).locator('.perso-item__title')).toHaveText('Nouveau perso')
})

test("créer un perso : Escape annule, liste inchangée", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.event-item.selected').press('n')
  await pane1(page).locator('.event-item.selected').press('Escape')
  await expect(pane1(page).locator('.perso-item')).toHaveCount(4)
})

// ─── Édition ─────────────────────────────────────────────────────────────────

test("Enter édite le perso sélectionné (input title avec valeur courante)", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.event-item.selected').press('Enter')
  const titleInput = pane1(page).locator('.perso-item.selected input[name="title"]')
  await expect(titleInput).toBeFocused()
  await expect(titleInput).toHaveValue('Cyrano')
})

test("Tab en édition cycle : title → patronyme → badge → avatar → fonction", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.event-item.selected').press('Enter')
  await expect(pane1(page).locator('.perso-item.selected input[name="title"]')).toBeFocused()
  await pane1(page).locator('.event-item.selected').press('Tab')
  await expect(pane1(page).locator('.perso-item.selected input[name="patronyme"]')).toBeFocused()
  await pane1(page).locator('.event-item.selected').press('Tab')
  await expect(pane1(page).locator('.perso-item.selected input[name="badge"]')).toBeFocused()
  await pane1(page).locator('.event-item.selected').press('Tab')
  await expect(pane1(page).locator('.perso-item.selected [data-property="avatar"]')).toBeFocused()
  await pane1(page).locator('.event-item.selected').press('Tab')
  await expect(pane1(page).locator('.perso-item.selected [data-property="fonction"]')).toBeFocused()
})

test("édition : modifier le titre puis Enter met à jour l'affichage", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.event-item.selected').press('Enter')
  await pane1(page).locator('.perso-item.selected input[name="title"]').fill('Cyrano de Bergerac')
  await pane1(page).locator('.event-item.selected').press('Enter')
  await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-item__title')).toHaveText('Cyrano de Bergerac')
})

// ─── Persistance ─────────────────────────────────────────────────────────────

test("persistance : perso créé survit au rechargement", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.event-item.selected').press('n')
  await pane1(page).locator('.perso-item.selected input[name="title"]').fill('Perso persisté')
  await pane1(page).locator('.event-item.selected').press('Enter')
  await page.waitForLoadState('networkidle')
  await page.reload()
  await goToListerEvent(page)
  await pane1(page).locator('.event-item.selected').press('p')
  await expect(pane1(page).locator('.perso-item')).toHaveCount(5)
  await expect(pane1(page).locator('.perso-item').nth(1).locator('.perso-item__title')).toHaveText('Perso persisté')
})

test("persistance : cochage direct survit au rechargement", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.event-item.selected').press('ArrowDown')
  await pane1(page).locator('.event-item.selected').press('ArrowDown') // → c3
  await pane1(page).locator('.event-item.selected').press(' ')
  await page.waitForLoadState('networkidle')
  await page.reload()
  await goToListerEvent(page)
  await pane1(page).locator('.event-item.selected').press('p')
  await expect(pane1(page).locator('.perso-item').nth(2)).toHaveClass(/checked/)
})

// ─── Sélection après création ─────────────────────────────────────────────────

test("après création (Enter), le nouveau perso est sélectionné", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.event-item.selected').press('n')
  await pane1(page).locator('.perso-item.selected input[name="title"]').fill('Nouveau')
  await pane1(page).locator('.event-item.selected').press('Enter')
  await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/selected/)
})

// ─── Sélection après édition ──────────────────────────────────────────────────

test("après édition (Enter), le perso modifié reste sélectionné", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.event-item.selected').press('Enter') // édite c1
  await pane1(page).locator('.perso-item.selected input[name="title"]').fill('Cyrano modifié')
  await pane1(page).locator('.event-item.selected').press('Enter')
  await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
})

// ─── Sélection à la réouverture ───────────────────────────────────────────────

test("réouverture : le premier perso est sélectionné", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.event-item.selected').press('Escape')
  await expect(pane1(page).locator('#persos-panel')).not.toBeVisible()
  await pane1(page).locator('.event-item.selected').press('p')
  await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
})

test("réouverture : ↓ change bien la sélection", async ({ page }) => {
  await openPersoPanel(page)
  await pane1(page).locator('.event-item.selected').press('Escape')
  await pane1(page).locator('.event-item.selected').press('p')
  await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  await pane1(page).locator('.event-item.selected').press('ArrowDown')
  await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/selected/)
  await expect(pane1(page).locator('.perso-item').nth(0)).not.toHaveClass(/selected/)
})
