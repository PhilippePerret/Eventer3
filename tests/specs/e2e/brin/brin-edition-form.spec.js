// Origine : tests/specs/e2e/brin/brin-edition-form.spec.js
import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1, press } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('with-brins')
})

async function openBrinPanel(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await press(page, 'b')
  await expect(pane1(page).locator('#brins-panel')).toBeVisible()
}

test("en édition, le brin conserve sa classe brin-item", async ({ page }) => {
  await openBrinPanel(page)
  await press(page, 'Enter')
  const editingBrin = pane1(page).locator('.brin-item.selected')
  await expect(editingBrin).toHaveClass(/brin-item/)
  await expect(editingBrin).toHaveClass(/editing/)
})

test("en édition, le badge reste visible et dans son conteneur d'origine", async ({ page }) => {
  await openBrinPanel(page)
  await press(page, 'Enter')
  const badgeInput = pane1(page).locator('.brin-item.selected [data-field="badge"]')
  await expect(badgeInput).toBeVisible()
  await expect(badgeInput).toHaveText('MON')
})

test("en édition, le titre reste dans le flux visuel du brin (pas de saut de ligne)", async ({ page }) => {
  await openBrinPanel(page)
  await press(page, 'Enter')
  const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
  await expect(titleInput).toBeVisible()
  // L'input titre doit être dans le même brin-item que les autres champs
  await expect(pane1(page).locator('.brin-item.selected [data-field="badge"]')).toBeVisible()
  await expect(pane1(page).locator('.brin-item.selected [data-field="type"]')).toBeVisible()
})
