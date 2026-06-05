import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-projects')
})

test("la création d'un nouveau projet calcule l'id depuis le titre", async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

  await page.keyboard.press('n')

  const titleInput = page.locator('.project-item.selected input[name="title"]')
  const idInput    = page.locator('.project-item.selected input[name="id"]')

  await expect(titleInput).toBeVisible()
  await expect(idInput).toBeVisible()

  await titleInput.fill('Mon Nouveau Projet')

  // l'id se calcule automatiquement à partir du titre (slug)
  await expect(idInput).toHaveValue('mon-nouveau-projet')

  await page.keyboard.press('Enter')
  await page.waitForLoadState('networkidle')

  const newItem = page.locator('.project-item').nth(0)
  await expect(newItem.locator('.project-item__id')).toHaveText('mon-nouveau-projet')
})

test("la création d'un nouveau projet permet de définir un identifiant personnalisé", async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

  await page.keyboard.press('n')

  const titleInput = page.locator('.project-item.selected input[name="title"]')
  const idInput    = page.locator('.project-item.selected input[name="id"]')

  await titleInput.fill('Mon Film')
  await page.keyboard.press('Tab')
  await idInput.fill('mon-film')
  await page.keyboard.press('Enter')
  await page.waitForLoadState('networkidle')

  const newItem = page.locator('.project-item').nth(0)
  await expect(newItem.locator('.project-item__id')).toHaveText('mon-film')
})

test("taper le titre calcule l'id en temps réel (slug)", async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('n')
  const titleInput = page.locator('.project-item.selected input[name="title"]')
  const idInput    = page.locator('.project-item.selected input[name="id"]')
  await expect(titleInput).toBeVisible()
  await titleInput.fill('Mon Nouveau Projet')
  await expect(idInput).toHaveValue('mon-nouveau-projet')
})

test("persistance : l'identifiant calculé depuis le titre survit au rechargement", async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

  await page.keyboard.press('n')
  const titleInput = page.locator('.project-item.selected input[name="title"]')
  await titleInput.fill('Projet Persistant')
  await page.keyboard.press('Enter')
  await page.waitForLoadState('networkidle')

  const idText = await page.locator('.project-item').nth(0).locator('.project-item__id').textContent()
  expect(idText.trim()).toBe('projet-persistant')

  await page.reload()
  await expect(page.locator('.project-item').nth(0).locator('.project-item__id')).toHaveText('projet-persistant')
})
