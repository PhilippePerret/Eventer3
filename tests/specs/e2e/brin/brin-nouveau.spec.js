// Origine : tests/specs/e2e/brin/brin-nouveau.spec.js
import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1, press } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('with-brins')
})

// fixture with-brins : project-a, events e1/e2, brins b1 (MON) / b2 (AUT, coché)

async function openBrinPanel(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await press(page, 'b')
  await expect(pane1(page).locator('#brins-panel')).toBeVisible()
}

test("nouveau brin : il est sélectionné juste après création", async ({ page }) => {
  await openBrinPanel(page)
  await press(page, 'n')
  const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
  await titleInput.fill('Brin créé')
  await press(page, 'Enter')
  await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/selected/)
})

test("nouveau brin : il s'affiche avec la classe CSS brin-item", async ({ page }) => {
  await openBrinPanel(page)
  await press(page, 'n')
  const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
  await titleInput.fill('Brin CSS')
  await press(page, 'Enter')
  const newBrin = pane1(page).locator('.brin-item').nth(1)
  await expect(newBrin).toHaveClass(/brin-item/)
})

test("en création, l'éditeur de brin a les classes CSS brin-item et editing", async ({ page }) => {
  await openBrinPanel(page)
  await press(page, 'n')
  const editor = pane1(page).locator('.brin-item.selected')
  await expect(editor).toHaveClass(/brin-item/)
  await expect(editor).toHaveClass(/editing/)
})
