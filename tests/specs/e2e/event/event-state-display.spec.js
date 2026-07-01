import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

async function goToListerEvent(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await press(page, 'ArrowRight')
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
  await press(page, 'Enter')
  await expect(pane1(page).locator('.event-item.selected input[name="title"]')).toBeFocused()
  await press(page, 'Tab')
  const trigger = pane1(page).locator('.event-item.selected [data-field-name="state"]')
  await expect(trigger).toBeFocused()
  await press(page, 'ArrowDown')
  // L'option "ébauche" est la 2e (index 1), ↓ pour la sélectionner
  await press(page, 'ArrowDown')
  await press(page, 'Enter')
  // Confirmer l'édition
  await press(page, 'Enter')
  const stateEl = pane1(page).locator('.event-item').nth(0).locator('.event-state')
  await expect(stateEl).toBeVisible()
  await expect(stateEl).toHaveText('ébauche')
})
