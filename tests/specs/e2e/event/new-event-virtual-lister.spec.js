import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

test("→ sur un projet sans lister : crée l'éditeur, Enter confirme, n crée un second event", async ({ page }) => {

  await page.goto('/')

  console.log('\n=== TEST PREMIER EVENT + SECOND EVENT ===')

  console.log('-> attente du rendu initial')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)

  console.log('-> sélection du projet sans lister (project-b)')
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.project-item').nth(1)).toHaveClass(/selected/)

  console.log('-> flèche → : entre dans le EventLister vide')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)

  console.log('-> vérification : un éditeur est apparu automatiquement')
  const firstInput = page.locator('.event-item input[name="title"]')
  await expect(firstInput).toBeVisible()
  await expect(firstInput).toBeFocused()

  console.log('-> saisie du premier event et validation')
  await page.keyboard.type('Mon premier event')

  const savePromise = page.waitForResponse(resp =>
    resp.url().includes('/api/listers/') && resp.request().method() === 'PATCH'
  )
  await page.keyboard.press('Enter')
  await savePromise

  console.log('-> vérification : le premier event est créé dans le DOM')
  await expect(page.locator('.event-item')).toHaveCount(1)
  await expect(page.locator('.event-item').nth(0)).toContainText('Mon premier event')

  console.log('-> vérification : données persistées sur le serveur')
  const listerResp = await page.request.get('/api/items/project-b/lister')
  expect(listerResp.ok()).toBeTruthy()
  const lister = await listerResp.json()
  expect(lister.item_ids).toHaveLength(1)
  const itemsResp = await page.request.get(`/api/listers/${lister.id}/items?project_id=project-b`)
  expect(itemsResp.ok()).toBeTruthy()
  const items = await itemsResp.json()
  expect(items[lister.item_ids[0]].title).toBe('Mon premier event')

  console.log('-> vérification : project-b a maintenant un lister')

  console.log('-> appui sur n : doit créer un second event en dessous')
  await page.keyboard.press('n')
  const secondInput = page.locator('.event-item input[name="title"]')
  await expect(secondInput).toBeVisible()
  await expect(secondInput).toBeFocused()

  await page.keyboard.type('Mon second event')
  await page.keyboard.press('Enter')

  console.log('-> vérification : deux events dans le bon ordre')
  await expect(page.locator('.event-item')).toHaveCount(2)
  await expect(page.locator('.event-item').nth(0)).toContainText('Mon premier event')
  await expect(page.locator('.event-item').nth(1)).toContainText('Mon second event')

  console.log('\n=== FIN TEST ===\n')

})
