import { installFixtures } from '../../../helpers/install-fixtures'
installFixtures('many-projects')
import { test, expect } from '../__setup__.js'

test('la liste des projets possède les bonnes classes CSS', async ({ page }) => {

  await page.goto('/')

  const mainPanel = page.locator('#main-panel')
  const listing = page.locator('#main-panel.project-list').first()
  const item = page.locator('.project-item')
  const title = page.locator('.project-item__title')
  console.log('\n=== TEST CLASSES CSS PROJECT LISTING ===')

  console.log('-> vérification #main-panel.project-list')
  await expect(mainPanel).toHaveClass(/project-list/)

  console.log('-> vérification .project-list')
  await expect(listing).toHaveCount(1)

  console.log('-> vérification .project-item')
  await expect(item).toHaveCount(3)

  console.log('-> vérification .project-item__title')
  await expect(title.nth(0)).toContainText('Projet A')

  console.log('\n=== FIN TEST CLASSES CSS PROJECT LISTING ===\n')

})