import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

test("le footer affiche des raccourcis sur la liste des projets", async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  const footer = page.locator('#shortcuts-footer')
  await expect(footer).toBeVisible()
  await expect(footer).not.toBeEmpty()
})

test("le footer affiche des raccourcis dans un EventLister", async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  const footer = page.locator('#shortcuts-footer')
  await expect(footer).toBeVisible()
  await expect(footer).not.toBeEmpty()
})

test("le footer mentionne au moins la navigation (↑↓) dans la liste des projets", async ({ page }) => {
  await page.goto('/')
  const footer = page.locator('#shortcuts-footer')
  await expect(footer).toContainText('↑')
  await expect(footer).toContainText('↓')
})

test("le footer mentionne au moins la navigation (↑↓) dans un EventLister", async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('ArrowRight')
  const footer = page.locator('#shortcuts-footer')
  await expect(footer).toContainText('↑')
  await expect(footer).toContainText('↓')
})
