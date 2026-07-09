// Origine: tests/specs/e2e/perso/perso-panel.spec.js
import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

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
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
}

async function openPersoPanel(page) {
  await goToListerEvent(page)
  await press(page, 'p')
  await expect(pane1(page).locator('#persos-panel')).toBeVisible()
}

// ─── Ouverture / fermeture ───────────────────────────────────────────────────

test("p ouvre le panneau des personnages depuis ListerEvent", async ({ page }) => {
  await goToListerEvent(page)
  await press(page, 'p')
  await expect(pane1(page).locator('#persos-panel')).toBeVisible()
})

test("l'ListerEvent reste visible en fond pendant que le panneau est ouvert", async ({ page }) => {
  await openPersoPanel(page)
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
})

test("p ferme le panneau des persos quand il est actif", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'p')
  await expect(pane1(page).locator('#persos-panel')).not.toBeVisible()
})

test("Cmd+Enter ferme le panneau perso", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'Meta+Enter')
  await expect(pane1(page).locator('#persos-panel')).not.toBeVisible()
})

test("après fermeture, l'ListerEvent redevient actif (↓ change la sélection d'event)", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'Meta+Enter')
  await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  await press(page, 'ArrowDown')
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
  await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-title')).toHaveText('Cyrano')
  await expect(pane1(page).locator('.perso-item').nth(1).locator('.perso-title')).toHaveText('Roxane')
})

test("les badges sont affichés (2 lettres)", async ({ page }) => {
  await openPersoPanel(page)
  await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-badge')).toHaveText('CY')
  await expect(pane1(page).locator('.perso-item').nth(1).locator('.perso-badge')).toHaveText('RO')
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
  await press(page, 'ArrowDown') // → c2 (inherited)
  await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/inherited/)
  await press(page, ' ')
  await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/checked/) // toujours coché
})

test("e2 (sans brins ni persos directs) : aucun perso coché", async ({ page }) => {
  await goToListerEvent(page)
  await press(page, 'ArrowDown') // e2
  await press(page, 'p')
  await expect(pane1(page).locator('.perso-item').nth(0)).not.toHaveClass(/checked/)
  await expect(pane1(page).locator('.perso-item').nth(1)).not.toHaveClass(/checked/)
  await expect(pane1(page).locator('.perso-item').nth(2)).not.toHaveClass(/checked/)
  await expect(pane1(page).locator('.perso-item').nth(3)).not.toHaveClass(/checked/)
})

// ─── Navigation ──────────────────────────────────────────────────────────────

test("↓ sélectionne le perso suivant", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/selected/)
})

test("↑ sélectionne le perso précédent", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'ArrowDown')
  await press(page, 'ArrowUp')
  await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
})

test("↓↑ dans le panneau ne modifient pas la sélection de l'ListerEvent", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
})

// ─── Space (cocher/décocher perso direct) ────────────────────────────────────

test("Space coche un perso non-coché (c3)", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'ArrowDown')
  await press(page, 'ArrowDown') // → c3
  await expect(pane1(page).locator('.perso-item').nth(2)).not.toHaveClass(/checked/)
  await press(page, ' ')
  await expect(pane1(page).locator('.perso-item').nth(2)).toHaveClass(/checked/)
})

test("Space décoche un perso direct coché (c1)", async ({ page }) => {
  await openPersoPanel(page)
  await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/checked/)
  await press(page, ' ')
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
  await goToListerEvent(page)
  const eventEl = pane1(page).locator('.event-item').nth(1)
  await expect(eventEl.locator('.event-persos-marks .perso-mark')).toHaveCount(0)
})

test("cocher c3 depuis le panneau perso de e1 ajoute son avatar sur la ligne de e1", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'ArrowDown')
  await press(page, 'ArrowDown') // → c3
  await press(page, ' ')
  const eventEl = pane1(page).locator('.event-item').nth(0)
  await expect(eventEl.locator('.event-persos-marks')).toContainText('🎭')
})

// ─── Badge et avatar : avatar gagne sur badge ────────────────────────────────

test("la colonne badge affiche l'avatar si disponible, sinon le badge", async ({ page }) => {
  await openPersoPanel(page)
  // c3 a avatar 🎭 ET badge CH → badge circle doit montrer 🎭 (avatar gagne)
  await expect(pane1(page).locator('.perso-item').nth(2).locator('.perso-badge')).toHaveText('🎭')
  await expect(pane1(page).locator('.perso-item').nth(3).locator('.perso-badge')).toHaveText('👑')
  // c1, c2 sans avatar → badge text
  await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-badge')).not.toHaveText('🎭')
})

test("la colonne avatar affiche l'avatar si défini, sinon '🫥'", async ({ page }) => {
  await openPersoPanel(page)
  // c1, c2 sans avatar → '🫥'
  await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-avatar')).toHaveText('🫥')
  // c3 avatar 🎭
  await expect(pane1(page).locator('.perso-item').nth(2).locator('.perso-avatar')).toHaveText('🎭')
  await expect(pane1(page).locator('.perso-item').nth(3).locator('.perso-avatar')).toHaveText('👑')
})

