import { installFixtures } from '../../helpers/install-fixtures'
installFixtures('many-projects')

import { test, expect } from '@playwright/test'

test('la liste affiche uniquement les projets actifs', async ({ page }) => {

  await page.goto('/')

  const listing = page.locator('#main-panel > .project-list')

  await expect(listing.locator('.project-item')).toHaveCount(3)

  await expect(page.locator('text=project-a')).toBeVisible()
  await expect(page.locator('text=project-b')).toBeVisible()
  await expect(page.locator('text=project-c')).toBeVisible()

  await expect(page.locator('text=project-hidden')).toHaveCount(0)

})