import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

async function goToEventLister(page) {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
}

async function startEditing(page) {
  await page.keyboard.press('Enter')
  const input = page.locator('.event-item.selected input[name="title"]')
  await expect(input).toBeFocused()  // attendre que le rAF ait focalisé l'input
  return input
}

test("Enter + Tab ouvre le popup de sélection d'état", async ({ page }) => {
  await goToEventLister(page)

  const input = await startEditing(page)
  await page.keyboard.press('Tab')
  const trigger = page.locator('.event-item.selected .popup-select-trigger')
  await expect(trigger).toBeFocused()

  await page.keyboard.press('Enter')
  await expect(page.locator('.popup-select')).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(page.locator('.popup-select')).not.toBeVisible()
  await expect(trigger).toBeFocused()
})

test("Space sur le trigger ouvre aussi le popup", async ({ page }) => {
  await goToEventLister(page)

  await startEditing(page)
  await page.keyboard.press('Tab')
  await page.keyboard.press(' ')
  await expect(page.locator('.popup-select')).toBeVisible()
})

test("le popup s'ouvre pré-positionné sur la valeur courante", async ({ page }) => {
  await goToEventLister(page)

  await startEditing(page)
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')

  const focused = page.locator('.popup-select__option.focused')
  await expect(focused).toHaveText('—')
})

test("↑↓ naviguent dans les options du popup", async ({ page }) => {
  await goToEventLister(page)

  await startEditing(page)
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')

  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.popup-select__option.focused')).toHaveText('ébauche')

  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.popup-select__option.focused')).toHaveText('développement')

  await page.keyboard.press('ArrowUp')
  await expect(page.locator('.popup-select__option.focused')).toHaveText('ébauche')
})

test("Enter sélectionne l'option et ferme le popup", async ({ page }) => {
  await goToEventLister(page)

  const titleInput = await startEditing(page)
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')

  await page.keyboard.press('ArrowDown')  // ébauche
  await page.keyboard.press('Enter')

  await expect(page.locator('.popup-select')).not.toBeVisible()

  const trigger = page.locator('.event-item.selected .popup-select-trigger')
  await expect(trigger).toHaveText('ébauche')
  await expect(titleInput).toBeFocused()
})

test("valider l'édition commit le titre et l'état", async ({ page }) => {
  await goToEventLister(page)

  const titleInput = await startEditing(page)
  await titleInput.fill('Titre modifié')

  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')
  await page.keyboard.press('ArrowDown')  // ébauche
  await page.keyboard.press('Enter')

  await page.keyboard.press('Enter')  // commit

  const firstItem = page.locator('.event-item').nth(0)
  await expect(firstItem).toContainText('Titre modifié')
  await expect(firstItem.locator('.event-state')).toHaveText('ébauche')
})

test("Escape en édition restaure l'état original même si popup a été utilisé", async ({ page }) => {
  await goToEventLister(page)

  await startEditing(page)
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')
  await page.keyboard.press('ArrowDown')  // ébauche
  await page.keyboard.press('Enter')      // sélectionne ébauche

  await page.keyboard.press('Escape')

  const firstItem = page.locator('.event-item').nth(0)
  await expect(firstItem.locator('.event-state')).toHaveText('')
})

test("filtrer les options réduit la liste", async ({ page }) => {
  await goToEventLister(page)

  await startEditing(page)
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')

  await page.locator('.popup-select__search').type('jet')
  await expect(page.locator('.popup-select__option')).toHaveCount(1)
  await expect(page.locator('.popup-select__option')).toHaveText('premier jet')
})

test("Enter sur résultat filtré sélectionne et ferme", async ({ page }) => {
  await goToEventLister(page)

  await startEditing(page)
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')

  await page.locator('.popup-select__search').type('reli')
  await expect(page.locator('.popup-select__option')).toHaveCount(1)
  await page.keyboard.press('Enter')

  const trigger = page.locator('.event-item.selected .popup-select-trigger')
  await expect(trigger).toHaveText('à relire')
})
