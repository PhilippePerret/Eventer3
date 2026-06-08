import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

test("dans un EventLister, la touche « n » crée un nouvel Event après celui sélectionné", async ({ page }) => {

  await page.goto('/')

  console.log('\n=== TEST CRÉATION NOUVEL EVENT ===')

  console.log('-> attente du rendu initial')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)

  console.log('-> entrée dans le EventLister du premier projet')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)

  console.log('-> vérification : premier évènement sélectionné')
  await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)
  const firstEventTitle = await page.locator('.event-item').nth(0).textContent()

  console.log('-> appui sur n')
  await page.keyboard.press('n')

  console.log('-> vérification : un champ de saisie est apparu')
  const input = page.locator('.event-item input[name="title"]')
  await expect(input).toBeVisible()
  await expect(input).toBeFocused()

  console.log('-> saisie du titre et validation')
  await page.keyboard.type('Nouvel évènement test')
  await page.keyboard.press('Enter')

  console.log('-> vérification : le nouvel évènement est visible')
  const items = page.locator('.event-item')
  await expect(items).toHaveCount(4)

  console.log('-> vérification : le nouvel évènement est après le premier')
  await expect(items.nth(0)).toContainText(firstEventTitle.trim())
  await expect(items.nth(1)).toContainText('Nouvel évènement test')

  console.log('\n=== FIN TEST CRÉATION NOUVEL EVENT ===\n')

})
