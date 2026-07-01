import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

// ─── EVENTS ────────────────────────────────────────────────────────────────
// many-events : project-a (hl:true, events e1/e2/e3), project-b

test.describe('Delete dans ListerEvent', () => {

  test.beforeEach(() => installFixtures('many-events'))

  test('Delete supprime l\'event sélectionné dans un ListerEvent', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    await press(page, 'ArrowRight')
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    const items = pane1(page).locator('.event-item')
    const initialCount = await items.count()
    await press(page, 'Delete')
    await expect(items).toHaveCount(initialCount - 1)
  })

  test('la suppression de l\'event est persistante (rechargement)', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    await press(page, 'ArrowRight')
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    const items = pane1(page).locator('.event-item')
    const initialCount = await items.count()
    await press(page, 'Delete')
    await expect(items).toHaveCount(initialCount - 1)
    await page.waitForLoadState('networkidle')
    await page.reload()
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    await press(page, 'ArrowRight')
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    await expect(items).toHaveCount(initialCount - 1)
  })

  test('l\'aide contextuelle mentionne ⌦ dans un ListerEvent avec plusieurs events', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    await press(page, 'ArrowRight')
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    await press(page, 'Meta+?')
    await expect(pane1(page).locator('.contextual-help')).toContainText('⌦')
    await press(page, 'Escape')
  })

})
