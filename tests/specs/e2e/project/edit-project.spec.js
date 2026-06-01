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

  // l'id est toujours affiché comme span non-éditable
  const idSpan = page.locator('.project-item.selected .project-item__id')
  await expect(idSpan).toBeVisible()
  await expect(idSpan).toHaveText('project-a')
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
  await expect(firstProject.locator('.project-item__id')).toHaveText('project-a')
})

test("projet avec lister : Escape restaure le titre original", async ({ page }) => {
  const titleInput = await startEditingFirstProject(page)
  await titleInput.fill('Titre temporaire')
  await page.keyboard.press('Escape')

  const firstProject = page.locator('.project-item').nth(0)
  await expect(firstProject.locator('.project-item__title')).toHaveText('Projet A')
})

// --- Projet sans lister (id modifiable) ---

test("projet sans lister : titre ET id sont éditables", async ({ page }) => {
  const titleInput = await startEditingSecondProject(page)
  await expect(titleInput).toBeVisible()

  const idInput = page.locator('.project-item.selected input[name="id"]')
  await expect(idInput).toBeVisible()
  await expect(idInput).toHaveValue('project-b')
})

test("projet sans lister : l'id ne se recalcule pas quand on change le titre", async ({ page }) => {
  const titleInput = await startEditingSecondProject(page)
  const idInput = page.locator('.project-item.selected input[name="id"]')

  await titleInput.fill('Titre complètement différent')
  await expect(idInput).toHaveValue('project-b')
})

test("projet sans lister : Tab passe du titre à l'id puis revient au titre", async ({ page }) => {
  const titleInput = await startEditingSecondProject(page)
  const idInput = page.locator('.project-item.selected input[name="id"]')

  await page.keyboard.press('Tab')
  await expect(idInput).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(titleInput).toBeFocused()
})

test("projet sans lister : Enter valide titre et id modifiés", async ({ page }) => {
  const titleInput = await startEditingSecondProject(page)
  const idInput = page.locator('.project-item.selected input[name="id"]')

  await titleInput.fill('Projet Bêta')
  await page.keyboard.press('Tab')
  await idInput.fill('projet-beta')
  await page.keyboard.press('Enter')

  const secondProject = page.locator('.project-item').nth(1)
  await expect(secondProject.locator('.project-item__title')).toHaveText('Projet Bêta')
  await expect(secondProject.locator('.project-item__id')).toHaveText('projet-beta')
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

test("persistance : l'id modifié (sans lister) survit au rechargement", async ({ page }) => {
  const titleInput = await startEditingSecondProject(page)
  const idInput = page.locator('.project-item.selected input[name="id"]')

  await page.keyboard.press('Tab')
  await idInput.fill('project-beta')
  await page.keyboard.press('Enter')
  await page.waitForLoadState('networkidle')

  await page.reload()

  // le nouvel id doit apparaître
  const items = page.locator('.project-item')
  await expect(items.nth(1).locator('.project-item__id')).toHaveText('project-beta')
  // l'ancien id ne doit plus exister en tant qu'item listé
  await expect(items).toHaveCount(2)
})

test("projet sans lister : Escape restaure titre et id originaux", async ({ page }) => {
  const titleInput = await startEditingSecondProject(page)
  const idInput = page.locator('.project-item.selected input[name="id"]')

  await titleInput.fill('Titre temp')
  await page.keyboard.press('Tab')
  await idInput.fill('id-temp')
  await page.keyboard.press('Escape')

  const secondProject = page.locator('.project-item').nth(1)
  await expect(secondProject.locator('.project-item__title')).toHaveText('Projet B')
  await expect(secondProject.locator('.project-item__id')).toHaveText('project-b')
})
