import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

// Après sélection dans un popup-select (state, meteo…),
// Tab doit aller au champ SUIVANT, pas revenir au title.

test.describe('Tab navigation en mode édition', () => {

  test.beforeEach(() => installFixtures('deep-events'))

  test('Tab après sélection popup-select va au champ suivant, pas au title', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('.event-item.selected').press('ArrowRight')
    await expect(pane1(page).locator('.event-item').first()).toBeVisible()

    // Entrer en édition
    await pane1(page).locator('.event-item.selected').press('Enter')
    await expect(pane1(page).locator('.event-item.editing .event-text')).toBeFocused()

    // Tab → state button
    await pane1(page).locator('.event-item.selected').press('Tab')
    await expect(pane1(page).locator('.popup-select-trigger[data-field-name="state"]')).toBeFocused()

    // Ouvrir popup state + sélectionner première option
    await pane1(page).locator('.event-item.selected').press('ArrowDown')
    await expect(pane1(page).locator('.popup-select')).toBeVisible()
    await pane1(page).locator('.event-item.selected').press('Enter')

    // state button doit rester focused (pas le title)
    await expect(pane1(page).locator('.popup-select-trigger[data-field-name="state"]')).toBeFocused()

    // Tab → meteo button (pas state de nouveau)
    await pane1(page).locator('.event-item.selected').press('Tab')
    await expect(pane1(page).locator('.popup-select-trigger[data-field-name="meteo"]')).toBeFocused()
  })

})
