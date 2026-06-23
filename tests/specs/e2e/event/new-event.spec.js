// Origine : tests/specs/e2e/event/new-event.spec.js
import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1 } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

test("dans un EventLister, la touche « n » crée un nouvel Event après celui sélectionné", async ({ page }) => {

  await page.goto('/')

  console.log('\n=== TEST CRÉATION NOUVEL EVENT ===')

  console.log('-> attente du rendu initial')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)

  console.log('-> entrée dans le EventLister du premier projet')
  await pane1(page).locator('.project-item.selected').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)

  console.log('-> vérification : premier évènement sélectionné')
  await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  const firstEventTitle = await pane1(page).locator('.event-item').nth(0).textContent()

  console.log('-> appui sur n')
  await pane1(page).locator('#main-panel').press('n')

  console.log('-> vérification : un champ de saisie est apparu')
  const input = pane1(page).locator('.event-item [data-field="title"]')
  await expect(input).toBeVisible()
  await expect(input).toBeFocused()

  console.log('-> saisie du titre et validation')
  await input.fill('Nouvel évènement test')
  await input.press('Enter')

  console.log('-> vérification : le nouvel évènement est visible')
  const items = pane1(page).locator('.event-item')
  await expect(items).toHaveCount(4)

  console.log('-> vérification : le nouvel évènement est après le premier')
  await expect(items.nth(0)).toContainText(firstEventTitle.trim())
  await expect(items.nth(1)).toContainText('Nouvel évènement test')

  console.log('\n=== FIN TEST CRÉATION NOUVEL EVENT ===\n')

})
