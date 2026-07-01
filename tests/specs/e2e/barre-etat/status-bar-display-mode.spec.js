import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('deep-events')
})

test("barre d'état visible au démarrage avec mode PROJECTS", async ({ page }) => {
  await page.goto('/')


  await expect(pane1(page).locator('#projects-panel')).toBeVisible()

  await expect(pane1(page).locator('#status-bar')).toBeVisible()

  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE PROJECTS')

})

test("barre d'état passe en NESTING à l'entrée dans un ListerEvent", async ({ page }) => {
  await page.goto('/')

  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()

  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')
})

test("⌘+m dans ListerEvent bascule NESTING → LEVEL → NESTING", async ({ page }) => {
  await page.goto('/')

  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')

  await press(page, 'Meta+m')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')

  await press(page, 'Meta+m')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')
})

test("retour liste des projets repasse en PROJECTS", async ({ page }) => {
  await page.goto('/')

  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')

  await press(page, 'ArrowLeft')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()

  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE PROJECTS')
})

test("⌘+m inactif sur liste des projets", async ({ page }) => {
  await page.goto('/')

  await expect(pane1(page).locator('#projects-panel')).toBeVisible()

  await press(page, 'Meta+m')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE PROJECTS')
})
