import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1 } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-projects')
})

test('Escape dans le FilePicker ne crée pas de projet', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()

  const items = pane1(page).locator('.project-item')
  const countBefore = await items.count()

  await pane1(page).locator('.project-item.selected').press('n')
  await expect(pane1(page).locator('.file-picker')).toBeVisible()
  await pane1(page).locator('.project-item.selected').press('Escape')
  await expect(pane1(page).locator('.file-picker')).not.toBeVisible()

  await expect(items).toHaveCount(countBefore)
})

test('la touche Entrée sans titre : l\'éditeur reste visible', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()

  await pane1(page).locator('.project-item.selected').press('n')
  await pane1(page).locator('.project-item.selected').press('Enter')

  await expect(pane1(page).locator('.project-item input[name="title"]')).toBeVisible()
})

test('la touche Entrée sans titre : aucun projet créé', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()

  const items = pane1(page).locator('.project-item')
  const countBefore = await items.count()

  await pane1(page).locator('.project-item.selected').press('n')
  await pane1(page).locator('.project-item.selected').press('Enter')
  await pane1(page).locator('.project-item.selected').press('Escape')

  await expect(items).toHaveCount(countBefore)
})