test("si perso assigné à l'event a un avatar, la ligne event affiche l'avatar pas le badge", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'ArrowDown')
  await press(page, 'ArrowDown') // → c3
  await press(page, ' ') // assigner c3 à e1
  const eventEl = pane1(page).locator('.event-item').nth(0)
  await expect(eventEl.locator('.event-persos-marks')).toContainText('🎭')
})

// ─── Unicité des avatars ─────────────────────────────────────────────────────

test("les avatars déjà utilisés ne sont pas proposés lors du choix pour un autre perso", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'Enter') // éditer c1
  await expect(pane1(page).locator('.perso-item.selected [data-field="title"]')).toBeFocused()
  await press(page, 'Tab') // → patronyme
  await press(page, 'Tab') // → avatar trigger
  await press(page, 'ArrowDown') // → ouvre popup avatar
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  // 🎭 (c3) et 👑 (c4) ne doivent pas apparaître parmi les options régulières
  const options = pane1(page).locator('.popup-select__option:not(.popup-select__option--custom)')
  await expect(options.filter({ hasText: '🎭' })).toHaveCount(0)
  await expect(options.filter({ hasText: '👑' })).toHaveCount(0)
})

// ─── Création ────────────────────────────────────────────────────────────────

test("n ouvre l'éditeur pour un nouveau perso (input title focalisé)", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'n')
  await expect(pane1(page).locator('.perso-item.selected [data-field="title"]')).toBeFocused()
})

// ─── Badge auto-calcul ───────────────────────────────────────────────────────

test("créer un perso avec patronyme → badge calculé depuis le patronyme", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'n')
  await pane1(page).locator('.perso-item.selected [data-field="title"]').fill('Jean')
  await press(page, 'Tab') // → patronyme
  await pane1(page).locator('.perso-item.selected [data-field="patronyme"]').fill('Valjean')
  // badge vide : laisser auto-calc
  await press(page, 'Enter')
  // 'Valjean' → premier essai 'VA' pris par c4 (Valvert) → 'AA'
  await expect(pane1(page).locator('.perso-item').nth(1).locator('.perso-badge')).toHaveText('AA')
})

test("créer un perso sans patronyme → badge calculé depuis le titre", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'n')
  await pane1(page).locator('.perso-item.selected [data-field="title"]').fill('Cosette')
  // pas de patronyme, badge vide
  await press(page, 'Enter')
  await expect(pane1(page).locator('.perso-item').nth(1).locator('.perso-badge')).toHaveText('CO')
})

test("badge unique si collision avec un badge existant", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'n')
  // 'Cyrus' → 'CY' → collision avec c1 → doit être différent
  await pane1(page).locator('.perso-item.selected [data-field="title"]').fill('Cyrus')
  await press(page, 'Enter')
  const badgeEl = pane1(page).locator('.perso-item').nth(1).locator('.perso-badge')
  await expect(badgeEl).not.toHaveText('CY')
  const badge = await badgeEl.textContent()
  expect(badge.trim().length).toBe(2)
})

test("éditer un perso et vider le badge → recalculé depuis le patronyme", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'Enter') // édite c1 (title='Cyrano', patronyme='de Bergerac')
  await press(page, 'Tab') // → patronyme
  await press(page, 'Tab') // → avatar
  await press(page, 'Tab') // → badge
  await pane1(page).locator('.perso-item.selected [data-field="badge"]').fill('') // vider
  await press(page, 'Enter')
  // patronyme 'de Bergerac' → 'DE BERGERAC' → word1='DE' word2='BERGERAC' → D+B='DB' (CY libéré, pris={RO,CH,VA})
  await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-badge')).toHaveText('DB')
})

test("modifier le badge d'un perso vers une valeur déjà prise → notification immédiate + badge non modifié", async ({ page }) => {
  await openPersoPanel(page)
  // c1 badge=CY, c2 badge=RO
  await press(page, 'Enter') // édite c1
  await press(page, 'Tab')   // title → patronyme
  await press(page, 'Tab')   // patronyme → avatar
  await press(page, 'Tab')   // avatar → badge
  // Taper RO (déjà pris par c2) → notification immédiate, sans Enter
  await pane1(page).locator('.perso-item.selected [data-field="badge"]').fill('RO')
  await expect(pane1(page).locator('.notification')).toBeVisible()
  await expect(pane1(page).locator('.notification')).toContainText(getErr(3010, 'RO'))
  // Valider → badge doit être resté CY
  await press(page, 'Enter')
  await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-badge')).toHaveText('CY')
})

