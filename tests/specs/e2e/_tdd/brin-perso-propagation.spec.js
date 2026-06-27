// Fixture with-shared-brin :
//   project-a, events e1/e2, brin b1 (MON, perso_ids=[c2])
//   e1 : brin_ids=["b1"], perso_ids=["c1"]  → marks attendues : CY + RO
//   e2 : brin_ids=["b1"], perso_ids=[]       → marks attendues : RO
//   c1 Cyrano (CY), c2 Roxane (RO)
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('with-shared-brin')
})

async function goToBrinPanel(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await pane1(page).locator('.project-item.selected').press('ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await pane1(page).locator('.event-item.selected').press('b')
  await expect(pane1(page).locator('#brins-panel')).toBeVisible()
}

// ─── Propagation fermeture panneau persos (contexte brin) ────────────────────

test("fermeture panneau persos (depuis brin b1) actualise les marks des events qui le possèdent", async ({ page }) => {
  await goToBrinPanel(page)

  // e1 et e2 affichent RO avant modification
  await expect(pane1(page).locator('.event-item').nth(0).locator('.event-persos-marks')).toContainText('RO')
  await expect(pane1(page).locator('.event-item').nth(1).locator('.event-persos-marks')).toContainText('RO')

  // Ouvrir panneau persos depuis brin b1
  await pane1(page).locator('.brin-item.selected').press('p')
  await expect(pane1(page).locator('#persos-panel')).toBeVisible()

  // c2 (Roxane) est coché (index 1)
  await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/checked/)

  // Naviguer vers c2 et décocher
  await pane1(page).locator('.brin-item.selected').press('ArrowDown')
  await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/selected/)
  await pane1(page).locator('.brin-item.selected').press(' ')
  await expect(pane1(page).locator('.perso-item').nth(1)).not.toHaveClass(/checked/)

  // Fermer → propagation
  await pane1(page).locator('.brin-item.selected').press('p')
  await expect(pane1(page).locator('#persos-panel')).not.toBeVisible()

  // RO disparu des marks des deux events
  await expect(pane1(page).locator('.event-item').nth(0).locator('.event-persos-marks')).not.toContainText('RO')
  await expect(pane1(page).locator('.event-item').nth(1).locator('.event-persos-marks')).not.toContainText('RO')
})
