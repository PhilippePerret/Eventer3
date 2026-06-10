import { installFixtures } from '../../../helpers/install-fixtures'
import { setupProjectFolder, createAndSelectFolderInPicker, createProjectViaFilePicker } from '../../../helpers/create-project-helper.js'
import { test, expect } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-projects')
})

test("un projet créé via FilePicker a un identifiant valide de forme pN", async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

  const { projectId } = await createProjectViaFilePicker(page, expect)

  expect(projectId).toMatch(/^p\d+$/)
})

test("le titre du nouveau projet correspond au nom du dossier choisi", async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

  const { folderName } = await setupProjectFolder(page, 'mon-nouveau-projet')
  await page.keyboard.press('n')
  await createAndSelectFolderInPicker(page, expect, folderName)
  await page.waitForLoadState('networkidle')

  await expect(page.locator('.project-item').nth(1).locator('.project-item__title')).toHaveText(folderName)
})

test("deux projets créés successivement ont des identifiants différents", async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

  const { projectId: id1 } = await createProjectViaFilePicker(page, expect)
  await page.goto('/')
  const { projectId: id2 } = await createProjectViaFilePicker(page, expect)

  expect(id1).not.toBe(id2)
})

test("persistance : l'identifiant du projet survit au rechargement", async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

  const { projectId } = await createProjectViaFilePicker(page, expect)

  await page.reload()

  const idText = await page.locator('.project-item').nth(1).locator('.project-item__id').textContent()
  expect(idText.trim()).toBe(projectId)
})
