// Origine : specs/e2e/filter/filter-ux.spec.js
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

// ── Badge FILTRE : couleur selon état ─────────────────────────────

test.describe('badge FILTRE dans la barre d\'état — couleur selon état', () => {
  test.beforeEach(() => { installFixtures('filter-events') })

  async function enterListerEvent(page) {
    await page.goto('/')
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
  }

  test('badge FILTRE vert dès : (filter-bar ouverte)', async ({ page }) => {
    await enterListerEvent(page)
    await press(page, ':')
    await expect(pane1(page).locator('.status-filter-badge--mode')).toBeVisible()
  })

  test('badge FILTRE reste vert si aucun item masqué', async ({ page }) => {
    await enterListerEvent(page)
    await press(page, ':')
    await pane1(page).locator('#events-panel .panel-search').fill('a')
    await expect(pane1(page).locator('.status-filter-badge--mode')).toBeVisible()
    await expect(pane1(page).locator('.status-filter-badge--active')).not.toBeVisible()
  })

  test('badge FILTRE rouge quand items masqués', async ({ page }) => {
    await enterListerEvent(page)
    await press(page, ':')
    await pane1(page).locator('#events-panel .panel-search').fill('Paris')
    await expect(pane1(page).locator('.status-filter-badge--active')).toBeVisible()
  })

  test('badge FILTRE absent après fermeture de la filter-bar', async ({ page }) => {
    await enterListerEvent(page)
    await press(page, ':')
    await press(page, ':')
    await expect(pane1(page).locator('.status-filter-badge--mode')).not.toBeVisible()
    await expect(pane1(page).locator('.status-filter-badge--active')).not.toBeVisible()
  })
})


// ── Barre d'état : indicateur FILTRE ─────────────────────────────

test.describe('indicateur FILTRE dans la barre d\'état', () => {
  test.beforeEach(() => { installFixtures('filter-events') })

  async function enterListerEvent(page) {
    await page.goto('/')
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
  }

  test('status bar affiche FILTRE quand un filtre est actif', async ({ page }) => {
    await enterListerEvent(page)
    await press(page, ':')
    await pane1(page).locator('#events-panel .panel-search').fill('bal')
    await expect(pane1(page).locator('#status-bar')).toContainText('FILTRE')
  })

  test('status bar n\'affiche plus FILTRE après effacement du filtre', async ({ page }) => {
    await enterListerEvent(page)
    await press(page, ':')
    await pane1(page).locator('#events-panel .panel-search').fill('bal')
    await press(page, ':')
    await expect(pane1(page).locator('#status-bar')).not.toContainText('FILTRE')
  })
})
