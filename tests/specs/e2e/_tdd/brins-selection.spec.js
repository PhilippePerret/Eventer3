// Origine : tests/specs/e2e/brin/brins-selection.spec.js
import { test, expect, pane1 } from '../__setup__.js'
import { setupTestBrinsFixture } from '../../../helpers/fixture-setup.js'

test('brins cochés doivent correspondre aux brins de l\'event', async ({ page }) => {
  await setupTestBrinsFixture()
  await page.goto('/')

  // Naviguer au premier project
  await pane1(page).locator('.project-item.selected').press('ArrowRight')
  await expect(pane1(page).locator('.event-item')).toHaveCount(3)

  // Ouvrir brins pour e1 (doit avoir A et B cochés)
  await pane1(page).locator('.event-item.selected').press('b')
  await expect(pane1(page).locator('#brins-panel')).toBeVisible()

  let brinsItems = pane1(page).locator('.brin-item')
  let checkedCount = 0
  let uncheckedCount = 0

  console.log(`e1: ${await brinsItems.count()} brins trouvés`)

  for (let i = 0; i < await brinsItems.count(); i++) {
    const item = brinsItems.nth(i)
    const hasChecked = await item.evaluate(el => el.classList.contains('checked'))
    const title = await item.locator('.brin-title').textContent()
    console.log(`  - "${title}" (checked: ${hasChecked})`)
    if (hasChecked) {
      checkedCount++
      expect(title).toMatch(/Brin [AB]/)
    } else {
      uncheckedCount++
      expect(title).toMatch(/Brin [CD]/)
    }
  }
  expect(checkedCount).toBe(2)
  expect(uncheckedCount).toBe(2)

  // Fermer
  await pane1(page).locator('.brin-item.selected').press('Meta+Enter')

  // Ouvrir brins pour e3 (aucun coché)
  await pane1(page).locator('.event-item.selected').press('ArrowDown')
    await pane1(page).locator('.event-item.selected').press('b')
  
  brinsItems = pane1(page).locator('.brin-item')
  checkedCount = 0

  for (let i = 0; i < await brinsItems.count(); i++) {
    const item = brinsItems.nth(i)
    const hasChecked = await item.evaluate(el => el.classList.contains('checked'))
    const title = await item.locator('.brin-title').textContent()
    expect(hasChecked).toBe(false)
    if (hasChecked) checkedCount++
  }
  expect(checkedCount).toBe(0)

  // Fermer
  await pane1(page).locator('.brin-item.selected').press('Meta+Enter')

  // Ouvrir brins pour e2 (doit avoir B et C cochés)
  await pane1(page).locator('.event-item.selected').press('ArrowDown')
    await pane1(page).locator('.event-item.selected').press('b')
  
  brinsItems = pane1(page).locator('.brin-item')
  checkedCount = 0
  uncheckedCount = 0

  for (let i = 0; i < await brinsItems.count(); i++) {
    const item = brinsItems.nth(i)
    const hasChecked = await item.evaluate(el => el.classList.contains('checked'))
    const title = await item.locator('.brin-title').textContent()
    if (hasChecked) {
      checkedCount++
      expect(title).toMatch(/Brin [BC]/)
    } else {
      uncheckedCount++
      expect(title).toMatch(/Brin [AD]/)
    }
  }
  expect(checkedCount).toBe(2)
  expect(uncheckedCount).toBe(2)

  // Cocher D
  const brinDItem = pane1(page).locator('.brin-item').filter({ hasText: /Brin D/ })
  await brinDItem.click()
  
  // Fermer
  await pane1(page).locator('.brin-item.selected').press('Meta+Enter')

  // Naviguer back à e1 et vérifier que A et B sont encore cochés
  await pane1(page).locator('.event-item.selected').press('ArrowLeft')
    await pane1(page).locator('.project-item.selected').press('ArrowUp')
    await pane1(page).locator('.project-item.selected').press('ArrowUp')
    await pane1(page).locator('.project-item.selected').press('ArrowRight')
    await pane1(page).locator('.event-item.selected').press('b')
  
  brinsItems = pane1(page).locator('.brin-item')
  checkedCount = 0

  for (let i = 0; i < await brinsItems.count(); i++) {
    const item = brinsItems.nth(i)
    const hasChecked = await item.evaluate(el => el.classList.contains('checked'))
    const title = await item.locator('.brin-title').textContent()
    if (hasChecked) {
      checkedCount++
      expect(title).toMatch(/Brin [AB]/)
    }
  }
  expect(checkedCount).toBe(2)
})