test("remettre son propre badge après changement temporaire → pas de notification", async ({ page }) => {
  await openPersoPanel(page)
  // c1 badge=CY — on édite c1, change badge, on remet CY
  await press(page, 'Enter')
  await press(page, 'Tab')   // title → patronyme
  await press(page, 'Tab')   // patronyme → avatar
  await press(page, 'Tab')   // avatar → badge
  await pane1(page).locator('.perso-item.selected [data-field="badge"]').fill('XX')
  await pane1(page).locator('.perso-item.selected [data-field="badge"]').fill('CY')
  await expect(pane1(page).locator('.notification')).not.toBeVisible()
})

test("créer un perso : Enter valide et l'ajoute à la liste", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'n')
  await pane1(page).locator('.perso-item.selected [data-field="title"]').fill('Nouveau perso')
  await press(page, 'Enter')
  await expect(pane1(page).locator('.perso-item')).toHaveCount(5)
  await expect(pane1(page).locator('.perso-item').nth(1).locator('.perso-title')).toHaveText('Nouveau perso')
})

test("créer un perso : Escape annule, liste inchangée", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'n')
  await press(page, 'Escape')
  await expect(pane1(page).locator('.perso-item')).toHaveCount(4)
})

// ─── Édition ─────────────────────────────────────────────────────────────────

test("Enter édite le perso sélectionné (input title avec valeur courante)", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'Enter')
  const titleInput = pane1(page).locator('.perso-item.selected [data-field="title"]')
  await expect(titleInput).toBeFocused()
  await expect(titleInput).toHaveText('Cyrano')
})

test("Tab en édition cycle : title → patronyme → avatar → badge → type → fonction", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'Enter')
  await expect(pane1(page).locator('.perso-item.selected [data-field="title"]')).toBeFocused()
  await press(page, 'Tab')
  await expect(pane1(page).locator('.perso-item.selected [data-field="patronyme"]')).toBeFocused()
  await press(page, 'Tab')
  await expect(pane1(page).locator('.perso-item.selected [data-field="avatar"]')).toBeFocused()
  await press(page, 'Tab')
  await expect(pane1(page).locator('.perso-item.selected [data-field="badge"]')).toBeFocused()
  await press(page, 'Tab')
  await expect(pane1(page).locator('.perso-item.selected [data-field="type"]')).toBeFocused()
  await press(page, 'Tab')
  await expect(pane1(page).locator('.perso-item.selected [data-field="fonction"]')).toBeFocused()
})

test("édition : modifier le titre puis Enter met à jour l'affichage", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'Enter')
  await pane1(page).locator('.perso-item.selected [data-field="title"]').fill('Cyrano de Bergerac')
  await press(page, 'Enter')
  await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-title')).toHaveText('Cyrano de Bergerac')
})

// ─── Persistance ─────────────────────────────────────────────────────────────

test("persistance : perso créé survit au rechargement", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'n')
  await pane1(page).locator('.perso-item.selected [data-field="title"]').fill('Perso persisté')
  await press(page, 'Enter')
  await page.waitForLoadState('networkidle')
  await page.reload()
  await goToListerEvent(page)
  await press(page, 'p')
  await expect(pane1(page).locator('.perso-item')).toHaveCount(5)
  await expect(pane1(page).locator('.perso-item').filter({ hasText: 'Perso persisté' }).locator('.perso-title')).toHaveText('Perso persisté')
})

test("persistance : cochage direct survit au rechargement", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'ArrowDown')
  await press(page, 'ArrowDown') // → c3
  await press(page, ' ')
  await page.waitForLoadState('networkidle')
  await page.reload()
  await goToListerEvent(page)
  await press(page, 'p')
  await expect(pane1(page).locator('.perso-item').nth(2)).toHaveClass(/checked/)
})

// ─── Sélection après création ─────────────────────────────────────────────────

test("après création (Enter), le nouveau perso est sélectionné", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'n')
  await pane1(page).locator('.perso-item.selected [data-field="title"]').fill('Nouveau')
  await press(page, 'Enter')
  await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/selected/)
})

// ─── Sélection après édition ──────────────────────────────────────────────────

test("après édition (Enter), le perso modifié reste sélectionné", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'Enter') // édite c1
  await pane1(page).locator('.perso-item.selected [data-field="title"]').fill('Cyrano modifié')
  await press(page, 'Enter')
  await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
})

// ─── Sélection à la réouverture ───────────────────────────────────────────────

test("réouverture : le premier perso est sélectionné", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'Meta+Enter')
  await expect(pane1(page).locator('#persos-panel')).not.toBeVisible()
  await press(page, 'p')
  await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
})

test("réouverture : ↓ change bien la sélection", async ({ page }) => {
  await openPersoPanel(page)
  await press(page, 'Meta+Enter')
  await press(page, 'p')
  await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/selected/)
  await expect(pane1(page).locator('.perso-item').nth(0)).not.toHaveClass(/selected/)
})
