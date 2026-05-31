import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'
import fs from 'fs'
import path from 'path'

// fixture many-events : project-a (hl:true, events e1/e2/e3, aucun __brins.json)

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

test("b1 'Intrigue principale' est persisté dans __brins.json", async ({ page }) => {
  await goToEventLister(page)
  await page.keyboard.press('b')
  await expect(page.locator('#brin-panel')).toBeVisible()
  const brinsPath = path.resolve('../data/lof-projects/lof-project-a/__brins.json')
  const brins = JSON.parse(fs.readFileSync(brinsPath, 'utf8'))
  expect(brins).toHaveProperty('b1')
  expect(brins.b1.tt).toBe('Intrigue principale')
})
