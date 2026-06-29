// Origine : tests/specs/e2e/brin/brin-init.spec.js
import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1, press } from '../__setup__.js'

// fixture many-events : project-a (hl:true, events e1/e2/e3, pas de brins lister)

test.beforeEach(() => {
  installFixtures('many-events')
})

async function goToListerEvent(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
}

test("un projet sans brins reçoit automatiquement b1 'Intrigue principale' à l'ouverture du panneau", async ({ page }) => {
  await goToListerEvent(page)
  await press(page, 'b')
  await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  await expect(pane1(page).locator('.brin-item')).toHaveCount(1)
  await expect(pane1(page).locator('.brin-item').nth(0).locator('.brin-title')).toHaveText('Intrigue principale')
})

test("b1 'Intrigue principale' est persisté dans la base de données", async ({ page }) => {
  await goToListerEvent(page)
  await press(page, 'b')
  await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  await page.waitForLoadState('networkidle')

  const eventsListerResp = await page.request.get('/api/items/00000000-0000-0000-0000-000000000001/lister')
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
