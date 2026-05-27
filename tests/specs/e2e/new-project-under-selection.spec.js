import { installFixtures } from '../../helpers/install-fixtures'
installFixtures('many-projects')

import { test, expect } from '@playwright/test'

test.only('la touche n crée un nouveau projet vide au-dessus de la sélection', async ({ page }) => {
  await page.goto('/')

  const items = page.locator('.project-item')

  await expect(items).toHaveCount(3)

  await page.keyboard.press('ArrowDown')
  await expect(items.nth(1)).toHaveClass(/selected/)

  await page.keyboard.press('n')

  await expect(items).toHaveCount(4)
  await expect(items.nth(0)).toContainText('Projet A')
  await expect(items.nth(1)).toHaveClass(/selected/)
  await expect(items.nth(1).locator('input')).toHaveAttribute('placeholder', 'Titre du nouveau projet')
  await expect(items.nth(1).locator('input')).toHaveValue('')
  await expect(items.nth(2)).toContainText('Projet B')
})