import { installFixtures } from '../../../helpers/install-fixtures'
installFixtures('many-projects')

import { test, expect } from '../__setup__.js'

test("la touche n désélectionne l'item courant", async ({ page }) => {

  await page.goto('/')

  const items = page.locator('.project-item')

  console.log('\n=== TEST DÉSÉLECTION À LA TOUCHE n ===')

  console.log('-> vérification état initial : item 0 sélectionné')
  await expect(items.nth(0)).toHaveClass(/selected/)

  console.log('-> appui sur n')
  await page.keyboard.press('n')

  console.log("-> vérification : item 0 n'est plus sélectionné")
  await expect(items.nth(1)).not.toHaveClass(/selected/)

  console.log('\n=== FIN TEST DÉSÉLECTION À LA TOUCHE n ===\n')

})
