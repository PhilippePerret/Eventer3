import { installFixtures } from '../../helpers/install-fixtures'
import { test, expect } from './__setup__.js'

test.describe('Cmd+n dans la liste des projets', () => {
  test.beforeEach(() => installFixtures('many-projects'))

  test("Cmd+n crée un nouvel item EN DESSOUS de l'item sélectionné", async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

    const items = page.locator('.project-item')
    await expect(items.nth(0)).toHaveClass(/selected/)

    await page.keyboard.press('Meta+n')

    await expect(items).toHaveCount(4)
    await expect(items.nth(0)).toContainText('Projet A')
    await expect(items.nth(1)).toHaveClass(/selected/)
    await expect(items.nth(1).locator('input[name="title"]')).toBeVisible()
    await expect(items.nth(2)).toContainText('Projet B')
  })
})

test.describe("Cmd+n dans un EventLister", () => {
  test.beforeEach(() => installFixtures('many-events'))

  test("Cmd+n crée un event EN DESSOUS de l'event sélectionné", async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)

    const items = page.locator('.event-item')
    await expect(items.nth(0)).toHaveClass(/selected/)

    await page.keyboard.press('Meta+n')

    // Le nouvel event est inséré APRÈS l'event sélectionné (index 1)
    await expect(items.nth(0)).toContainText('Évènement un')
    await expect(items.nth(1)).toHaveClass(/selected/)
    await expect(items.nth(1).locator('input[name="title"]')).toBeVisible()
    await expect(items.nth(2)).toContainText('Évènement deux')
  })
})
