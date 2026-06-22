import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1 } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('with-brins')
})

// fixture with-brins : project-a, events e1/e2, brins b1 (MON) / b2 (AUT, coché)

async function openBrinPanel(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  await pane1(page).locator('#main-panel').press('b')
  await expect(pane1(page).locator('#brin-panel')).toBeVisible()
}

test("nouveau brin : il est sélectionné juste après création", async ({ page }) => {
  await openBrinPanel(page)
  await pane1(page).locator('#main-panel').press('n')
  const titleInput = pane1(page).locator('.brin-item.selected input[name="title"]')
  await titleInput.fill('Brin créé')
  await pane1(page).locator('#main-panel').press('Enter')
  // Le nouveau brin (inséré après le premier) doit être sélectionné
  await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/selected/)
})

test("nouveau brin : il s'affiche avec les bonnes classes CSS (panel-row brin-row)", async ({ page }) => {
  await openBrinPanel(page)
  await pane1(page).locator('#main-panel').press('n')
  const titleInput = pane1(page).locator('.brin-item.selected input[name="title"]')
  await titleInput.fill('Brin CSS')
  await pane1(page).locator('#main-panel').press('Enter')
  const newBrin = pane1(page).locator('.brin-item').nth(1)
  await expect(newBrin).toHaveClass(/panel-row/)
  await expect(newBrin).toHaveClass(/brin-row/)
})

test("en création, l'éditeur de brin a les classes CSS panel-row et brin-row", async ({ page }) => {
  await openBrinPanel(page)
  await pane1(page).locator('#main-panel').press('n')
  const editor = pane1(page).locator('.brin-item.selected')
  await expect(editor).toHaveClass(/panel-row/)
  await expect(editor).toHaveClass(/brin-row/)
})

test("nouveau brin : sa couleur est différente de celle du brin précédent", async ({ page }) => {
  await openBrinPanel(page)
  // Récupérer la couleur du dernier brin existant (b2)
  const lastBrin = pane1(page).locator('.brin-item').last()
  const lastColor = await lastBrin.locator('input[type="color"]').inputValue()
  // Créer un nouveau brin
  await pane1(page).locator('#main-panel').press('n')
  await pane1(page).locator('.brin-item.selected input[name="title"]').fill('Nouveau brin couleur')
  await pane1(page).locator('#main-panel').press('Enter')
  // La couleur du nouveau brin doit être différente
  const newBrinColor = await pane1(page).locator('.brin-item').nth(1).locator('input[type="color"]').inputValue()
  expect(newBrinColor).not.toBe(lastColor)
})
