import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1 } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

async function goToListerEvent(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await pane1(page).locator('.project-item.selected').press('ArrowRight').press('ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
}

test("un event sans état affiche '—' (valeur neutre)", async ({ page }) => {
  await goToListerEvent(page)
  const stateEl = pane1(page).locator('.event-item').nth(0).locator('.event-state')
  await expect(stateEl).toHaveText('—')
})

test("un event avec état affiche sa pastille", async ({ page }) => {
  await goToListerEvent(page)
  // On met le premier event en état "ébauche" via Tab+Enter en édition
  await pane1(page).locator('.event-item.selected').press('Enter')
  await expect(pane1(page).locator('.event-item.selected input[name="title"]')).toBeFocused()
  await pane1(page).locator('.event-item.selected').press('Tab')
  const trigger = pane1(page).locator('.event-item.selected [data-field-name="state"]')
  await expect(trigger).toBeFocused()
  await pane1(page).locator('.event-item.selected').press('ArrowDown')
  // L'option "ébauche" est la 2e (index 1), ↓ pour la sélectionner
  await pane1(page).locator('.event-item.selected').press('ArrowDown')
  await pane1(page).locator('.event-item.selected').press('Enter')
  // Confirmer l'édition
  await pane1(page).locator('.event-item.selected').press('Enter')
  const stateEl = pane1(page).locator('.event-item').nth(0).locator('.event-state')
  await expect(stateEl).toBeVisible()
  await expect(stateEl).toHaveText('ébauche')
})
