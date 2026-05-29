import { installFixtures } from '../../../helpers/install-fixtures'
installFixtures('many-projects')

import { test, expect } from '../__setup__.js'

test("la touche → entre dans le Lister de l'item sélectionné", async ({ page }) => {

  await page.goto('/')

  console.log('\n=== TEST ENTRÉE DANS UN LISTER ===')

  console.log('-> vérification état initial : ProjectLister affiché')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

  console.log('-> vérification : premier projet sélectionné')
  await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)

  console.log('-> appui sur →')
  await page.keyboard.press('ArrowRight')

  console.log('-> vérification : on est dans l\'EventLister du projet')
  await expect(page.locator('#main-panel')).not.toHaveClass(/project-list/)
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)

  console.log('\n=== FIN TEST ENTRÉE DANS UN LISTER ===\n')

})
