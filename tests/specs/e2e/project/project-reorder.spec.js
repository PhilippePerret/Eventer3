// Origine : tests/specs/e2e/keyboard/keyboard-reorder-items.spec.js
//           tests/specs/e2e/project/project-reorder-persistence.spec.js
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1, press } from '../__setup__.js'

test.describe('⌘+↑/↓ déplacement projets', () => {

  test.beforeEach(() => installFixtures('many-projects'))

  test('⌘+↓ déplace un projet vers le bas', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('#projects-panel').waitFor()
    const items = pane1(page).locator('.project-item')
    await expect(items.nth(0)).toContainText('Projet A')
    await expect(items.nth(1)).toContainText('Projet B')
    await press(page, 'Meta+ArrowDown')
    await expect(items.nth(0)).toContainText('Projet B')
    await expect(items.nth(1)).toContainText('Projet A')
  })

  test('⌘+↑ déplace un projet vers le haut', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('#projects-panel').waitFor()
    const items = pane1(page).locator('.project-item')
    await expect(items.nth(0)).toContainText('Projet A')
    await expect(items.nth(1)).toContainText('Projet B')
    await press(page, 'ArrowDown')
    await press(page, 'Meta+ArrowUp')
    await expect(items.nth(0)).toContainText('Projet B')
    await expect(items.nth(1)).toContainText('Projet A')
  })

  test("l'ordre après ⌘+↓ est persisté", async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('#projects-panel').waitFor()
    const items = pane1(page).locator('.project-item')
    await expect(items.nth(0)).toContainText('Projet A')
    await expect(items.nth(1)).toContainText('Projet B')
    await press(page, 'Meta+ArrowDown')
    await expect(items.nth(0)).toContainText('Projet B')
    await expect(items.nth(1)).toContainText('Projet A')
    await page.waitForTimeout(500)
    await page.reload()
    await pane1(page).locator('#projects-panel').waitFor()
    await expect(items.nth(0)).toContainText('Projet B')
    await expect(items.nth(1)).toContainText('Projet A')
  })

  test("l'ordre après ⌘+↑ est persisté", async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('#projects-panel').waitFor()
    const items = pane1(page).locator('.project-item')
    await expect(items.nth(0)).toContainText('Projet A')
    await expect(items.nth(1)).toContainText('Projet B')
    await press(page, 'ArrowDown')
    await press(page, 'Meta+ArrowUp')
    await expect(items.nth(0)).toContainText('Projet B')
    await expect(items.nth(1)).toContainText('Projet A')
    await page.waitForTimeout(500)
    await page.reload()
    await pane1(page).locator('#projects-panel').waitFor()
    await expect(items.nth(0)).toContainText('Projet B')
    await expect(items.nth(1)).toContainText('Projet A')
  })

  test('plusieurs déplacements sont persistés', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('#projects-panel').waitFor()
    const items = pane1(page).locator('.project-item')
    await expect(items.nth(0)).toContainText('Projet A')
    await expect(items.nth(1)).toContainText('Projet B')
    await expect(items.nth(2)).toContainText('Projet C')
    await press(page, 'Meta+ArrowDown')
    await press(page, 'Meta+ArrowDown')
    await expect(items.nth(0)).toContainText('Projet B')
    await expect(items.nth(1)).toContainText('Projet C')
    await expect(items.nth(2)).toContainText('Projet A')
    await page.waitForTimeout(500)
    await page.reload()
    await pane1(page).locator('#projects-panel').waitFor()
    await expect(items.nth(0)).toContainText('Projet B')
    await expect(items.nth(1)).toContainText('Projet C')
    await expect(items.nth(2)).toContainText('Projet A')
  })

})
