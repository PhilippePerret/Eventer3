// Origine : tests/specs/e2e/project/project-navigation-lister.spec.js
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1, press } from '../__setup__.js'

// Fixture two-projects-events : Projet A (3 events), Projet B (2 events)

test.beforeEach(() => {
  installFixtures('two-projects-events')
})

test('← sur la liste des projets ne fait rien', async ({ page }) => {
  await page.goto('/')
  await pane1(page).locator('.project-item.selected').waitFor()
  const projectCount = await pane1(page).locator('.project-item').count()
  await press(page, 'ArrowLeft')
  await expect(pane1(page).locator('.project-item')).toHaveCount(projectCount)
  await pane1(page).locator('.project-item.selected').waitFor()
})

test('ArrowUp sur le premier projet sélectionne le dernier', async ({ page }) => {
  await page.goto('/')
  await pane1(page).locator('.project-item.selected').waitFor()
  await press(page, 'ArrowUp')
  const items = pane1(page).locator('.project-item')
  const last  = items.nth(await items.count() - 1)
  await expect(last).toHaveClass(/selected/)
})

test('ArrowDown sur le dernier projet sélectionne le premier', async ({ page }) => {
  await page.goto('/')
  const items = pane1(page).locator('.project-item')
  const count = await items.count()
  for (let i = 0; i < count - 1; i++) {
    await press(page, 'ArrowDown')
  }
  await expect(items.nth(count - 1)).toHaveClass(/selected/)
  await press(page, 'ArrowDown')
  await expect(items.nth(0)).toHaveClass(/selected/)
})

test('les events persistent après avoir navigué vers un autre projet et revenu', async ({ page }) => {
  await page.goto('/')
  await pane1(page).locator('.project-item.selected').waitFor()

  // Entrer dans Projet A
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()

  // Naviguer entre les events existants
  await press(page, 'ArrowDown')
  await press(page, 'ArrowDown')

  // Créer un nouvel event
  await press(page, 'n')
  const titleField = pane1(page).locator('.event-item.selected [data-field="title"]')
  await expect(titleField).toBeFocused()
  await titleField.fill('Nouvel événement')
  await press(page, 'Enter')
  await page.waitForLoadState('networkidle')
  await expect(pane1(page).locator('.event-item')).toHaveCount(4)
  await expect(pane1(page).locator('.event-item.editing')).toHaveCount(0)

  // Revenir à la liste des projets
  await press(page, 'ArrowLeft')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()

  // Entrer dans Projet B
  await press(page, 'ArrowDown')
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()

  // Revenir à la liste des projets
  await press(page, 'ArrowLeft')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()

  // Revenir au Projet A
  await press(page, 'ArrowUp')
  await pane1(page).locator('.project-item.selected').waitFor()
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()

  // Tous les events doivent être là (dont le nouveau)
  await expect(pane1(page).locator('.event-item')).toHaveCount(4)
  await expect(pane1(page).locator('.event-item').filter({ hasText: 'Nouvel événement' })).toHaveCount(1)
})
