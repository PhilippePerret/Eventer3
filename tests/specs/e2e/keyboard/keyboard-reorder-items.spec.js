import { installFixtures } from '../../../helpers/install-fixtures.js'
installFixtures('many-projects')

import { test, expect, pane1 } from '../__setup__.js'

test('Cmd+flèche permet de déplacer les items', async ({ page }) => {

    await page.goto('/')

    const items =
      pane1(page).locator('.project-item')

    await expect(items.nth(0))
      .toContainText('Projet A')

    await expect(items.nth(1))
      .toContainText('Projet B')

    await page.keyboard.press(
      'Meta+ArrowDown'
    )

    await expect(items.nth(0))
      .toContainText('Projet B')

    await expect(items.nth(1))
      .toContainText('Projet A')

    await page.keyboard.press(
      'Meta+ArrowUp'
    )

    await expect(items.nth(0))
      .toContainText('Projet A')

    await expect(items.nth(1))
      .toContainText('Projet B')

  }
)