import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

async function enterEventLister(page) {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
}

test('Space coche visuellement l\'event sélectionné', async ({ page }) => {
  await enterEventLister(page)

  const firstEvent = page.locator('.event-item').nth(0)
  await expect(firstEvent).toHaveClass(/selected/)
  await expect(firstEvent.locator('.event-check')).not.toContainText('✓')

  await page.keyboard.press(' ')

  await expect(firstEvent.locator('.event-check')).toContainText('✓')
})

test('Space décoche un event déjà coché', async ({ page }) => {
  await enterEventLister(page)

  const firstEvent = page.locator('.event-item').nth(0)
  await page.keyboard.press(' ')
  await expect(firstEvent.locator('.event-check')).toContainText('✓')

  await page.keyboard.press(' ')
  await expect(firstEvent.locator('.event-check')).not.toContainText('✓')
})

test('Space persiste la coche après rechargement', async ({ page }) => {
  await enterEventLister(page)

  const patchDone = page.waitForResponse(r => r.url().includes('/api/items/') && r.request().method() === 'PATCH')
  await page.keyboard.press(' ')
  const patchResp = await patchDone
  await page.waitForLoadState('networkidle')

  // Vérification API directe avant rechargement
  const itemsResp = await page.request.get('/api/listers/2/items?project_id=project-a')
  const itemsData = await itemsResp.json()
  const firstEventId = Object.keys(itemsData)[0]
  const checkedValue = itemsData[firstEventId]?.checked
  expect(checkedValue, `checked DB après PATCH = ${checkedValue}`).toBeTruthy()

  await page.reload()
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)

  const firstEvent = page.locator('.event-item').nth(0)
  await expect(firstEvent.locator('.event-check')).toContainText('✓')
})
