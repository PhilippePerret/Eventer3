import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

async function openStatePopup(page) {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  await page.keyboard.press('Enter')
  await expect(page.locator('.event-item.selected input[name="title"]')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.locator('.event-item.selected .popup-select-trigger')).toBeFocused()
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.popup-select')).toBeVisible()
}

test("le popup d'état affiche des options visibles (pas un popup vide)", async ({ page }) => {
  await openStatePopup(page)
  await expect(page.locator('.popup-select__option').first()).toBeVisible()
})

test("le popup d'état affiche toutes les options de statut", async ({ page }) => {
  await openStatePopup(page)
  // 10 options : —, ébauche, développement, premier jet, réécriture, achèvement, à corriger, correction, à relire, achevé
  await expect(page.locator('.popup-select__option')).toHaveCount(10)
})

test("la liste des options du popup a une hauteur visible (non nulle)", async ({ page }) => {
  await openStatePopup(page)
  const list = page.locator('.popup-select__list')
  await expect(list).toBeVisible()
  const box = await list.boundingBox()
  expect(box.height).toBeGreaterThan(0)
})
