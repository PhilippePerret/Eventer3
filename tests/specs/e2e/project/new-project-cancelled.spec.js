import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1 } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-projects')
})

test('la touche Escape après n annule complètement la création du projet', async ({ page }) => {
  console.log('\n=== TEST ANNULATION NOUVEAU PROJET ===\n')

  await page.goto('/')

  const items = pane1(page).locator('.project-item')

  console.log('-> vérification nombre initial projets')
  await expect(items).toHaveCount(3)
  await expect(items.nth(0)).toHaveClass(/selected/)
  await expect(items.nth(1)).not.toHaveClass(/selected/)
  await expect(items.nth(2)).not.toHaveClass(/selected/)

  console.log('-> lecture backend avant création')
  const beforeResp = await page.request.get('/api/listers/1')
  const before = await beforeResp.json()

  console.log('-> création nouveau projet')
  await pane1(page).locator('.project-item.selected').press('n')

  console.log('-> annulation création')
  await pane1(page).locator('.project-item.selected').press('Escape')

  console.log('-> vérification nombre final projets')
  await expect(items).toHaveCount(3)
  await expect(pane1(page).locator('input:not(#filter-input):not(.panel-search)')).toHaveCount(0)
  await expect(items.nth(0)).toHaveClass(/selected/)
  await expect(items.nth(1)).not.toHaveClass(/selected/)
  await expect(items.nth(2)).not.toHaveClass(/selected/)

  console.log('-> vérification backend inchangé')
  const afterResp = await page.request.get('/api/listers/1')
  const after = await afterResp.json()
  expect(after.item_ids).toEqual(before.item_ids)

  console.log('\n=== FIN TEST ANNULATION NOUVEAU PROJET ===\n')
})
