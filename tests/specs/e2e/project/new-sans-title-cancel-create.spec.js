import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-projects')
})

test('la touche Entrée sans titre affiche une notification', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

  await page.keyboard.press('n')
  await expect(page.locator('.project-item.selected input[name="title"]')).toBeVisible()

  await page.keyboard.press('Enter')

  await expect(page.locator('#notification')).toBeVisible()
  await expect(page.locator('#notification')).toContainText('projet')
})

test('la touche Entrée sans titre : l\'éditeur reste visible', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

  await page.keyboard.press('n')
  await page.keyboard.press('Enter')

  await expect(page.locator('.project-item input[name="title"]')).toBeVisible()
})

test('la touche Entrée sans titre : aucun projet créé', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

  const items = page.locator('.project-item')
  const countBefore = await items.count()

  await page.keyboard.press('n')
  await page.keyboard.press('Enter')
  await page.keyboard.press('Escape')

  await expect(items).toHaveCount(countBefore)
})
