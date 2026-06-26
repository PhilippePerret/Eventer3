// Origine : tests/specs/e2e/project/new-project-under-selection.spec.js
import { installFixtures } from '../../../helpers/install-fixtures'
import { setupProjectFolder, createAndSelectFolderInPicker } from '../../../helpers/create-project-helper.js'
import { test, expect, pane1 } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-projects')
})

test('la touche n crée un nouveau projet vide en dessous de la sélection', async ({ page }) => {
  await page.goto('/')

  const items = pane1(page).locator('.project-item')

  await expect(items).toHaveCount(3)

  await pane1(page).locator('.project-item.selected').press('ArrowDown')
  await expect(items.nth(1)).toHaveClass(/selected/)

  const { folderName } = await setupProjectFolder(page)

  await pane1(page).locator('.project-item.selected').press('n')
  await createAndSelectFolderInPicker(page, expect, folderName)
  await page.waitForLoadState('networkidle')

  // Nouveau projet inséré en dessous de la sélection (index 1) → index 2
  await expect(items).toHaveCount(4)
  await expect(items.nth(0)).toContainText('Projet A')
  await expect(items.nth(1)).toContainText('Projet B')
  await expect(items.nth(2)).toHaveClass(/selected/)
  await expect(items.nth(2)).not.toContainText('Projet A')
  await expect(items.nth(2)).not.toContainText('Projet B')
  await expect(items.nth(2)).not.toContainText('Projet C')
})
