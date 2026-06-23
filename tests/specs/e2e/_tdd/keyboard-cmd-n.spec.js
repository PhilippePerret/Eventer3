// Origine : tests/specs/e2e/keyboard/keyboard-cmd-n.spec.js
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

// Alt+n crée en-dessous (voir keyboard-alt-n.spec.js)
// Cmd+n n'a plus de rôle dans la création d'items

test.describe('Cmd+n dans la liste des projets', () => {
  test.beforeEach(() => installFixtures('many-projects'))

  test("Cmd+n ne crée PAS de nouvel item (c'est Alt+n qui le fait)", async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)

    const items = pane1(page).locator('.project-item')
    const countBefore = await items.count()

    await pane1(page).locator('#main-panel').press('Meta+n')

    // Le nombre d'items ne doit pas avoir changé
    await expect(items).toHaveCount(countBefore)
  })
})

test.describe("Cmd+n dans un EventLister", () => {
  test.beforeEach(() => installFixtures('many-events'))

  test("Cmd+n ne crée PAS de nouvel event (c'est Alt+n qui le fait)", async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    await pane1(page).locator('#main-panel').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)

    const items = pane1(page).locator('.event-item')
    const countBefore = await items.count()

    await pane1(page).locator('#main-panel').press('Meta+n')

    await expect(items).toHaveCount(countBefore)
  })
})
