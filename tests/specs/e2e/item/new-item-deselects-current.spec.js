import { installFixtures } from '../../../helpers/install-fixtures'
import { setupProjectFolder, createAndSelectFolderInPicker } from '../../../helpers/create-project-helper.js'
installFixtures('many-projects')

import { test, expect, pane1 } from '../__setup__.js'

test("la touche n désélectionne l'item courant", async ({ page }) => {

  await page.goto('/')

  const items = pane1(page).locator('.project-item')

  console.log('\n=== TEST DÉSÉLECTION À LA TOUCHE n ===')

  console.log('-> vérification état initial : item 0 sélectionné')
  await expect(items.nth(0)).toHaveClass(/selected/)

  const { folderName } = await setupProjectFolder(page)

  console.log('-> appui sur n → FilePicker → sélection dossier')
  await pane1(page).locator('body').press('n')
  await createAndSelectFolderInPicker(page, expect, folderName)
  await page.waitForLoadState('networkidle')

  console.log("-> vérification : item 0 n'est plus sélectionné")
  await expect(items.nth(0)).not.toHaveClass(/selected/)

  console.log('-> vérification : nouvel item est sélectionné')
  await expect(items.nth(1)).toHaveClass(/selected/)

  console.log('\n=== FIN TEST DÉSÉLECTION À LA TOUCHE n ===\n')

})
