import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

// Validité des contenus de l'aide contextuelle par contexte
// (quels raccourcis apparaissent dans quels contextes)

test.describe('Aide contextuelle — contenus par contexte', () => {

  test.describe('ListerProject', () => {

    test.beforeEach(() => installFixtures('many-projects'))

    test('⌦ présent quand plusieurs projets', async ({ page }) => {
      await page.goto('/')
      await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
      await pane1(page).locator('#main-panel').press('Meta+?')
      await expect(pane1(page).locator('.contextual-help')).toContainText('⌦')
      await pane1(page).locator('#main-panel').press('Escape')
    })

  })

})
