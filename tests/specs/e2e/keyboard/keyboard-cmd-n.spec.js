import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect } from '../__setup__.js'

// Alt+n crée en-dessous (voir keyboard-alt-n.spec.js)
// Cmd+n n'a plus de rôle dans la création d'items

test.describe('Cmd+n dans la liste des projets', () => {
  test.beforeEach(() => installFixtures('many-projects'))

  test("Cmd+n ne crée PAS de nouvel item (c'est Alt+n qui le fait)", async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

    const items = page.locator('.project-item')
    const countBefore = await items.count()

    await page.keyboard.press('Meta+n')

    // Le nombre d'items ne doit pas avoir changé
    await expect(items).toHaveCount(countBefore)
  })
})

test.describe("Cmd+n dans un EventLister", () => {
  test.beforeEach(() => installFixtures('many-events'))

  test("Cmd+n ne crée PAS de nouvel event (c'est Alt+n qui le fait)", async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)

    const items = page.locator('.event-item')
    const countBefore = await items.count()

    await page.keyboard.press('Meta+n')

    await expect(items).toHaveCount(countBefore)
  })
})
