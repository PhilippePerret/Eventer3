import { test, expect } from '../../e2e/__setup__.js'

test.only('l’application démarre correctement', async ({ page }) => {
  page.on('pageerror', error => console.error(error))
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveCount(1)
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await expect(page.locator('.project-list')).toHaveCount(1)
  await expect(page.locator('.project-item')).toHaveCount(3)
  await expect(page.locator('.project-item').nth(0)).toContainText('Projet A')
  await expect(page.locator('.project-item').nth(1)).toContainText('Projet B')
  await expect(page.locator('.project-item').nth(2)).toContainText('Projet C')
})