import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

// Fixture many-projects : 4 projets, aucun n'a de lister_id (pas d'events créés)

test.beforeEach(() => {
  installFixtures('many-projects')
})

test('les events persistent après avoir navigué vers un autre projet et revenu', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)

  // Entrer dans le premier projet → lister virtuel
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)

  // Créer un événement
  await pane1(page).locator('#main-panel').press('n')
  await expect(pane1(page).locator('.event-item.selected input[name="title"]')).toBeFocused()
  await page.keyboard.type('Mon événement test')
  await pane1(page).locator('#main-panel').press('Enter')
  // Attendre fin des appels réseau (createLister + createItem + save)
  await page.waitForLoadState('networkidle')

  // L'event est visible
  await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Mon événement test')

  // Revenir à la liste des projets
  await pane1(page).locator('#main-panel').press('ArrowLeft')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)

  // Entrer dans un autre projet (le second)
  await pane1(page).locator('#main-panel').press('ArrowDown')
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)

  // Revenir à la liste des projets
  await pane1(page).locator('#main-panel').press('ArrowLeft')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)

  // Revenir au premier projet
  await pane1(page).locator('#main-panel').press('ArrowUp')
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)

  // L'event doit toujours être là
  await expect(pane1(page).locator('.event-item')).toHaveCount(1)
  await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Mon événement test')
})
