// Origine : tests/specs/e2e/event/brin-perso-propagation.spec.js
// Fixture persos-brin-propagation :
//   b1 (B1, perso_ids=[c1]) ; persos c1 (AA), c2 (BB)
//   e1, e2 : brin_ids=[b1]            → marque AA (via brin)
//   e3     : perso_ids=[c1], pas brin → marque AA (DIRECT)
//   e4     : vide                     → aucune marque (témoin)
//
// SPEC (refresh différé) : modifier les persos d'un brin (depuis le panneau brins)
// ne propage aux events qu'à la FERMETURE du panneau brins, et seulement aux events
// qui possèdent ce brin. Un event qui a le perso EN DIRECT (e3) n'est pas affecté.
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1, press, focusInfo, hasFocus } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('persos-brin-propagation')
})

const marks = (page, n) => pane1(page).locator('.event-item').nth(n).locator('.event-persos-marks')

// ── TEST SONDE : vérifier que le bon élément est focusé à chaque étape ──
// (log de la vérité + assertion hasFocus → pas de faux positif possible)
test("focus suit le panneau actif à chaque transition", async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await hasFocus(page, '.project-item.selected')

  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await hasFocus(page, '.event-item.selected')

  await press(page, 'b')
  await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  await hasFocus(page, '.brin-item.selected')

  await press(page, 'p')
  await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  await hasFocus(page, '.perso-item.selected')
})

async function goToBrinPanel(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await press(page, 'b')
  await expect(pane1(page).locator('#brins-panel')).toBeVisible()
}

async function openPersosFromB1(page) {
  await press(page, 'p')
  await expect(pane1(page).locator('#persos-panel')).toBeVisible()
}

async function closePersosThenBrins(page) {
  await press(page, 'p')
  await expect(pane1(page).locator('#persos-panel')).not.toBeVisible()
  await press(page, 'b')
  await expect(pane1(page).locator('#brins-panel')).not.toBeVisible()
}

// retire c1 de b1 (c1 = index 0, sélectionné à l'ouverture)
async function removeC1fromB1(page) {
  await openPersosFromB1(page)
  await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/checked/)
  await press(page, ' ')
  await expect(pane1(page).locator('.perso-item').nth(0)).not.toHaveClass(/checked/)
  await closePersosThenBrins(page)
}

// ── CAS 1 : 2 events possèdent le même brin → modif du brin → les 2 events bougent ──
test("cas 1 — modifier un brin met à jour les DEUX events qui le possèdent", async ({ page }) => {
  await goToBrinPanel(page)
  await expect(marks(page, 0)).toContainText('AA') // e1
  await expect(marks(page, 1)).toContainText('AA') // e2

  await removeC1fromB1(page)

  await expect(marks(page, 0)).not.toContainText('AA') // e1 mis à jour
  await expect(marks(page, 1)).not.toContainText('AA') // e2 mis à jour
})

// ── CAS 2 : ajouter un perso au brin n'apparaît PAS sur un event sans le brin ──
test("cas 2 — ajouter un perso à un brin n'apparaît pas sur les events sans ce brin", async ({ page }) => {
  await goToBrinPanel(page)
  await expect(marks(page, 0)).not.toContainText('BB') // e1
  await expect(marks(page, 3)).not.toContainText('BB') // e4 (sans brin)

  // cocher c2 (index 1) sur b1
  await openPersosFromB1(page)
  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/selected/)
  await press(page, ' ')
  await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/checked/)
  await closePersosThenBrins(page)

  await expect(marks(page, 0)).toContainText('BB')      // e1 (a le brin)
  await expect(marks(page, 1)).toContainText('BB')      // e2 (a le brin)
  await expect(marks(page, 3)).not.toContainText('BB')  // e4 (PAS le brin)
})

// ── CAS 3 : perso sur 3 events (2 via brin, 1 direct) → retiré du brin → 2 perdent, 1 garde ──
test("cas 3 — retirer un perso du brin : les events via brin perdent la marque, l'event direct la garde", async ({ page }) => {
  await goToBrinPanel(page)
  await expect(marks(page, 0)).toContainText('AA') // e1 via brin
  await expect(marks(page, 1)).toContainText('AA') // e2 via brin
  await expect(marks(page, 2)).toContainText('AA') // e3 direct

  await removeC1fromB1(page)

  await expect(marks(page, 0)).not.toContainText('AA') // e1 perd
  await expect(marks(page, 1)).not.toContainText('AA') // e2 perd
  await expect(marks(page, 2)).toContainText('AA')     // e3 GARDE (direct)
})
