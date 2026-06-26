import { installFixtures } from '../../../helpers/install-fixtures'
installFixtures('many-projects')
import { test, expect, pane1 } from '../__setup__.js'

test('la liste des projets possède les bonnes classes CSS', async ({ page }) => {

  await page.goto('/')

  const mainPanel = pane1(page).locator('#projects-panel')
  const listing = pane1(page).locator('#projects-panel').first()
  const item = pane1(page).locator('.project-item')
  const title = pane1(page).locator('.project-item__title')

  await expect(mainPanel).toHaveClass(/project-list/)

  await expect(listing).toHaveCount(1)

  await expect(item).toHaveCount(3)

  await expect(title.nth(0)).toContainText('Projet A')


})