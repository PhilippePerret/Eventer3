// Origine : tests/specs/e2e/app/shell-smoke.spec.js
import { test, expect, press, getErr } from '../__setup__.js'
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
  await press(page, 'ArrowDown')
  await expect(pane1.locator('.project-item').nth(1)).toHaveClass(/selected/)
})

