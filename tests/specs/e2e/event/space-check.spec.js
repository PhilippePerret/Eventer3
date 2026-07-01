import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

async function enterListerEvent(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
}

test('Space coche visuellement l\'event sélectionné', async ({ page }) => {
  await enterListerEvent(page)

  const firstEvent = pane1(page).locator('.event-item').nth(0)
  await expect(firstEvent).toHaveClass(/selected/)
  await expect(firstEvent.locator('.event-check')).not.toContainText('✓')

  await press(page, ' ')

  await expect(firstEvent.locator('.event-check')).toContainText('✓')
})

test('Space décoche un event déjà coché', async ({ page }) => {
  await enterListerEvent(page)

  const firstEvent = pane1(page).locator('.event-item').nth(0)
  await press(page, ' ')
  await expect(firstEvent.locator('.event-check')).toContainText('✓')

  await press(page, ' ')
  await expect(firstEvent.locator('.event-check')).not.toContainText('✓')
})

test('Space persiste la coche après rechargement', async ({ page }) => {
  await enterListerEvent(page)

  const patchDone = page.waitForResponse(r => r.url().includes('/api/items/') && r.request().method() === 'PATCH')
  await press(page, ' ')
  const patchResp = await patchDone
  await page.waitForLoadState('networkidle')

  // Vérification API directe avant rechargement
  const itemsResp = await page.request.get('/api/listers/2/items?project_id=00000000-0000-0000-0000-000000000001')
  const itemsData = await itemsResp.json()
  const firstEventId = Object.keys(itemsData)[0]
  const checkedValue = itemsData[firstEventId]?.checked
  expect(checkedValue, `checked DB après PATCH = ${checkedValue}`).toBeTruthy()

  await page.reload()
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()

  const firstEvent = pane1(page).locator('.event-item').nth(0)
  await expect(firstEvent.locator('.event-check')).toContainText('✓')
})
