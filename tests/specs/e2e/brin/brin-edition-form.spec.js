import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('with-brins')
})

async function openBrinPanel(page) {
  await page.goto('/')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  await page.keyboard.press('b')
  await expect(page.locator('#brin-panel')).toBeVisible()
}

test("en édition, le brin conserve ses classes panel-row et brin-row", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press('Enter')
  const editingBrin = page.locator('.brin-item.selected')
  await expect(editingBrin).toHaveClass(/panel-row/)
  await expect(editingBrin).toHaveClass(/brin-row/)
})

test("en édition, le badge reste visible et dans son conteneur d'origine", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press('Enter')
  const badgeInput = page.locator('.brin-item.selected input[name="badge"]')
  await expect(badgeInput).toBeVisible()
  await expect(badgeInput).toHaveValue('MON')
})

test("en édition, le titre reste dans le flux visuel du brin (pas de saut de ligne)", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press('Enter')
  const titleInput = page.locator('.brin-item.selected input[name="title"]')
  await expect(titleInput).toBeVisible()
  // L'input titre doit être dans le même brin-item que les autres champs
  await expect(page.locator('.brin-item.selected input[name="badge"]')).toBeVisible()
  await expect(page.locator('.brin-item.selected select[data-property="type"]')).toBeVisible()
})
