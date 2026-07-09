// Origine : tests/specs/e2e/_tdd/keyboard-b-title-editing.spec.js
import { test, expect, pane1, press } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'

test.describe("TextEdit — touche 'b' pendant édition du titre", () => {

  test.beforeEach(() => installFixtures('with-brins-and-persos'))

  test("'b' pendant édition du titre event : écrit 'b' dans le champ, n'ouvre pas #brins-panel", async ({ page }) => {
    await page.goto('/')
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('.event-item').first()).toBeVisible()
    await press(page, 'Enter')
    const field = pane1(page).locator('.event-item.editing [data-field="title"]')
    await expect(field).toBeFocused()
    await field.fill('')

    await press(page, 'b')

    await expect(field).toHaveText('b')
    await expect(pane1(page).locator('#brins-panel')).not.toBeVisible()
  })

})
