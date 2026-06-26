import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1 } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('deep-events')
})

test("barre d'état visible au démarrage avec mode PROJECTS", async ({ page }) => {
  await page.goto('/')

  console.log('\n=== TEST STATUS BAR — DÉMARRAGE ===')

  await expect(pane1(page).locator('#projects-panel')).toBeVisible()

  console.log('-> #status-bar doit exister et être visible')
  await expect(pane1(page).locator('#status-bar')).toBeVisible()

  console.log('-> mode par défaut sur liste des projets : DISP MODE PROJECTS')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE PROJECTS')

  console.log('\n=== FIN ===\n')
})

test("barre d'état passe en NESTING à l'entrée dans un ListerEvent", async ({ page }) => {
  await page.goto('/')

  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  await pane1(page).locator('.event-item.selected').press('ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()

  console.log('-> mode NESTING affiché dans ListerEvent')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')
})

test("⌘+m dans ListerEvent bascule NESTING → LEVEL → NESTING", async ({ page }) => {
  await page.goto('/')

  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  await pane1(page).locator('.event-item.selected').press('ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')

  console.log('-> ⌘+m : bascule vers LEVEL')
  await pane1(page).locator('.event-item.selected').press('Meta+m')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')

  console.log('-> ⌘+m : retour vers NESTING')
  await pane1(page).locator('.event-item.selected').press('Meta+m')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')
})

test("retour liste des projets repasse en PROJECTS", async ({ page }) => {
  await page.goto('/')

  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  await pane1(page).locator('.event-item.selected').press('ArrowRight')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')

  await pane1(page).locator('.event-item.selected').press('ArrowLeft')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()

  console.log('-> retour liste projets : status bar repasse en PROJECTS')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE PROJECTS')
})

test("⌘+m inactif sur liste des projets", async ({ page }) => {
  await page.goto('/')

  await expect(pane1(page).locator('#projects-panel')).toBeVisible()

  await pane1(page).locator('.event-item.selected').press('Meta+m')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE PROJECTS')
})
