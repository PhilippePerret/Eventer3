import { test, expect } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'

test('shell / : pane-1 charge app-frame et affiche la liste des projets', async ({ page }) => {
  await page.goto('/')
  const pane1 = page.frameLocator('#pane-1')
  await expect(pane1.locator('.project-item').first()).toBeVisible()
})

test('shell / : ArrowDown sans click préalable sélectionne le 2e projet', async ({ page }) => {
  installFixtures('two-projects-events')
  await page.goto('/')
  const pane1 = page.frameLocator('#pane-1')
  await expect(pane1.locator('.project-item').first()).toHaveClass(/selected/)
  await pane1(page).locator('body').press('ArrowDown')
  await expect(pane1.locator('.project-item').nth(1)).toHaveClass(/selected/)
})

test('shell / : ArrowDown APRÈS click dans pane-1 sélectionne le 2e projet', async ({ page }) => {
  installFixtures('two-projects-events')
  await page.goto('/')
  const pane1 = page.frameLocator('#pane-1')
  await pane1.locator('body').click()
  await pane1(page).locator('body').press('ArrowDown')
  await expect(pane1.locator('.project-item').nth(1)).toHaveClass(/selected/)
})
