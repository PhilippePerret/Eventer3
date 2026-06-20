import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1 } from '../__setup__.js'

// Fixture level-mode-mixed :
//   Liste#2 (depth=1) : [e1 "Acte I", e2 "Acte II", e3 "Acte III"]
//   Liste#3 (depth=2, enfant e1) : [e11 "Séquence 1 de Acte I"]
//   (e2 sans sous-liste → virtuel en LEVEL depth=2)
//   Liste#4 (depth=2, enfant e3) : [e31 "Séquence 1 de Acte III"]
// En LEVEL depth=2 : [e11 (réel), "Acte II +1" (virtuel), e31 (réel)]

test.beforeEach(() => {
  installFixtures('level-mode-mixed')
})

async function enterLevelMode(page) {
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await pane1(page).locator('body').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  await pane1(page).locator('body').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  await pane1(page).locator('body').press('Meta+m')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
  await expect(pane1(page).locator('.event-item')).toHaveCount(3)
}

test("LEVEL mode : item réel après un virtuel est sélectionnable et éditable", async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page)

  console.log('\n=== TEST ÉDITION DERNIER ITEM RÉEL EN LEVEL MODE ===')

  console.log('-> sélection initiale : e11')
  await expect(pane1(page).locator('.event-item[data-id="e11"]')).toHaveClass(/selected/)

  console.log('-> ↓ : saute le virtuel, sélectionne e31')
  await pane1(page).locator('body').press('ArrowDown')
  await expect(pane1(page).locator('.event-item[data-id="e31"]')).toHaveClass(/selected/)

  console.log('-> Enter : édition de e31')
  await pane1(page).locator('body').press('Enter')
  const input = pane1(page).locator('.event-item[data-id="e31"] input[name="title"]')
  await expect(input).toBeVisible()
  await expect(input).toBeFocused()
  await expect(input).toHaveValue('Séquence 1 de Acte III')

  console.log('\n=== FIN ===\n')
})
