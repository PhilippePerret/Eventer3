// Origine : tests/specs/e2e/keyboard/keyboard-alt-n.spec.js

import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

// Simule le vrai ⌥n Mac US : event.key = '˜' (dead tilde), event.code = 'KeyN'
async function pressAltNMac(page) {
  const frame = page.frames().find(f => f.url().includes('app-frame'))
  await frame.evaluate(() => {
    const el = document.querySelector('#main-panel') ?? document
    el.dispatchEvent(new KeyboardEvent('keydown', {
      key: '˜', code: 'KeyN', altKey: true, bubbles: true, cancelable: true
    }))
  })
}

test.describe('Alt+n dans la liste des projets', () => {
  test.beforeEach(() => installFixtures('many-projects'))

  test("Alt+n crée un nouvel item AU-DESSUS de l'item sélectionné", async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)

    const items = pane1(page).locator('.project-item')
    await expect(items.nth(0)).toHaveClass(/selected/)

    await pane1(page).locator('#main-panel').press('Alt+n')

    await expect(items).toHaveCount(4)
    await expect(items.nth(1)).toContainText('Projet A')
    await expect(items.nth(0)).toHaveClass(/selected/)
    await expect(items.nth(0).locator('[data-field="title"]')).toBeVisible()
    await expect(items.nth(2)).toContainText('Projet B')
  })

  test("⌥n Mac (key='˜') crée un item AU-DESSUS — comportement clavier réel", async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)

    await pressAltNMac(page)

    const items = pane1(page).locator('.project-item')
    await expect(items).toHaveCount(4)
    await expect(items.nth(0)).toHaveClass(/selected/)
    await expect(items.nth(0).locator('[data-field="title"]')).toBeVisible()
  })
})

test.describe("Alt+n dans un ListerEvent", () => {
  test.beforeEach(() => installFixtures('many-events'))

  test("Alt+n crée un event AU-DESSUS de l'event sélectionné", async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    await pane1(page).locator('.project-item.selected').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)

    const items = pane1(page).locator('.event-item')
    await expect(items.nth(0)).toHaveClass(/selected/)

    await pane1(page).locator('#main-panel').press('Alt+n')

    await expect(items.nth(1)).toContainText('Évènement un')
    await expect(items.nth(0)).toHaveClass(/selected/)
    await expect(items.nth(0).locator('[data-field="title"]')).toBeVisible()
    await expect(items.nth(2)).toContainText('Évènement deux')
  })

  test("⌥n Mac (key='˜') crée un event AU-DESSUS — comportement clavier réel", async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    await pane1(page).locator('.project-item.selected').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)

    await pressAltNMac(page)

    const items = pane1(page).locator('.event-item')
    await expect(items.nth(1)).toContainText('Évènement un')
    await expect(items.nth(0)).toHaveClass(/selected/)
    await expect(items.nth(0).locator('[data-field="title"]')).toBeVisible()
  })
})

test.describe("Alt+n dans un ListerBrin", () => {
  test.beforeEach(() => installFixtures('with-brins'))

  test("Alt+n crée un brin AU-DESSUS du brin sélectionné", async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    await pane1(page).locator('.project-item.selected').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    await pane1(page).locator('#main-panel').press('b')
    await expect(pane1(page).locator('#brin-panel')).toBeVisible()

    const brins = pane1(page).locator('.brin-item')
    await expect(brins.nth(0)).toHaveClass(/selected/)

    await pane1(page).locator('#main-panel').press('Alt+n')

    await expect(brins.nth(0)).toHaveClass(/selected/)
    await expect(brins.nth(0).locator('[data-field="title"]')).toBeVisible()
  })
})
