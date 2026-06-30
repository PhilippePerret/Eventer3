// Origine : tests/specs/e2e/event/event-reorder.spec.js
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1, press } from '../__setup__.js'

test.describe('⌘+↑/↓ déplacement events', () => {

  test.beforeEach(() => installFixtures('many-events'))

  test('⌘+↓ déplace un event vers le bas', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('#projects-panel').waitFor()
    await press(page, 'ArrowRight')
    await pane1(page).locator('#events-panel').waitFor()
    const items = pane1(page).locator('.event-item')
    await expect(items.nth(0)).toContainText('Évènement un')
    await expect(items.nth(1)).toContainText('Évènement deux')
    await press(page, 'Meta+ArrowDown')
    await expect(items.nth(0)).toContainText('Évènement deux')
    await expect(items.nth(1)).toContainText('Évènement un')
  })

  test('⌘+↑ déplace un event vers le haut', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('#projects-panel').waitFor()
    await press(page, 'ArrowRight')
    await pane1(page).locator('#events-panel').waitFor()
    const items = pane1(page).locator('.event-item')
    await expect(items.nth(0)).toContainText('Évènement un')
    await expect(items.nth(1)).toContainText('Évènement deux')
    await press(page, 'ArrowDown')
    await press(page, 'Meta+ArrowUp')
    await expect(items.nth(0)).toContainText('Évènement deux')
    await expect(items.nth(1)).toContainText('Évènement un')
  })

  test("l'ordre après ⌘+↓ est persisté", async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('#projects-panel').waitFor()
    await press(page, 'ArrowRight')
    await pane1(page).locator('#events-panel').waitFor()
    const items = pane1(page).locator('.event-item')
    await expect(items.nth(0)).toContainText('Évènement un')
    await expect(items.nth(1)).toContainText('Évènement deux')
    await press(page, 'Meta+ArrowDown')
    await expect(items.nth(0)).toContainText('Évènement deux')
    await expect(items.nth(1)).toContainText('Évènement un')
    await page.waitForTimeout(500)
    await page.reload()
    await pane1(page).locator('#projects-panel').waitFor()
    await press(page, 'ArrowRight')
    await pane1(page).locator('#events-panel').waitFor()
    await expect(items.nth(0)).toContainText('Évènement deux')
    await expect(items.nth(1)).toContainText('Évènement un')
  })

  test("l'ordre après ⌘+↑ est persisté", async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('#projects-panel').waitFor()
    await press(page, 'ArrowRight')
    await pane1(page).locator('#events-panel').waitFor()
    const items = pane1(page).locator('.event-item')
    await expect(items.nth(0)).toContainText('Évènement un')
    await expect(items.nth(1)).toContainText('Évènement deux')
    await press(page, 'ArrowDown')
    await press(page, 'Meta+ArrowUp')
    await expect(items.nth(0)).toContainText('Évènement deux')
    await expect(items.nth(1)).toContainText('Évènement un')
    await page.waitForTimeout(500)
    await page.reload()
    await pane1(page).locator('#projects-panel').waitFor()
    await press(page, 'ArrowRight')
    await pane1(page).locator('#events-panel').waitFor()
    await expect(items.nth(0)).toContainText('Évènement deux')
    await expect(items.nth(1)).toContainText('Évènement un')
  })

})
