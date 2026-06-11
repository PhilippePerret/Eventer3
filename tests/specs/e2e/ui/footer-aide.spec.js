import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

const OPEN_KEY = 'Meta+?'

test.beforeEach(() => {
  installFixtures('many-events')
})

test("le footer affiche des raccourcis sur la liste des projets", async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press(OPEN_KEY)
  const help = page.locator('.contextual-help')
  await expect(help).toBeVisible()
  await expect(help).not.toBeEmpty()
})

test("le footer affiche des raccourcis dans un EventLister", async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  await page.keyboard.press(OPEN_KEY)
  const help = page.locator('.contextual-help')
  await expect(help).toBeVisible()
  await expect(help).not.toBeEmpty()
})

test("le footer mentionne au moins la navigation (↑↓) dans la liste des projets", async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press(OPEN_KEY)
  await expect(page.locator('.contextual-help')).toContainText('↑')
  await expect(page.locator('.contextual-help')).toContainText('↓')
})

test("le footer mentionne au moins la navigation (↑↓) dans un EventLister", async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  await page.keyboard.press(OPEN_KEY)
  await expect(page.locator('.contextual-help')).toContainText('↑')
  await expect(page.locator('.contextual-help')).toContainText('↓')
})
