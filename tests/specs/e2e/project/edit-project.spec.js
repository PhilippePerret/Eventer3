// Refactorisé — nouvelle architecture (2026-06-20)
import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

// many-events : project-a (index 0), project-b (index 1)

async function startEditingFirstProject(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'Enter')
  const titleInput = pane1(page).locator('.project-item.selected [contenteditable][data-field="title"]')
  await expect(titleInput).toBeFocused()
  return titleInput
}

async function startEditingSecondProject(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowDown')
  await press(page, 'Enter')
  const titleInput = pane1(page).locator('.project-item.selected [contenteditable][data-field="title"]')
  await expect(titleInput).toBeFocused()
  return titleInput
}

// --- Lisibilité en édition ---

test("un projet créé via FilePicker apparaît sélectionné dans la liste", async ({ page }) => {
  // Ce test remplace le test de lisibilité de l'input id, supprimé avec le passage au FilePicker.
  // La création via FilePicker n'expose plus d'input id en ligne.
  const { setupProjectFolder, createAndSelectFolderInPicker } = await import('../../../helpers/create-project-helper.js')

  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()

  const { folderName } = await setupProjectFolder(page)
  await press(page, 'n')
  await createAndSelectFolderInPicker(page, expect, folderName)
  await page.waitForLoadState('networkidle')

  const items = pane1(page).locator('.project-item')
  const countAfter = await items.count()
  expect(countAfter).toBeGreaterThan(1)
  await expect(items.nth(1)).toHaveClass(/selected/)
})

// --- Hauteur visuelle ---

test("la hauteur du project-item reste identique en édition", async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  const item = pane1(page).locator('.project-item.selected')
  const heightBefore = (await item.boundingBox()).height
  await press(page, 'Enter')
  await expect(item.locator('[contenteditable][data-field="title"]')).toBeFocused()
  const heightAfter = (await item.boundingBox()).height
  expect(heightAfter).toBe(heightBefore)
})

// --- Champs éditables ---

test("édition : les champs PROPS sont éditables (title, state, type)", async ({ page }) => {
  const titleInput = await startEditingFirstProject(page)
  await expect(titleInput).toBeVisible()
  await expect(pane1(page).locator('.project-item.selected [data-field="state"]')).toBeVisible()
  await expect(pane1(page).locator('.project-item.selected [data-field="type"]')).toBeVisible()
  await expect(pane1(page).locator('.project-item.selected [data-field="id"]')).toHaveCount(0)
})

test("Tab cycle entre les champs PROPS éditables", async ({ page }) => {
  const titleInput = await startEditingFirstProject(page)
  await press(page, 'Tab')
  await expect(pane1(page).locator('.project-item.selected [data-field="state"]')).toBeFocused()
  await press(page, 'Tab')
  await expect(pane1(page).locator('.project-item.selected [data-field="type"]')).toBeFocused()
  await press(page, 'Tab')
  await expect(titleInput).toBeFocused()
})

test("Enter valide le nouveau titre", async ({ page }) => {
  const titleInput = await startEditingFirstProject(page)
  await titleInput.fill('Nouveau titre')
  await press(page, 'Enter')

  const firstProject = pane1(page).locator('.project-item').nth(0)
  await expect(firstProject.locator('.project-item__title')).toHaveText('Nouveau titre')
})

test("Escape restaure le titre original (premier projet)", async ({ page }) => {
  const titleInput = await startEditingFirstProject(page)
  await titleInput.fill('Titre temporaire')
  await press(page, 'Escape')

  const firstProject = pane1(page).locator('.project-item').nth(0)
  await expect(firstProject.locator('.project-item__title')).toHaveText('Projet A')
})

test("Escape restaure le titre original (second projet)", async ({ page }) => {
  const titleInput = await startEditingSecondProject(page)
  await titleInput.fill('Titre temp')
  await press(page, 'Escape')

  const secondProject = pane1(page).locator('.project-item').nth(1)
  await expect(secondProject.locator('.project-item__title')).toHaveText('Projet B')
})

// --- Persistance ---

test("persistance : le titre modifié survit au rechargement (premier projet)", async ({ page }) => {
  const titleInput = await startEditingFirstProject(page)
  await titleInput.fill('Titre persistant A')
  await press(page, 'Enter')
  await page.waitForLoadState('networkidle')

  await page.reload()
  await expect(pane1(page).locator('.project-item').nth(0).locator('.project-item__title')).toHaveText('Titre persistant A')
})

test("persistance : le titre modifié survit au rechargement (second projet)", async ({ page }) => {
  const titleInput = await startEditingSecondProject(page)
  await titleInput.fill('Titre persistant B')
  await press(page, 'Enter')
  await page.waitForLoadState('networkidle')

  await page.reload()
  await expect(pane1(page).locator('.project-item').nth(1).locator('.project-item__title')).toHaveText('Titre persistant B')
})
