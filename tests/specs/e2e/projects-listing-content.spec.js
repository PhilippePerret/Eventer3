import { test, expect } from '@playwright/test'

test.only('la liste affiche uniquement les projets actifs', async ({ page }) => {

  await page.goto('/')

  const listings = page.locator('.project-listing')

  await expect(listings).toHaveCount(3)

  await expect(page.locator('text=project-a')).toBeVisible()
  await expect(page.locator('text=project-b')).toBeVisible()
  await expect(page.locator('text=project-c')).toBeVisible()

  await expect(page.locator('text=project-hidden')).toHaveCount(0)

})