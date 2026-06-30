// Origine : tests/specs/e2e/apparence/style-panel.spec.js
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1, press } from '../__setup__.js'

test.describe('⌘+↑/↓ déplacement styles', () => {

  test.beforeEach(() => installFixtures('with-styles'))

  async function openStylePanel(page) {
    await page.goto('/')
    await pane1(page).locator('#projects-panel').waitFor()
    await press(page, 'ArrowRight')
    await pane1(page).locator('#events-panel').waitFor()
    await press(page, 's')
    await pane1(page).locator('#style-panel').waitFor()
  }

  test('⌘+↓ déplace le style vers le bas', async ({ page }) => {
    await openStylePanel(page)
    const items = pane1(page).locator('.style-item')
    const name0 = await items.nth(0).getAttribute('data-name')
    const name1 = await items.nth(1).getAttribute('data-name')
    await press(page, 'Meta+ArrowDown')
    await expect(items.nth(0)).toHaveAttribute('data-name', name1)
    await expect(items.nth(1)).toHaveAttribute('data-name', name0)
  })

  test('⌘+↑ déplace le style vers le haut', async ({ page }) => {
    await openStylePanel(page)
    const items = pane1(page).locator('.style-item')
    const name0 = await items.nth(0).getAttribute('data-name')
    const name1 = await items.nth(1).getAttribute('data-name')
    await press(page, 'ArrowDown')
    await press(page, 'Meta+ArrowUp')
    await expect(items.nth(0)).toHaveAttribute('data-name', name1)
    await expect(items.nth(1)).toHaveAttribute('data-name', name0)
  })

  test("l'ordre après ⌘+↓ est persisté", async ({ page }) => {
    await openStylePanel(page)
    const items = pane1(page).locator('.style-item')
    const name0 = await items.nth(0).getAttribute('data-name')
    const name1 = await items.nth(1).getAttribute('data-name')
    await press(page, 'Meta+ArrowDown')
    await expect(items.nth(0)).toHaveAttribute('data-name', name1)
    await expect(items.nth(1)).toHaveAttribute('data-name', name0)
    await page.waitForTimeout(500)
    await page.reload()
    await openStylePanel(page)
    await expect(items.nth(0)).toHaveAttribute('data-name', name1)
    await expect(items.nth(1)).toHaveAttribute('data-name', name0)
  })

  test("l'ordre après ⌘+↑ est persisté", async ({ page }) => {
    await openStylePanel(page)
    const items = pane1(page).locator('.style-item')
    const name0 = await items.nth(0).getAttribute('data-name')
    const name1 = await items.nth(1).getAttribute('data-name')
    await press(page, 'ArrowDown')
    await press(page, 'Meta+ArrowUp')
    await expect(items.nth(0)).toHaveAttribute('data-name', name1)
    await expect(items.nth(1)).toHaveAttribute('data-name', name0)
    await page.waitForTimeout(500)
    await page.reload()
    await openStylePanel(page)
    await expect(items.nth(0)).toHaveAttribute('data-name', name1)
    await expect(items.nth(1)).toHaveAttribute('data-name', name0)
  })

})
