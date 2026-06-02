import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

async function goToEventLister(page) {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
}

test("un event sans état affiche '—' (valeur neutre)", async ({ page }) => {
  await goToEventLister(page)
  const stateEl = page.locator('.event-item').nth(0).locator('.event-state')
  await expect(stateEl).toHaveText('—')
})

test("un event avec état affiche sa pastille", async ({ page }) => {
  await goToEventLister(page)
  // On met le premier event en état "ébauche" via Tab+Enter en édition
  await page.keyboard.press('Enter')
  await expect(page.locator('.event-item.selected input[name="title"]')).toBeFocused()
  await page.keyboard.press('Tab')
  const trigger = page.locator('.event-item.selected .popup-select-trigger')
  await expect(trigger).toBeFocused()
  await page.keyboard.press('ArrowDown')
  // L'option "ébauche" est la 2e (index 1), ↓ pour la sélectionner
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  // Confirmer l'édition
  await page.keyboard.press('Enter')
  const stateEl = page.locator('.event-item').nth(0).locator('.event-state')
  await expect(stateEl).toBeVisible()
  await expect(stateEl).toHaveText('ébauche')
})
