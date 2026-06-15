import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('with-styles')
})

async function goToEventLister(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
}

// ─── PopupSelect : currentValue null doit être focused ───────────────────────

test("popup nature projet : option '—' focused quand currentValue est null", async ({ page }) => {
  await goToEventLister(page)
  await page.keyboard.press('t')
  await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  // Nature projet null → ouvre popup → '— (aucun)' doit être focused
  await page.keyboard.press('Enter')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  const focused = pane1(page).locator('.popup-select__option.focused')
  await expect(focused).toContainText('—')
})

test("popup nature évènemencier : option 'défaut' focused quand currentValue est null", async ({ page }) => {
  await goToEventLister(page)
  await page.keyboard.press('t')
  await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  // Sélectionner roman (ArrowUp×2 depuis —)
  await page.keyboard.press('Enter')
  await page.keyboard.press('ArrowUp')   // film/BD
  await page.keyboard.press('ArrowUp')   // roman
  await page.keyboard.press('Enter')
  // Descendre sur Nature évènemencier → ouvre popup → 'défaut' doit être focused (null)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  const focused = pane1(page).locator('.popup-select__option.focused')
  await expect(focused).toContainText('défaut')
})

test("popup nature projet : option 'roman' focused après avoir choisi roman", async ({ page }) => {
  await goToEventLister(page)
  await page.keyboard.press('t')
  // Sélectionner roman (ArrowUp×2 depuis —)
  await page.keyboard.press('Enter')
  await page.keyboard.press('ArrowUp')   // film/BD
  await page.keyboard.press('ArrowUp')   // roman
  await page.keyboard.press('Enter')     // select roman
  // Rouvrir le popup projet → roman doit être focused
  await page.keyboard.press('Enter')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  const focused = pane1(page).locator('.popup-select__option.focused')
  await expect(focused).toContainText('roman')
})
