// Origine : tests/specs/e2e/brin/brins-selection.spec.js
import { test, expect, pane1, press } from '../__setup__.js'
import { setupTestBrinsFixture } from '../../../helpers/fixture-setup.js'

test('brins cochés doivent correspondre aux brins de l\'event', async ({ page }) => {
  await setupTestBrinsFixture()
  await page.goto('/')

  // Naviguer au premier project
  await pane1(page).locator('#projects-panel').waitFor()
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('.event-item')).toHaveCount(3)

  // Ouvrir brins pour e1 (doit avoir A et B cochés)
  await press(page, 'b')
  await expect(pane1(page).locator('#brins-panel')).toBeVisible()

  let brinsItems = pane1(page).locator('.brin-item')
  let checkedCount = 0
  let uncheckedCount = 0

  for (let i = 0; i < await brinsItems.count(); i++) {
    const item = brinsItems.nth(i)
    const hasChecked = await item.evaluate(el => el.classList.contains('checked'))
    const title = await item.locator('.brin-title').textContent()
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
  await press(page, 'Meta+Enter')

  // Ouvrir brins pour e3 (aucun coché)
  await press(page, 'ArrowDown')
  await press(page, 'b')

  brinsItems = pane1(page).locator('.brin-item')
  checkedCount = 0

  for (let i = 0; i < await brinsItems.count(); i++) {
    const item = brinsItems.nth(i)
    const hasChecked = await item.evaluate(el => el.classList.contains('checked'))
    expect(hasChecked).toBe(false)
    if (hasChecked) checkedCount++
  }
  expect(checkedCount).toBe(0)

  // Fermer
  await press(page, 'Meta+Enter')

  // Ouvrir brins pour e2 (doit avoir B et C cochés)
  await press(page, 'ArrowDown')
  await press(page, 'b')

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

  // Cocher D (index 3 : ArrowDown×3 depuis A sélectionné)
  await press(page, 'ArrowDown')
  await press(page, 'ArrowDown')
  await press(page, 'ArrowDown')
  await press(page, ' ')

  // Fermer
  await press(page, 'Meta+Enter')

  // Naviguer back à e1 et vérifier que A et B sont encore cochés
  await press(page, 'ArrowLeft')
  await press(page, 'ArrowUp')
  await press(page, 'ArrowUp')
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  await press(page, 'b')

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
