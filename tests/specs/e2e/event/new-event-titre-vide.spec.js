import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1 } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

// many-events : project-b n'a pas d'events → lister virtuel à l'entrée

async function enterVirtualEventLister(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await pane1(page).locator('#main-panel').press('ArrowDown')
  await expect(pane1(page).locator('.project-item').nth(1)).toHaveClass(/selected/)
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  await expect(pane1(page).locator('.event-item input[name="title"]')).toBeVisible()
}

test('Enter avec titre vide dans lister vide : notification affichée', async ({ page }) => {
  await enterVirtualEventLister(page)
  await pane1(page).locator('#main-panel').press('Enter')
  await expect(pane1(page).locator('#notification')).toBeVisible()
})

test('Enter avec titre vide dans lister vide : notification mentionne "évènement"', async ({ page }) => {
  await enterVirtualEventLister(page)
  await pane1(page).locator('#main-panel').press('Enter')
  await expect(pane1(page).locator('#notification')).toContainText('évènement')
})

test('Enter avec titre vide dans lister vide : éditeur reste visible', async ({ page }) => {
  await enterVirtualEventLister(page)
  await pane1(page).locator('#main-panel').press('Enter')
  await expect(pane1(page).locator('.event-item input[name="title"]')).toBeVisible()
})

test('Escape avec titre vide dans lister vide : notification affichée', async ({ page }) => {
  await enterVirtualEventLister(page)
  await pane1(page).locator('#main-panel').press('Escape')
  await expect(pane1(page).locator('#notification')).toBeVisible()
})

test('Escape avec titre vide dans lister vide : pas de page blanche', async ({ page }) => {
  await enterVirtualEventLister(page)
  await pane1(page).locator('#main-panel').press('Escape')
  await expect(pane1(page).locator('#main-panel')).not.toBeEmpty()
})
