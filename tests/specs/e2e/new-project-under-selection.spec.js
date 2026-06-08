import { installFixtures } from '../../helpers/install-fixtures'
installFixtures('many-projects')

import { test, expect } from './__setup__.js'

test('la touche n crée un nouveau projet vide en dessous de la sélection', async ({ page }) => {
  await page.goto('/')

  const items = page.locator('.project-item')

  await expect(items).toHaveCount(3)

  await page.keyboard.press('ArrowDown')
  await expect(items.nth(1)).toHaveClass(/selected/)

  await page.keyboard.press('n')

  await expect(items).toHaveCount(4)
  await expect(items.nth(0)).toContainText('Projet A')
  await expect(items.nth(1)).toContainText('Projet B')
  await expect(items.nth(2)).toHaveClass(/selected/)
  const titleInput = items.nth(2).locator('input[name="title"]')
  const idInput = items.nth(2).locator('input[name="id"]')

  await expect(titleInput).toHaveAttribute('placeholder', 'Titre du nouveau projet')
  await expect(titleInput).toHaveValue('')
  await expect(idInput).toHaveAttribute('placeholder', 'identifiant')
  await expect(idInput).toHaveValue('')
})