import { test, expect } from '../__setup__.js'
import { setupTestBrinsFixture } from '../../../helpers/fixture-setup.js'

test('brins cochés doivent correspondre aux brins de l\'event', async ({ page }) => {
  await setupTestBrinsFixture()
  await page.goto('/')

  // Naviguer au premier project
  await page.press('body', 'ArrowRight')
  await page.waitForTimeout(500)

  // Ouvrir brins pour e1 (doit avoir A et B cochés)
  await page.press('body', 'b')
  await page.waitForTimeout(300)

  let brinsItems = page.locator('.brin-item')
  let checkedCount = 0
  let uncheckedCount = 0

  console.log(`e1: ${await brinsItems.count()} brins trouvés`)

  for (let i = 0; i < await brinsItems.count(); i++) {
    const item = brinsItems.nth(i)
    const hasChecked = await item.evaluate(el => el.classList.contains('checked'))
    const title = await item.locator('.brin-item__title').textContent()
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
  await page.press('body', 'Escape')
  await page.waitForTimeout(200)

  // Ouvrir brins pour e3 (aucun coché)
  await page.press('body', 'ArrowDown')
  await page.waitForTimeout(200)
  await page.press('body', 'b')
  await page.waitForTimeout(300)

  brinsItems = page.locator('.brin-item')
  checkedCount = 0

  for (let i = 0; i < await brinsItems.count(); i++) {
    const item = brinsItems.nth(i)
    const hasChecked = await item.evaluate(el => el.classList.contains('checked'))
    const title = await item.locator('.brin-item__title').textContent()
    expect(hasChecked).toBe(false)
    if (hasChecked) checkedCount++
  }
  expect(checkedCount).toBe(0)

  // Fermer
  await page.press('body', 'Escape')
  await page.waitForTimeout(200)

  // Ouvrir brins pour e2 (doit avoir B et C cochés)
  await page.press('body', 'ArrowDown')
  await page.waitForTimeout(200)
  await page.press('body', 'b')
  await page.waitForTimeout(300)

  brinsItems = page.locator('.brin-item')
  checkedCount = 0
  uncheckedCount = 0

  for (let i = 0; i < await brinsItems.count(); i++) {
    const item = brinsItems.nth(i)
    const hasChecked = await item.evaluate(el => el.classList.contains('checked'))
    const title = await item.locator('.brin-item__title').textContent()
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
  const brinDItem = page.locator('.brin-item').filter({ hasText: /Brin D/ })
  await brinDItem.click()
  await page.waitForTimeout(200)

  // Fermer
  await page.press('body', 'Escape')
  await page.waitForTimeout(200)

  // Naviguer back à e1 et vérifier que A et B sont encore cochés
  await page.press('body', 'ArrowLeft')
  await page.waitForTimeout(200)
  await page.press('body', 'ArrowUp')
  await page.waitForTimeout(200)
  await page.press('body', 'ArrowUp')
  await page.waitForTimeout(200)
  await page.press('body', 'ArrowRight')
  await page.waitForTimeout(500)
  await page.press('body', 'b')
  await page.waitForTimeout(300)

  brinsItems = page.locator('.brin-item')
  checkedCount = 0

  for (let i = 0; i < await brinsItems.count(); i++) {
    const item = brinsItems.nth(i)
    const hasChecked = await item.evaluate(el => el.classList.contains('checked'))
    const title = await item.locator('.brin-item__title').textContent()
    if (hasChecked) {
      checkedCount++
      expect(title).toMatch(/Brin [AB]/)
    }
  }
  expect(checkedCount).toBe(2)
})
