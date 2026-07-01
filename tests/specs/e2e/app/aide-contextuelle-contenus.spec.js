// Origine: tests/specs/e2e/app/aide-contextuelle-contenus.spec.js
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

// Validité des contenus de l'aide contextuelle par contexte
// (quels raccourcis apparaissent dans quels contextes)

test.describe('Aide contextuelle — contenus par contexte', () => {

  test.describe('ListerProject', () => {

    test.beforeEach(() => installFixtures('many-projects'))

    test('⌦ présent quand plusieurs projets', async ({ page }) => {
      await page.goto('/')
      await expect(pane1(page).locator('#projects-panel')).toBeVisible()
      await press(page, 'Meta+?')
      await expect(pane1(page).locator('.contextual-help')).toContainText('⌦')
      await press(page, 'Meta+Enter')
    })

  })

})
