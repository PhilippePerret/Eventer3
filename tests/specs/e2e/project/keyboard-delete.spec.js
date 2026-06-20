import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

// ─── PROJETS ───────────────────────────────────────────────────────────────
// many-projects : Projet A (index 0), Projet B (index 1), Projet C (index 2)

test.describe('Delete dans ProjectLister', () => {

  test.beforeEach(() => installFixtures('many-projects'))

  test('Delete supprime le projet sélectionné', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    const items = pane1(page).locator('.project-item')
    const initialCount = await items.count()
    await pane1(page).locator('body').press('Delete')
    await expect(items).toHaveCount(initialCount - 1)
  })

  test('la suppression du projet est persistante (rechargement)', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    const items = pane1(page).locator('.project-item')
    const initialCount = await items.count()
    await pane1(page).locator('body').press('Delete')
    await expect(items).toHaveCount(initialCount - 1)
    await page.waitForLoadState('networkidle')
    await page.reload()
    await expect(items).toHaveCount(initialCount - 1)
  })

  test('l\'aide contextuelle mentionne ⌦ dans le ProjectLister avec plusieurs projets', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    await pane1(page).locator('body').press('Meta+?')
    await expect(pane1(page).locator('.contextual-help')).toContainText('⌦')
    await pane1(page).locator('body').press('Escape')
  })

  test('quand un seul projet reste, le footer ne mentionne plus ⌦', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    const items = pane1(page).locator('.project-item')
    const initialCount = await items.count()
    for (let i = 0; i < initialCount - 1; i++) {
      await pane1(page).locator('body').press('Delete')
      await expect(items).toHaveCount(initialCount - i - 1)
    }
    await expect(items).toHaveCount(1)
    await expect(pane1(page).locator('#shortcuts-footer')).not.toContainText('⌦')
  })

  test('quand un seul projet reste, Delete ne le supprime pas et affiche un message', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    const items = pane1(page).locator('.project-item')
    const initialCount = await items.count()
    for (let i = 0; i < initialCount - 1; i++) {
      await pane1(page).locator('body').press('Delete')
      await expect(items).toHaveCount(initialCount - i - 1)
    }
    await expect(items).toHaveCount(1)
    await pane1(page).locator('body').press('Delete')
    await expect(items).toHaveCount(1)
    await expect(pane1(page).locator('#notification')).toBeVisible()
  })

})