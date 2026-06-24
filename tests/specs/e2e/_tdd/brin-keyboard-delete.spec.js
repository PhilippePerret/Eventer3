// Origine : tests/specs/e2e/brin/keyboard-delete.spec.js
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

// ─── BRINS ─────────────────────────────────────────────────────────────────
// with-brins : project-a (hl:true), events e1/e2, brins b1 (MON, non-coché) / b2 (AUT, coché)
// e1 a le brin b2 (AUT) assigné → badge AUT visible dans la ligne de e1

test.describe('Delete dans le panneau des brins', () => {

  test.beforeEach(() => installFixtures('with-brins'))

  async function goToListerEvent(page) {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    await pane1(page).locator('.project-item.selected').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  }

  async function openBrinPanel(page) {
    await goToListerEvent(page)
    await pane1(page).locator('#main-panel').press('b')
    await expect(pane1(page).locator('#brin-panel')).toBeVisible()
  }

  test('Delete supprime le brin sélectionné dans le panneau des brins', async ({ page }) => {
    await openBrinPanel(page)
    const items = pane1(page).locator('.brin-item')
    const initialCount = await items.count()
    // Naviguer sur b2 (AUT, index 1)
    await pane1(page).locator('#main-panel').press('ArrowDown')
    await expect(items.nth(1)).toHaveClass(/selected/)
    await pane1(page).locator('#main-panel').press('Delete')
    await expect(items).toHaveCount(initialCount - 1)
    // Le brin b2 (AUT) ne doit plus être dans la liste
    const titles = pane1(page).locator('.brin-item .brin-title')
    await expect(titles).not.toContainText('Autre brin')
  })

  test('après suppression du brin coché, le badge disparaît de la ligne de l\'event', async ({ page }) => {
    await openBrinPanel(page)
    // Vérifier que le badge AUT est présent dans la ligne de e1 (event sélectionné)
    const eventRow = pane1(page).locator('.event-item.selected')
    await expect(eventRow.locator('.event-brins-marks .panel-mark')).toContainText('AUT')
    // Naviguer sur b2 (AUT) et le supprimer
    await pane1(page).locator('#main-panel').press('ArrowDown')
    await pane1(page).locator('#main-panel').press('Delete')
    // Le badge AUT doit avoir disparu de la ligne de e1
    await expect(eventRow.locator('.event-brins-marks')).not.toContainText('AUT')
  })

  test('la suppression du brin est persistante : liste des brins du projet', async ({ page }) => {
    await openBrinPanel(page)
    await pane1(page).locator('#main-panel').press('ArrowDown')
    await pane1(page).locator('#main-panel').press('Delete')
    await expect(pane1(page).locator('.brin-item')).toHaveCount(1)
    await page.waitForLoadState('networkidle')
    // Rechargement
    await page.reload()
    await goToListerEvent(page)
    await pane1(page).locator('#main-panel').press('b')
    await expect(pane1(page).locator('#brin-panel')).toBeVisible()
    await expect(pane1(page).locator('.brin-item')).toHaveCount(1)
    await expect(pane1(page).locator('.brin-item .brin-title')).not.toContainText('Autre brin')
  })

  test('la suppression du brin est persistante : badge absent de l\'event après rechargement', async ({ page }) => {
    await openBrinPanel(page)
    await pane1(page).locator('#main-panel').press('ArrowDown')
    await pane1(page).locator('#main-panel').press('Delete')
    // Rechargement
    await page.reload()
    await goToListerEvent(page)
    // Le badge AUT ne doit pas apparaître dans e1 même après rechargement
    const eventRow = pane1(page).locator('.event-item.selected')
    await expect(eventRow.locator('.event-brins-marks')).not.toContainText('AUT')
  })

})
