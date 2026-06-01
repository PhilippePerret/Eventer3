import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

// fixture many-events : project-a (hl:true, events e1/e2/e3, pas de brins lister)

test.beforeEach(() => {
  installFixtures('many-events')
})

async function goToEventLister(page) {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
}

test("un projet sans brins reçoit automatiquement b1 'Intrigue principale' à l'ouverture du panneau", async ({ page }) => {
  await goToEventLister(page)
  await page.keyboard.press('b')
  await expect(page.locator('#brin-panel')).toBeVisible()
  await expect(page.locator('.brin-item')).toHaveCount(1)
  await expect(page.locator('.brin-item').nth(0).locator('.brin-item__title')).toHaveText('Intrigue principale')
})

test("b1 'Intrigue principale' est persisté dans la base de données", async ({ page }) => {
  await goToEventLister(page)
  await page.keyboard.press('b')
  await expect(page.locator('#brin-panel')).toBeVisible()
  await page.waitForLoadState('networkidle')

  const eventsListerResp = await page.request.get('/api/items/project-a/lister')
  expect(eventsListerResp.ok()).toBeTruthy()
  const eventsLister = await eventsListerResp.json()
  const brinsListerId = eventsLister.brins_lister_id
  expect(brinsListerId).toBeTruthy()

  const itemsResp = await page.request.get(`/api/listers/${brinsListerId}/items`)
  expect(itemsResp.ok()).toBeTruthy()
  const items = await itemsResp.json()
  const intrigue = Object.values(items).find(i => i.title === 'Intrigue principale')
  expect(intrigue).toBeTruthy()
})
