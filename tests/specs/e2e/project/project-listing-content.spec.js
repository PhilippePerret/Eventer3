import { installFixtures } from '../../../helpers/install-fixtures'
installFixtures('many-projects')

import { test, expect, pane1 } from '../__setup__.js'

test('la liste affiche uniquement les projets actifs', async ({ page }) => {

  await page.goto('/')

  await expect(pane1(page).locator('.project-item')).toHaveCount(3)

  await expect(pane1(page).locator('text=Projet A')).toBeVisible()
  await expect(pane1(page).locator('text=Projet B')).toBeVisible()
  await expect(pane1(page).locator('text=Projet C')).toBeVisible()

  await expect(pane1(page).locator('text=Projet caché')).toHaveCount(0)

})