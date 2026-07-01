// Origine : tests/specs/e2e/event/new-event-virtual-lister.spec.js
import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

test("→ sur un projet sans lister : crée l'éditeur, Enter confirme, n crée un second event", async ({ page }) => {

  await page.goto('/')


  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)

  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.project-item').nth(1)).toHaveClass(/selected/)

  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()

  const firstInput = pane1(page).locator('.event-item [data-field="title"]')
  await expect(firstInput).toBeVisible()
  await expect(firstInput).toBeFocused()

  await firstInput.fill('Mon premier event')
  await press(page, 'Enter')
  await page.waitForLoadState('networkidle')

  await expect(pane1(page).locator('.event-item')).toHaveCount(1)
  await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Mon premier event')

  const listerResp = await page.request.get('/api/items/00000000-0000-0000-0000-000000000002/lister')
  expect(listerResp.ok()).toBeTruthy()
  const lister = await listerResp.json()
  expect(lister.item_ids).toHaveLength(1)
  const itemsResp = await page.request.get(`/api/listers/${lister.id}/items?project_id=00000000-0000-0000-0000-000000000002`)
  expect(itemsResp.ok()).toBeTruthy()
  const items = await itemsResp.json()
  expect(items[lister.item_ids[0]].title).toBe('Mon premier event')


  await press(page, 'n')
  const secondInput = pane1(page).locator('.event-item [data-field="title"]')
  await expect(secondInput).toBeVisible()
  await expect(secondInput).toBeFocused()

  await secondInput.fill('Mon second event')
  await press(page, 'Enter')

  await expect(pane1(page).locator('.event-item')).toHaveCount(2)
  await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Mon premier event')
  await expect(pane1(page).locator('.event-item').nth(1)).toContainText('Mon second event')


})
