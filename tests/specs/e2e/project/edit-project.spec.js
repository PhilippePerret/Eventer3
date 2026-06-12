import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

// many-events : project-a (index 0, hl:true), project-b (index 1, hl:false)

async function startEditingFirstProject(page) {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('Enter')
  const titleInput = page.locator('.project-item.selected input[name="title"]')
  await expect(titleInput).toBeFocused()
  return titleInput
}

async function startEditingSecondProject(page) {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  const titleInput = page.locator('.project-item.selected input[name="title"]')
  await expect(titleInput).toBeFocused()
  return titleInput
}

// --- Lisibilité en édition ---

test("un projet créé via FilePicker apparaît sélectionné dans la liste", async ({ page }) => {
  // Ce test remplace le test de lisibilité de l'input id, supprimé avec le passage au FilePicker.
  // La création via FilePicker n'expose plus d'input id en ligne.
  const { setupProjectFolder, createAndSelectFolderInPicker } = await import('../../../helpers/create-project-helper.js')

  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

  const { folderName } = await setupProjectFolder(page)
  await page.keyboard.press('n')
  await createAndSelectFolderInPicker(page, expect, folderName)
  await page.waitForLoadState('networkidle')

  const items = page.locator('.project-item')
  const countAfter = await items.count()
  expect(countAfter).toBeGreaterThan(1)
  await expect(items.nth(1)).toHaveClass(/selected/)
})

// --- Hauteur visuelle ---

test("la hauteur du project-item reste identique en édition", async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  const item = page.locator('.project-item.selected')
  const heightBefore = (await item.boundingBox()).height
  await page.keyboard.press('Enter')
  await expect(item.locator('input[name="title"]')).toBeFocused()
  const heightAfter = (await item.boundingBox()).height
  expect(heightAfter).toBe(heightBefore)
})

// --- Projet avec lister (id verrouillé) ---

test("projet avec lister : seul le titre est éditable", async ({ page }) => {
  const titleInput = await startEditingFirstProject(page)
  await expect(titleInput).toBeVisible()

  const idInput = page.locator('.project-item.selected input[name="id"]')
  await expect(idInput).not.toBeVisible()

})

test("projet avec lister : Tab boucle sur le titre (un seul champ)", async ({ page }) => {
  const titleInput = await startEditingFirstProject(page)
  await page.keyboard.press('Tab')
  await expect(titleInput).toBeFocused()
})

test("projet avec lister : Enter valide le nouveau titre", async ({ page }) => {
  const titleInput = await startEditingFirstProject(page)
  await titleInput.fill('Nouveau titre')
  await page.keyboard.press('Enter')

  const firstProject = page.locator('.project-item').nth(0)
  await expect(firstProject.locator('.project-item__title')).toHaveText('Nouveau titre')
})

test("projet avec lister : Escape restaure le titre original", async ({ page }) => {
  const titleInput = await startEditingFirstProject(page)
  await titleInput.fill('Titre temporaire')
  await page.keyboard.press('Escape')

  const firstProject = page.locator('.project-item').nth(0)
  await expect(firstProject.locator('.project-item__title')).toHaveText('Projet A')
})

// --- Projet sans lister (id modifiable) ---

test("projet sans lister : seul le titre est éditable (pas d'input id)", async ({ page }) => {
  const titleInput = await startEditingSecondProject(page)
  await expect(titleInput).toBeVisible()
  await expect(titleInput).toBeFocused()

  const idInput = page.locator('.project-item.selected input[name="id"]')
  await expect(idInput).toHaveCount(0)
})

// --- Persistance ---

test("persistance : le titre modifié (avec lister) survit au rechargement", async ({ page }) => {
  const titleInput = await startEditingFirstProject(page)
  await titleInput.fill('Titre persistant A')
  await page.keyboard.press('Enter')
  await page.waitForLoadState('networkidle')

  await page.reload()
  await expect(page.locator('.project-item').nth(0).locator('.project-item__title')).toHaveText('Titre persistant A')
})

test("persistance : le titre modifié (sans lister) survit au rechargement", async ({ page }) => {
  const titleInput = await startEditingSecondProject(page)
  await titleInput.fill('Titre persistant B')
  await page.keyboard.press('Enter')
  await page.waitForLoadState('networkidle')

  await page.reload()
  await expect(page.locator('.project-item').nth(1).locator('.project-item__title')).toHaveText('Titre persistant B')
})

test("projet sans lister : Escape restaure le titre original", async ({ page }) => {
  const titleInput = await startEditingSecondProject(page)
  await titleInput.fill('Titre temp')
  await page.keyboard.press('Escape')

  const secondProject = page.locator('.project-item').nth(1)
  await expect(secondProject.locator('.project-item__title')).toHaveText('Projet B')
})
