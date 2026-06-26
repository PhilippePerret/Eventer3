import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('with-styles')
})

async function goToListerEvent(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await pane1(page).locator('.project-item.selected').press('ArrowRight').press('ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
}

// ─── PopupSelect : currentValue null doit être focused ───────────────────────

test("popup nature projet : option '—' focused quand currentValue est null", async ({ page }) => {
  await goToListerEvent(page)
  await pane1(page).locator('.event-item.selected').press('t')
  await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  // Nature projet null → ouvre popup → '— (aucun)' doit être focused
  await pane1(page).locator('.event-item.selected').press('Enter')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  const focused = pane1(page).locator('.popup-select__option.focused')
  await expect(focused).toContainText('—')
})

test("popup nature évènemencier : option 'défaut' focused quand currentValue est null", async ({ page }) => {
  await goToListerEvent(page)
  await pane1(page).locator('.event-item.selected').press('t')
  await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  // Sélectionner roman (ArrowUp×2 depuis —)
  await pane1(page).locator('.event-item.selected').press('Enter')
  await pane1(page).locator('.event-item.selected').press('ArrowUp')   // film/BD
  await pane1(page).locator('.event-item.selected').press('ArrowUp')   // roman
  await pane1(page).locator('.event-item.selected').press('Enter')
  // Descendre sur Nature évènemencier → ouvre popup → 'défaut' doit être focused (null)
  await pane1(page).locator('.event-item.selected').press('ArrowDown')
  await pane1(page).locator('.event-item.selected').press('Enter')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  const focused = pane1(page).locator('.popup-select__option.focused')
  await expect(focused).toContainText('défaut')
})

test("popup nature projet : option 'roman' focused après avoir choisi roman", async ({ page }) => {
  await goToListerEvent(page)
  await pane1(page).locator('.event-item.selected').press('t')
  // Sélectionner roman (ArrowUp×2 depuis —)
  await pane1(page).locator('.event-item.selected').press('Enter')
  await pane1(page).locator('.event-item.selected').press('ArrowUp')   // film/BD
  await pane1(page).locator('.event-item.selected').press('ArrowUp')   // roman
  await pane1(page).locator('.event-item.selected').press('Enter')     // select roman
  // Rouvrir le popup projet → roman doit être focused
  await pane1(page).locator('.event-item.selected').press('Enter')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  const focused = pane1(page).locator('.popup-select__option.focused')
  await expect(focused).toContainText('roman')
})
