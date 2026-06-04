import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect } from '../__setup__.js'

// ─── EVENTS ────────────────────────────────────────────────────────────────
// many-events : project-a (hl:true, events e1/e2/e3), project-b

test.describe('Delete dans EventLister', () => {

  test.beforeEach(() => installFixtures('many-events'))

  test('Delete supprime l\'event sélectionné dans un EventLister', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
    const items = page.locator('.event-item')
    const initialCount = await items.count()
    await page.keyboard.press('Delete')
    await expect(items).toHaveCount(initialCount - 1)
  })

  test('la suppression de l\'event est persistante (rechargement)', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
    const items = page.locator('.event-item')
    const initialCount = await items.count()
    await page.keyboard.press('Delete')
    await expect(items).toHaveCount(initialCount - 1)
    await page.waitForLoadState('networkidle')
    await page.reload()
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
    await expect(items).toHaveCount(initialCount - 1)
  })

  test('le footer mentionne ⌦ dans un EventLister avec plusieurs events', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
    await expect(page.locator('#shortcuts-footer')).toContainText('⌦')
  })

})
