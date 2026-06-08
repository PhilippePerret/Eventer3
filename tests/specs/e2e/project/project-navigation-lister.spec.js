import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect } from '../__setup__.js'

// Fixture many-projects : 4 projets, aucun n'a de lister_id (pas d'events créés)

test.beforeEach(() => {
  installFixtures('many-projects')
})

test('les events persistent après avoir navigué vers un autre projet et revenu', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)

  // Entrer dans le premier projet → lister virtuel
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)

  // Créer un événement
  await page.keyboard.press('n')
  await expect(page.locator('.event-item.selected input[name="title"]')).toBeFocused()
  await page.keyboard.type('Mon événement test')
  await page.keyboard.press('Enter')
  // Attendre fin des appels réseau (createLister + createItem + save)
  await page.waitForLoadState('networkidle')

  // L'event est visible
  await expect(page.locator('.event-item').nth(0)).toContainText('Mon événement test')

  // Revenir à la liste des projets
  await page.keyboard.press('ArrowLeft')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

  // Entrer dans un autre projet (le second)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)

  // Revenir à la liste des projets
  await page.keyboard.press('ArrowLeft')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

  // Revenir au premier projet
  await page.keyboard.press('ArrowUp')
  await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)

  // L'event doit toujours être là
  await expect(page.locator('.event-item')).toHaveCount(1)
  await expect(page.locator('.event-item').nth(0)).toContainText('Mon événement test')
})
