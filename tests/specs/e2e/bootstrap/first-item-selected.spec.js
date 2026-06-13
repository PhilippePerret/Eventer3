import { installFixtures } from '../../../helpers/install-fixtures.js'
installFixtures('many-projects')

import { test, expect, pane1 } from '../__setup__.js'

test(
  'le premier item du listing est sélectionné',
  async ({ page }) => {

    await page.goto('/')

    const items = pane1(page).locator('.project-item')

    await expect(items).toHaveCount(3)

    await expect(items.nth(0)).toHaveClass(/selected/)
    await expect(items.nth(1)).not.toHaveClass(/selected/)
    await expect(items.nth(2)).not.toHaveClass(/selected/)

  }
)