import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1 } from '../__setup__.js'

const OPEN_KEY = 'Meta+?'

test.beforeEach(() => {
  installFixtures('many-events')
})

test("le footer affiche des raccourcis sur la liste des projets", async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await pane1(page).locator('#main-panel').press(OPEN_KEY)
  const help = pane1(page).locator('.contextual-help')
  await expect(help).toBeVisible()
  await expect(help).not.toBeEmpty()
})

test("le footer affiche des raccourcis dans un ListerEvent", async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  await pane1(page).locator('#main-panel').press(OPEN_KEY)
  const help = pane1(page).locator('.contextual-help')
  await expect(help).toBeVisible()
  await expect(help).not.toBeEmpty()
})

test("le footer mentionne au moins la navigation (↑↓) dans la liste des projets", async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await pane1(page).locator('#main-panel').press(OPEN_KEY)
  await expect(pane1(page).locator('.contextual-help')).toContainText('↑')
  await expect(pane1(page).locator('.contextual-help')).toContainText('↓')
})

test("le footer mentionne au moins la navigation (↑↓) dans un ListerEvent", async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  await pane1(page).locator('#main-panel').press(OPEN_KEY)
  await expect(pane1(page).locator('.contextual-help')).toContainText('↑')
  await expect(pane1(page).locator('.contextual-help')).toContainText('↓')
})
