import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-projects')
})

test("la création d'un nouveau projet génère un identifiant pX automatiquement", async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

  await page.keyboard.press('n')

  const titleInput = page.locator('.project-item.selected input[name="title"]')
  const idInput    = page.locator('.project-item.selected input[name="id"]')

  await expect(titleInput).toBeVisible()
  await expect(idInput).toBeVisible()

  await titleInput.fill('Mon Nouveau Projet')

  // l'id ne se calcule plus à partir du titre — saisie manuelle possible
  await expect(idInput).toHaveValue('')

  await page.keyboard.press('Enter')
  await page.waitForLoadState('networkidle')

  // l'id généré par le serveur commence par p suivi de chiffres
  const newItem = page.locator('.project-item').nth(0)
  await expect(newItem.locator('.project-item__id')).toHaveText(/^p\d+$/)
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

test("persistance : l'identifiant pX survit au rechargement", async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

  await page.keyboard.press('n')
  const titleInput = page.locator('.project-item.selected input[name="title"]')
  await titleInput.fill('Projet Persistant')
  await page.keyboard.press('Enter')
  await page.waitForLoadState('networkidle')

  const idText = await page.locator('.project-item').nth(0).locator('.project-item__id').textContent()
  expect(idText.trim()).toMatch(/^p\d+$/)

  await page.reload()
  await expect(page.locator('.project-item').nth(0).locator('.project-item__id')).toHaveText(idText.trim())
})
