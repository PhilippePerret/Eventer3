import { installFixtures } from '../../../helpers/install-fixtures'
import { setupProjectFolder, createAndSelectFolderInPicker } from '../../../helpers/create-project-helper.js'
installFixtures('many-projects')

import { test, expect, pane1 } from '../__setup__.js'

test("la touche n désélectionne l'item courant", async ({ page }) => {

  await page.goto('/')

  const items = pane1(page).locator('.project-item')


  await expect(items.nth(0)).toHaveClass(/selected/)

  const { folderName } = await setupProjectFolder(page)

  await pane1(page).locator('.event-item.selected').press('n')
  await createAndSelectFolderInPicker(page, expect, folderName)
  await page.waitForLoadState('networkidle')

  await expect(items.nth(0)).not.toHaveClass(/selected/)

  await expect(items.nth(1)).toHaveClass(/selected/)


})
