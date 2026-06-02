import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('with-brins')
})

// fixture with-brins : project-a, events e1/e2, brins b1 (MON) / b2 (AUT, coché)

async function openBrinPanel(page) {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  await page.keyboard.press('b')
  await expect(page.locator('#brin-panel')).toBeVisible()
}

test("nouveau brin : il est sélectionné juste après création", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press('n')
  const titleInput = page.locator('.brin-item.selected input[name="title"]')
  await titleInput.fill('Brin créé')
  await page.keyboard.press('Enter')
  // Le nouveau brin (inséré en tête) doit être sélectionné
  await expect(page.locator('.brin-item').nth(0)).toHaveClass(/selected/)
})

test("nouveau brin : il s'affiche avec les bonnes classes CSS (panel-row brin-row)", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press('n')
  const titleInput = page.locator('.brin-item.selected input[name="title"]')
  await titleInput.fill('Brin CSS')
  await page.keyboard.press('Enter')
  const newBrin = page.locator('.brin-item').nth(0)
  await expect(newBrin).toHaveClass(/panel-row/)
  await expect(newBrin).toHaveClass(/brin-row/)
})

test("en création, l'éditeur de brin a les classes CSS panel-row et brin-row", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press('n')
  const editor = page.locator('.brin-item.selected')
  await expect(editor).toHaveClass(/panel-row/)
  await expect(editor).toHaveClass(/brin-row/)
})

test("nouveau brin : sa couleur est différente de celle du brin précédent", async ({ page }) => {
  await openBrinPanel(page)
  // Récupérer la couleur du dernier brin existant (b2)
  const lastBrin = page.locator('.brin-item').last()
  const lastColor = await lastBrin.locator('input[type="color"]').inputValue()
  // Créer un nouveau brin
  await page.keyboard.press('n')
  await page.locator('.brin-item.selected input[name="title"]').fill('Nouveau brin couleur')
  await page.keyboard.press('Enter')
  // La couleur du nouveau brin doit être différente
  const newBrinColor = await page.locator('.brin-item').nth(0).locator('input[type="color"]').inputValue()
  expect(newBrinColor).not.toBe(lastColor)
})
