import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

async function goToListerEvent(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
}

async function startEditing(page) {
  await press(page, 'Enter')
  const input = pane1(page).locator('.event-item.selected [data-field="title"]')
  await expect(input).toBeFocused()
  return input
}

test("Tab puis ArrowDown ouvre le popup de sélection d'état", async ({ page }) => {
  await goToListerEvent(page)

  await startEditing(page)
  await press(page, 'Tab')
  const trigger = pane1(page).locator('.event-item.selected [data-field="state"]')
  await expect(trigger).toBeFocused()

  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()

  await press(page, 'Escape')
  await expect(pane1(page).locator('.popup-select')).not.toBeVisible()
  await expect(trigger).toBeFocused()
})

test("le popup s'ouvre pré-positionné sur la valeur courante", async ({ page }) => {
  await goToListerEvent(page)

  await startEditing(page)
  await press(page, 'Tab')
  await press(page, 'ArrowDown')

  const focused = pane1(page).locator('.popup-select__option.focused')
  await expect(focused).toHaveText('—')
})

test("↑↓ naviguent dans les options du popup", async ({ page }) => {
  await goToListerEvent(page)

  await startEditing(page)
  await press(page, 'Tab')
  await press(page, 'ArrowDown')

  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.popup-select__option.focused')).toHaveText('ébauche')

  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.popup-select__option.focused')).toHaveText('développement')

  await press(page, 'ArrowUp')
  await expect(pane1(page).locator('.popup-select__option.focused')).toHaveText('ébauche')
})

test("Enter sélectionne l'option et ferme le popup", async ({ page }) => {
  await goToListerEvent(page)

  const titleInput = await startEditing(page)
  await press(page, 'Tab')
  await press(page, 'ArrowDown')

  await press(page, 'ArrowDown')  // ébauche
  await press(page, 'Enter')

  await expect(pane1(page).locator('.popup-select')).not.toBeVisible()

  const trigger = pane1(page).locator('.event-item.selected [data-field="state"]')
  await expect(trigger).toHaveText('ébauche')
  await expect(trigger).toBeFocused()
})

test("valider l'édition commit le titre et l'état", async ({ page }) => {
  await goToListerEvent(page)

  const titleInput = await startEditing(page)
  await titleInput.fill('Titre modifié')

  await press(page, 'Tab')
  await press(page, 'ArrowDown')
  await press(page, 'ArrowDown')  // ébauche
  await press(page, 'Enter')

  await press(page, 'Enter')  // commit

  const firstItem = pane1(page).locator('.event-item').nth(0)
  await expect(firstItem).toContainText('Titre modifié')
  await expect(firstItem.locator('.event-state')).toHaveText('ébauche')
})

test("Escape en édition restaure l'état original même si popup a été utilisé", async ({ page }) => {
  await goToListerEvent(page)

  await startEditing(page)
  await press(page, 'Tab')
  await press(page, 'ArrowDown')
  await press(page, 'ArrowDown')  // ébauche
  await press(page, 'Enter')      // sélectionne ébauche

  await press(page, 'Escape')

  const firstItem = pane1(page).locator('.event-item').nth(0)
  await expect(firstItem.locator('.event-state')).toHaveText('—')
})

test("filtrer les options réduit la liste", async ({ page }) => {
  await goToListerEvent(page)

  await startEditing(page)
  await press(page, 'Tab')
  await press(page, 'ArrowDown')

  await pane1(page).locator('.popup-select__search').type('jet')
  await expect(pane1(page).locator('.popup-select__option')).toHaveCount(1)
  await expect(pane1(page).locator('.popup-select__option')).toHaveText('premier jet')
})

test("Enter sur résultat filtré sélectionne et ferme", async ({ page }) => {
  await goToListerEvent(page)

  await startEditing(page)
  await press(page, 'Tab')
  await press(page, 'ArrowDown')

  await pane1(page).locator('.popup-select__search').type('reli')
  await expect(pane1(page).locator('.popup-select__option')).toHaveCount(1)
  await press(page, 'Enter')

  const trigger = pane1(page).locator('.event-item.selected [data-field="state"]')
  await expect(trigger).toHaveText('à relire')
})

test("le menu d'état contient tous les libellés corrects", async ({ page }) => {
  await goToListerEvent(page)

  await startEditing(page)
  await press(page, 'Tab')
  await press(page, 'ArrowDown')

  const options = pane1(page).locator('.popup-select__option')
  await expect(options).toHaveCount(10)
  await expect(options.nth(0)).toHaveText('—')
  await expect(options.nth(1)).toHaveText('ébauche')
  await expect(options.nth(2)).toHaveText('développement')
  await expect(options.nth(3)).toHaveText('premier jet')
  await expect(options.nth(4)).toHaveText('réécriture')
  await expect(options.nth(5)).toHaveText('achèvement')
  await expect(options.nth(6)).toHaveText('à corriger')
  await expect(options.nth(7)).toHaveText('correction')
  await expect(options.nth(8)).toHaveText('à relire')
  await expect(options.nth(9)).toHaveText('achevé')
})

test("choisir un état en édition l'enregistre (persistance après rechargement)", async ({ page }) => {
  await goToListerEvent(page)

  await startEditing(page)
  await press(page, 'Tab')
  await press(page, 'ArrowDown')
  await press(page, 'ArrowDown')  // ébauche
  await press(page, 'Enter')
  await press(page, 'Enter')  // confirme l'édition

  await page.waitForLoadState('networkidle')
  await page.reload()
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()

  await expect(pane1(page).locator('.event-item').nth(0).locator('.event-state')).toHaveText('ébauche')
})
