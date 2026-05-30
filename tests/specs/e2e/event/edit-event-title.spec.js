import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

test("dans un EventLister, Enter passe l'event sélectionné en édition du titre", async ({ page }) => {

  await page.goto('/')

  console.log('\n=== TEST ÉDITION TITRE EVENT ===')

  console.log('-> entrée dans l\'EventLister du premier projet')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)

  console.log('-> vérification : premier event sélectionné')
  const firstItem = page.locator('.event-item').nth(0)
  await expect(firstItem).toHaveClass(/selected/)

  console.log('-> appui sur Enter → mise en édition')
  await page.keyboard.press('Enter')

  console.log('-> vérification : input visible avec le titre courant')
  const input = firstItem.locator('input[name="title"]')
  await expect(input).toBeVisible()
  await expect(input).toBeFocused()
  await expect(input).toHaveValue('Évènement un')

  console.log('-> saisie du nouveau titre et validation')
  await input.fill('Titre modifié')
  await page.keyboard.press('Enter')

  console.log('-> vérification : plus d\'input, titre mis à jour')
  await expect(firstItem.locator('input[name="title"]')).not.toBeVisible()
  await expect(firstItem).toContainText('Titre modifié')

  console.log('\n=== FIN TEST ÉDITION TITRE EVENT ===\n')

})

test("dans un EventLister, Escape annule l'édition et restaure le titre original", async ({ page }) => {

  await page.goto('/')

  console.log('\n=== TEST ANNULATION ÉDITION EVENT ===')

  console.log('-> entrée dans l\'EventLister du premier projet')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)

  console.log('-> vérification : premier event sélectionné')
  const firstItem = page.locator('.event-item').nth(0)
  await expect(firstItem).toHaveClass(/selected/)

  console.log('-> appui sur Enter → mise en édition')
  await page.keyboard.press('Enter')

  const input = firstItem.locator('input[name="title"]')
  await expect(input).toBeVisible()
  await expect(input).toHaveValue('Évènement un')

  console.log('-> saisie d\'un titre temporaire puis Escape')
  await input.fill('Titre temporaire')
  await page.keyboard.press('Escape')

  console.log('-> vérification : plus d\'input, titre original restauré')
  await expect(firstItem.locator('input[name="title"]')).not.toBeVisible()
  await expect(firstItem).toContainText('Évènement un')

  console.log('\n=== FIN TEST ANNULATION ÉDITION EVENT ===\n')

})
