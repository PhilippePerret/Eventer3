// Origine : tests/specs/e2e/item/edition-tab-nav.spec.js
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

// Après sélection dans un popup-select (state, meteo…),
// Tab doit aller au champ SUIVANT, pas revenir au title.

test.describe('Tab navigation en mode édition', () => {

  test.beforeEach(() => installFixtures('deep-events'))

  test('Tab après sélection popup-select va au champ suivant, pas au title', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('#projects-panel').waitFor()
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('.event-item').first()).toBeVisible()

    // Entrer en édition
    await press(page, 'Enter')
    await expect(pane1(page).locator('[contenteditable][data-field="title"]')).toBeFocused()

    // Tab → state button
    await press(page, 'Tab')
    await expect(pane1(page).locator('.display-select[data-field="state"]')).toBeFocused()

    // Ouvrir popup state + sélectionner première option
    await press(page, 'ArrowDown')
    await expect(pane1(page).locator('.popup-select')).toBeVisible()
    await press(page, 'Enter')

    // state button doit rester focused (pas le title)
    await expect(pane1(page).locator('.display-select[data-field="state"]')).toBeFocused()

    // Tab → meteo button (pas state de nouveau)
    await press(page, 'Tab')
    await expect(pane1(page).locator('.display-select[data-field="meteo"]')).toBeFocused()
  })

})
