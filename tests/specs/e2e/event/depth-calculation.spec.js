import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

// La traversée top-down assigne data-depth sur #events-panel :
//   actes (niv.1)      → depth=1
//   séquences (niv.2)  → depth=2
//   scènes (niv.3)     → depth=3

test("état initial : depth=1/2/2/3 pour les ListerEvents", async ({ page }) => {

  installFixtures('depth-move')
  await page.goto('/')

  await expect(pane1(page).locator('#projects-panel')).toBeVisible()

  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()

  await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '1')

  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('.event-item[data-id="e31"]')).toBeVisible()

  await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '2')

  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('.event-item[data-id="e57"]')).toBeVisible()

  await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '3')

  await press(page, 'ArrowLeft')
  await press(page, 'ArrowLeft')
  await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '1')

  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.event-item[data-id="e23"]')).toHaveClass(/selected/)
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('.event-item[data-id="e88"]')).toBeVisible()

  await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '2')

})

test("cas 1 : déplacement e45 sans enfant — depths inchangés (1/2/2/3)", async ({ page }) => {

  installFixtures('depth-move-cas1')
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()

  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '1')

  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '2')

  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '3')

})

test("cas 2 : déplacement e31 vers Liste#5 — Liste#4 reste à depth=3", async ({ page }) => {

  installFixtures('depth-move-cas2')
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()

  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '1')

  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.event-item[data-id="e23"]')).toHaveClass(/selected/)
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '2')

  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.event-item[data-id="e31"]')).toHaveClass(/selected/)
  await press(page, 'ArrowRight')

  await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '3')

})

test("cas 3 : déplacement e31 vers Liste#2 — Liste#4 passe à depth=2", async ({ page }) => {

  installFixtures('depth-move-cas3')
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()

  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '1')

  await press(page, 'ArrowDown')
  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.event-item[data-id="e31"]')).toHaveClass(/selected/)
  await press(page, 'ArrowRight')

  await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '2')

})
