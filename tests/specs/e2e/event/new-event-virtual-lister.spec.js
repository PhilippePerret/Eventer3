// Origine : tests/specs/e2e/event/new-event-virtual-lister.spec.js
import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1 } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

test("→ sur un projet sans lister : crée l'éditeur, Enter confirme, n crée un second event", async ({ page }) => {

  await page.goto('/')

  console.log('\n=== TEST PREMIER EVENT + SECOND EVENT ===')

  console.log('-> attente du rendu initial')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)

  console.log('-> sélection du projet sans lister (project-b)')
  await pane1(page).locator('#main-panel').press('ArrowDown')
  await expect(pane1(page).locator('.project-item').nth(1)).toHaveClass(/selected/)

  console.log('-> flèche → : entre dans le ListerEvent vide')
  await pane1(page).locator('.project-item.selected').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)

  console.log('-> vérification : un éditeur est apparu automatiquement')
  const firstInput = pane1(page).locator('.event-item [data-field="title"]')
  await expect(firstInput).toBeVisible()
  await expect(firstInput).toBeFocused()

  console.log('-> saisie du premier event et validation')
  await firstInput.fill('Mon premier event')
  await pane1(page).locator('.event-item.selected').press('Enter')
  await page.waitForLoadState('networkidle')

  console.log('-> vérification : le premier event est créé dans le DOM')
  await expect(pane1(page).locator('.event-item')).toHaveCount(1)
  await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Mon premier event')

  console.log('-> vérification : données persistées sur le serveur')
  const listerResp = await page.request.get('/api/items/00000000-0000-0000-0000-000000000002/lister')
  expect(listerResp.ok()).toBeTruthy()
  const lister = await listerResp.json()
  expect(lister.item_ids).toHaveLength(1)
  const itemsResp = await page.request.get(`/api/listers/${lister.id}/items?project_id=00000000-0000-0000-0000-000000000002`)
  expect(itemsResp.ok()).toBeTruthy()
  const items = await itemsResp.json()
  expect(items[lister.item_ids[0]].title).toBe('Mon premier event')

  console.log('-> vérification : project-b a maintenant un lister')

  console.log('-> appui sur n : doit créer un second event en dessous')
  await pane1(page).locator('#main-panel').press('n')
  const secondInput = pane1(page).locator('.event-item [data-field="title"]')
  await expect(secondInput).toBeVisible()
  await expect(secondInput).toBeFocused()

  await secondInput.fill('Mon second event')
  await pane1(page).locator('.event-item.selected').press('Enter')

  console.log('-> vérification : deux events dans le bon ordre')
  await expect(pane1(page).locator('.event-item')).toHaveCount(2)
  await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Mon premier event')
  await expect(pane1(page).locator('.event-item').nth(1)).toContainText('Mon second event')

  console.log('\n=== FIN TEST ===\n')

})
