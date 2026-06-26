import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1 } from '../__setup__.js'

const OPEN_KEY = 'Meta+?'

test.beforeEach(() => {
  installFixtures('many-events')
})

test("le footer affiche des raccourcis sur la liste des projets", async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await pane1(page).locator('.event-item.selected').press(OPEN_KEY)
  const help = pane1(page).locator('.contextual-help')
  await expect(help).toBeVisible()
  await expect(help).not.toBeEmpty()
})

test("le footer affiche des raccourcis dans un ListerEvent", async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await pane1(page).locator('.project-item.selected').press('ArrowRight').press('ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await pane1(page).locator('.event-item.selected').press(OPEN_KEY)
  const help = pane1(page).locator('.contextual-help')
  await expect(help).toBeVisible()
  await expect(help).not.toBeEmpty()
})

test("le footer mentionne au moins la navigation (↑↓) dans la liste des projets", async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await pane1(page).locator('.event-item.selected').press(OPEN_KEY)
  await expect(pane1(page).locator('.contextual-help')).toContainText('↑')
  await expect(pane1(page).locator('.contextual-help')).toContainText('↓')
})

test("le footer mentionne au moins la navigation (↑↓) dans un ListerEvent", async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await pane1(page).locator('.project-item.selected').press('ArrowRight').press('ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await pane1(page).locator('.event-item.selected').press(OPEN_KEY)
  await expect(pane1(page).locator('.contextual-help')).toContainText('↑')
  await expect(pane1(page).locator('.contextual-help')).toContainText('↓')
})
