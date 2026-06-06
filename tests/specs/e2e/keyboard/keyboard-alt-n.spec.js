import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect } from '../__setup__.js'

// Simule le vrai ⌥n Mac US : event.key = '˜' (dead tilde), event.code = 'KeyN'
async function pressAltNMac(page) {
  await page.evaluate(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: '˜', code: 'KeyN', altKey: true, bubbles: true, cancelable: true
    }))
  })
}

test.describe('Alt+n dans la liste des projets', () => {
  test.beforeEach(() => installFixtures('many-projects'))

  test("Alt+n crée un nouvel item EN DESSOUS de l'item sélectionné", async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

    const items = page.locator('.project-item')
    await expect(items.nth(0)).toHaveClass(/selected/)

    await page.keyboard.press('Alt+n')

    await expect(items).toHaveCount(4)
    await expect(items.nth(0)).toContainText('Projet A')
    await expect(items.nth(1)).toHaveClass(/selected/)
    await expect(items.nth(1).locator('input[name="title"]')).toBeVisible()
    await expect(items.nth(2)).toContainText('Projet B')
  })

  test("⌥n Mac (key='˜') crée un item EN DESSOUS — comportement clavier réel", async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
    await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)

    await pressAltNMac(page)

    const items = page.locator('.project-item')
    await expect(items).toHaveCount(4)
    await expect(items.nth(1)).toHaveClass(/selected/)
    await expect(items.nth(1).locator('input[name="title"]')).toBeVisible()
  })
})

test.describe("Alt+n dans un EventLister", () => {
  test.beforeEach(() => installFixtures('many-events'))

  test("Alt+n crée un event EN DESSOUS de l'event sélectionné", async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)

    const items = page.locator('.event-item')
    await expect(items.nth(0)).toHaveClass(/selected/)

    await page.keyboard.press('Alt+n')

    await expect(items.nth(0)).toContainText('Évènement un')
    await expect(items.nth(1)).toHaveClass(/selected/)
    await expect(items.nth(1).locator('input[name="title"]')).toBeVisible()
    await expect(items.nth(2)).toContainText('Évènement deux')
  })

  test("⌥n Mac (key='˜') crée un event EN DESSOUS — comportement clavier réel", async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
    await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)

    await pressAltNMac(page)

    const items = page.locator('.event-item')
    await expect(items.nth(0)).toContainText('Évènement un')
    await expect(items.nth(1)).toHaveClass(/selected/)
    await expect(items.nth(1).locator('input[name="title"]')).toBeVisible()
  })
})

test.describe("Alt+n dans un BrinLister", () => {
  test.beforeEach(() => installFixtures('with-brins'))

  test("Alt+n crée un brin EN DESSOUS du brin sélectionné", async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
    await page.keyboard.press('b')
    await expect(page.locator('#brin-panel')).toBeVisible()

    const brins = page.locator('.brin-item')
    await expect(brins.nth(0)).toHaveClass(/selected/)

    await page.keyboard.press('Alt+n')

    await expect(brins.nth(1)).toHaveClass(/selected/)
    await expect(brins.nth(1).locator('input[name="title"]')).toBeVisible()
  })
})
