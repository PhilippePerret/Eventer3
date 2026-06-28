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
import { test, expect, pane1 } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('persos-brin-propagation')
})

const marks = (page, n) => pane1(page).locator('.event-item').nth(n).locator('.event-persos-marks')

async function goToBrinPanel(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await pane1(page).locator('.project-item.selected').press('ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await pane1(page).locator('.event-item.selected').press('b')
  await expect(pane1(page).locator('#brins-panel')).toBeVisible()
}

async function openPersosFromB1(page) {
  await pane1(page).locator('.brin-item.selected').press('p')
  await expect(pane1(page).locator('#persos-panel')).toBeVisible()
}

async function closePersosThenBrins(page) {
  await pane1(page).locator('.brin-item.selected').press('p')
  await expect(pane1(page).locator('#persos-panel')).not.toBeVisible()
  await pane1(page).locator('.brin-item.selected').press('b')
  await expect(pane1(page).locator('#brins-panel')).not.toBeVisible()
}

// ── CAS 1 + 3 : retirer un perso du brin ────────────────────────────────────
test.only("retirer un perso d'un brin met à jour les events possédant le brin, mais pas l'event qui l'a en direct", async ({ page }) => {
  await goToBrinPanel(page)
  // état initial : AA partout sauf e4
  await expect(marks(page, 0)).toContainText('AA') // e1 (via brin)
  await expect(marks(page, 1)).toContainText('AA') // e2 (via brin)
  await expect(marks(page, 2)).toContainText('AA') // e3 (direct)
  await expect(marks(page, 3)).not.toContainText('AA') // e4

  // décocher c1 (index 0, sélectionné à l'ouverture) sur b1
  await openPersosFromB1(page)
  await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/checked/)
  await pane1(page).locator('.brin-item.selected').press(' ')
  await expect(pane1(page).locator('.perso-item').nth(0)).not.toHaveClass(/checked/)

  await closePersosThenBrins(page)

  // e1, e2 perdent AA (ils ont le brin) ; e3 GARDE AA (direct) ; e4 toujours rien
  await expect(marks(page, 0)).not.toContainText('AA')
  await expect(marks(page, 1)).not.toContainText('AA')
  await expect(marks(page, 2)).toContainText('AA')
  await expect(marks(page, 3)).not.toContainText('AA')
})

// ── CAS 2 : ajouter un perso au brin ne touche pas les events sans le brin ───
test.only("ajouter un perso à un brin n'apparaît que sur les events possédant le brin", async ({ page }) => {
  await goToBrinPanel(page)
  await expect(marks(page, 0)).not.toContainText('BB')
  await expect(marks(page, 1)).not.toContainText('BB')
  await expect(marks(page, 2)).not.toContainText('BB')
  await expect(marks(page, 3)).not.toContainText('BB')

  // cocher c2 (index 1) sur b1
  await openPersosFromB1(page)
  await pane1(page).locator('.brin-item.selected').press('ArrowDown')
  await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/selected/)
  await pane1(page).locator('.brin-item.selected').press(' ')
  await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/checked/)

  await closePersosThenBrins(page)

  // BB apparaît sur e1, e2 (ils ont b1) ; PAS sur e3 ni e4 (pas le brin)
  await expect(marks(page, 0)).toContainText('BB')
  await expect(marks(page, 1)).toContainText('BB')
  await expect(marks(page, 2)).not.toContainText('BB')
  await expect(marks(page, 3)).not.toContainText('BB')
})
