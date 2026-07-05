//Origine: tests/specs/e2e/ui/popup-select-current-value.spec.js
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('with-styles')
})

async function goToListerEvent(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
}

// ─── PopupSelect : currentValue null doit être focused ───────────────────────

test("popup nature projet : option '—' focused quand currentValue est null", async ({ page }) => {
  await goToListerEvent(page)
  await press(page, 't')
  await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  // Nature projet null → ouvre popup → '— (aucun)' doit être focused
  await press(page, 'Enter')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  const focused = pane1(page).locator('.popup-select__option.focused')
  await expect(focused).toContainText('—')
})

test("popup nature évènemencier : option 'défaut' focused quand currentValue est null", async ({ page }) => {
  await goToListerEvent(page)
  await press(page, 't')
  await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  // Sélectionner roman (ArrowDown depuis — wraps à roman index 0)
  await press(page, 'Enter')
  await press(page, 'ArrowDown')  // wrap depuis — (dernier) → roman (index 0)
  await press(page, 'Enter')
  // Descendre sur Nature évènemencier → ouvre popup → 'défaut' doit être focused (null)
  await press(page, 'ArrowDown')
  await press(page, 'Enter')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  const focused = pane1(page).locator('.popup-select__option.focused')
  await expect(focused).toContainText('défaut')
})

test("popup nature projet : option 'roman' focused après avoir choisi roman", async ({ page }) => {
  await goToListerEvent(page)
  await press(page, 't')
  // Sélectionner roman (ArrowDown depuis — wraps à roman index 0)
  await press(page, 'Enter')
  await press(page, 'ArrowDown')  // wrap depuis — (dernier) → roman (index 0)
  await press(page, 'Enter')     // select roman
  // Rouvrir le popup projet → roman doit être focused
  await press(page, 'Enter')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  const focused = pane1(page).locator('.popup-select__option.focused')
  await expect(focused).toContainText('roman')
})
