// Origine : tests/specs/e2e/event/new-event-titre-vide.spec.js
import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1 } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

// many-events : project-b n'a pas d'events → lister virtuel à l'entrée

async function enterVirtualListerEvent(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await pane1(page).locator('.event-item.selected').press('ArrowDown')
  await expect(pane1(page).locator('.project-item').nth(1)).toHaveClass(/selected/)
  await pane1(page).locator('.project-item.selected').press('ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  const input = pane1(page).locator('.event-item [data-field="title"]')
  await expect(input).toBeVisible()
  return input
}

test('Enter avec titre vide dans lister vide : notification affichée', async ({ page }) => {
  const input = await enterVirtualListerEvent(page)
  await input.press('Enter')
  await expect(pane1(page).locator('#notification')).toBeVisible()
})

test('Enter avec titre vide dans lister vide : notification mentionne "évènement"', async ({ page }) => {
  const input = await enterVirtualListerEvent(page)
  await input.press('Enter')
  await expect(pane1(page).locator('#notification')).toContainText('évènement')
})

test('Enter avec titre vide dans lister vide : éditeur reste visible', async ({ page }) => {
  const input = await enterVirtualListerEvent(page)
  await input.press('Enter')
  await expect(pane1(page).locator('.event-item [data-field="title"]')).toBeVisible()
})

test('Escape avec titre vide dans lister vide : notification affichée', async ({ page }) => {
  const input = await enterVirtualListerEvent(page)
  await input.press('Escape')
  await expect(pane1(page).locator('#notification')).toBeVisible()
})

test('Escape avec titre vide dans lister vide : pas de page blanche', async ({ page }) => {
  const input = await enterVirtualListerEvent(page)
  await expect(pane1(page).locator('#events-panel')).not.toBeEmpty()
  await input.press('Escape')
  await expect(pane1(page).locator('#notification')).toBeVisible()
  await expect(pane1(page).locator('#events-panel')).not.toBeEmpty()
})
