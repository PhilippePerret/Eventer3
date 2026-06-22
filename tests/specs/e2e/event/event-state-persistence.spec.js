import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

async function goToEventLister(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
}

async function setEventState(page, stateName) {
  await pane1(page).locator('#main-panel').press('Enter')
  await expect(pane1(page).locator('.event-item.selected input[name="title"]')).toBeFocused()
  await pane1(page).locator('#main-panel').press('Tab')
  await expect(pane1(page).locator('.event-item.selected [data-field-name="state"]')).toBeFocused()
  await pane1(page).locator('#main-panel').press('ArrowDown')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  // Filtrer pour trouver l'option rapidement
  await pane1(page).locator('.popup-select__search').fill(stateName)
  await expect(pane1(page).locator('.popup-select__option')).toHaveCount(1)
  await pane1(page).locator('#main-panel').press('Enter')
  // Confirmer l'édition
  await pane1(page).locator('#main-panel').press('Enter')
}

test("l'état d'un event est sauvegardé en base et récupéré après rechargement", async ({ page }) => {
  await goToEventLister(page)

  await setEventState(page, 'ébauche')

  // Vérification immédiate
  const stateEl = pane1(page).locator('.event-item').nth(0).locator('.event-state')
  await expect(stateEl).toHaveText('ébauche')

  // Attendre que le PATCH soit terminé avant de recharger
  await page.waitForLoadState('networkidle')

  // Rechargement de la page
  await page.reload()
  await goToEventLister(page)

  // L'état doit être préservé
  const stateElAfterReload = pane1(page).locator('.event-item').nth(0).locator('.event-state')
  await expect(stateElAfterReload).toHaveText('ébauche')
})

test("l'état 'premier jet' persiste après rechargement", async ({ page }) => {
  await goToEventLister(page)

  await setEventState(page, 'premier jet')

  // Attendre que le PATCH soit terminé avant de recharger
  await page.waitForLoadState('networkidle')

  // Rechargement
  await page.reload()
  await goToEventLister(page)

  await expect(pane1(page).locator('.event-item').nth(0).locator('.event-state')).toHaveText('premier jet')
})
