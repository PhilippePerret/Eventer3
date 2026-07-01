import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

const EVENT_TITLE = `Nouveau à ${new Date().toISOString()}`

test.beforeEach(() => {
  installFixtures('many-events')
})

async function enterEventList(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
}

test("dans un ListerEvent, Enter passe l'event sélectionné en édition du titre", async ({ page }) => {

  await page.goto('/')

  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()

  const firstItem = pane1(page).locator('.event-item').nth(0)
  await expect(firstItem).toHaveClass(/selected/)

  await press(page, 'Enter')

  const input = firstItem.locator('[data-field="title"]')
  await expect(input).toBeVisible()
  await expect(input).toBeFocused()
  await expect(input).toHaveText('Évènement un')

  await input.fill('Titre modifié')
  await press(page, 'Enter')

  await expect(firstItem.locator('[data-field="title"]')).not.toBeVisible()
  await expect(firstItem).toContainText('Titre modifié')

})

test("dans un ListerEvent, Escape annule l'édition et restaure le titre original", async ({ page }) => {

  await page.goto('/')

  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()

  const firstItem = pane1(page).locator('.event-item').nth(0)
  await expect(firstItem).toHaveClass(/selected/)

  await press(page, 'Enter')

  const input = firstItem.locator('[data-field="title"]')
  await expect(input).toBeVisible()
  await expect(input).toHaveText('Évènement un')

  await input.fill('Titre temporaire')
  await press(page, 'Escape')

  await expect(firstItem.locator('[data-field="title"]')).not.toBeVisible()
  await expect(firstItem).toContainText('Évènement un')

})

test('ArrowDown pendant édition du titre ne sélectionne pas le suivant', async ({ page }) => {
  await enterEventList(page)
  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)
  await press(page, 'Enter')
  await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/editing/)
  const title = pane1(page).locator('.event-item.editing [data-field="title"]')
  await expect(title).toBeVisible()
  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/editing/)
  await expect(pane1(page).locator('.event-item').nth(2)).not.toHaveClass(/selected/)
})

test('ArrowUp pendant édition du titre ne sélectionne pas le précédent', async ({ page }) => {
  await enterEventList(page)
  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)
  await press(page, 'Enter')
  await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/editing/)
  const title = pane1(page).locator('.event-item.editing [data-field="title"]')
  await expect(title).toBeVisible()
  await press(page, 'ArrowUp')
  await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/editing/)
  await expect(pane1(page).locator('.event-item').nth(0)).not.toHaveClass(/selected/)
})

test('titre persisté en mémoire : retour et re-entrée dans le projet', async ({ page }) => {
  await enterEventList(page)
  await press(page, 'n')
  const input = pane1(page).locator('.event-item.editing [data-field="title"]')
  await expect(input).toBeVisible()
  await input.fill(EVENT_TITLE)
  await press(page, 'Enter')
  await press(page, 'ArrowLeft')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await expect(pane1(page).locator('.event-item').filter({ hasText: EVENT_TITLE })).toBeVisible()
})

test('titre persisté en DB : rechargement de la page', async ({ page }) => {
  await enterEventList(page)
  await press(page, 'n')
  const input = pane1(page).locator('.event-item.editing [data-field="title"]')
  await expect(input).toBeVisible()
  await input.fill(EVENT_TITLE)
  await press(page, 'Enter')
  await page.waitForLoadState('networkidle')
  await page.reload()
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await expect(pane1(page).locator('.event-item').filter({ hasText: EVENT_TITLE })).toBeVisible()
})
