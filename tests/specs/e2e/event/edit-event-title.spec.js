import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1 } from '../__setup__.js'

const EVENT_TITLE = `Nouveau à ${new Date().toISOString()}`

test.beforeEach(() => {
  installFixtures('many-events')
})

async function enterEventList(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await pane1(page).locator('.project-item.selected').press('ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
}

test("dans un ListerEvent, Enter passe l'event sélectionné en édition du titre", async ({ page }) => {

  await page.goto('/')

  console.log('\n=== TEST ÉDITION TITRE EVENT ===')

  console.log('-> entrée dans l\'ListerEvent du premier projet')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await pane1(page).locator('.project-item.selected').press('ArrowRight').press('ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()

  console.log('-> vérification : premier event sélectionné')
  const firstItem = pane1(page).locator('.event-item').nth(0)
  await expect(firstItem).toHaveClass(/selected/)

  console.log('-> appui sur Enter → mise en édition')
  await pane1(page).locator('.event-item.selected').press('Enter')

  console.log('-> vérification : input visible avec le titre courant')
  const input = firstItem.locator('input[name="title"]')
  await expect(input).toBeVisible()
  await expect(input).toBeFocused()
  await expect(input).toHaveValue('Évènement un')

  console.log('-> saisie du nouveau titre et validation')
  await input.fill('Titre modifié')
  await pane1(page).locator('.event-item.selected').press('Enter')

  console.log('-> vérification : plus d\'input, titre mis à jour')
  await expect(firstItem.locator('input[name="title"]')).not.toBeVisible()
  await expect(firstItem).toContainText('Titre modifié')

  console.log('\n=== FIN TEST ÉDITION TITRE EVENT ===\n')

})

test("dans un ListerEvent, Escape annule l'édition et restaure le titre original", async ({ page }) => {

  await page.goto('/')

  console.log('\n=== TEST ANNULATION ÉDITION EVENT ===')

  console.log('-> entrée dans l\'ListerEvent du premier projet')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await pane1(page).locator('.project-item.selected').press('ArrowRight').press('ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()

  console.log('-> vérification : premier event sélectionné')
  const firstItem = pane1(page).locator('.event-item').nth(0)
  await expect(firstItem).toHaveClass(/selected/)

  console.log('-> appui sur Enter → mise en édition')
  await pane1(page).locator('.event-item.selected').press('Enter')

  const input = firstItem.locator('input[name="title"]')
  await expect(input).toBeVisible()
  await expect(input).toHaveValue('Évènement un')

  console.log('-> saisie d\'un titre temporaire puis Escape')
  await input.fill('Titre temporaire')
  await pane1(page).locator('.event-item.selected').press('Escape')

  console.log('-> vérification : plus d\'input, titre original restauré')
  await expect(firstItem.locator('input[name="title"]')).not.toBeVisible()
  await expect(firstItem).toContainText('Évènement un')

  console.log('\n=== FIN TEST ANNULATION ÉDITION EVENT ===\n')

})

test('ArrowDown pendant édition du titre ne sélectionne pas le suivant', async ({ page }) => {
  await enterEventList(page)
  await pane1(page).locator('.event-item.selected').press('ArrowDown')
  await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)
  await pane1(page).locator('.event-item.selected').press('Enter')
  await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/editing/)
  const title = pane1(page).locator('.event-item.editing [data-field="title"]')
  await expect(title).toBeVisible()
  await title.press('ArrowDown')
  await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/editing/)
  await expect(pane1(page).locator('.event-item').nth(2)).not.toHaveClass(/selected/)
})

test('ArrowUp pendant édition du titre ne sélectionne pas le précédent', async ({ page }) => {
  await enterEventList(page)
  await pane1(page).locator('.event-item.selected').press('ArrowDown')
  await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)
  await pane1(page).locator('.event-item.selected').press('Enter')
  await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/editing/)
  const title = pane1(page).locator('.event-item.editing [data-field="title"]')
  await expect(title).toBeVisible()
  await title.press('ArrowUp')
  await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/editing/)
  await expect(pane1(page).locator('.event-item').nth(0)).not.toHaveClass(/selected/)
})

test('titre persisté en mémoire : retour et re-entrée dans le projet', async ({ page }) => {
  await enterEventList(page)
  await pane1(page).locator('.event-item.selected').press('n')
  const input = pane1(page).locator('.event-item.editing [data-field="title"]')
  await expect(input).toBeVisible()
  await input.fill(EVENT_TITLE)
  await pane1(page).locator('.event-item.selected').press('Enter')
  await pane1(page).locator('.event-item.selected').press('ArrowLeft')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await pane1(page).locator('.project-item.selected').press('ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await expect(pane1(page).locator('.event-item').filter({ hasText: EVENT_TITLE })).toBeVisible()
})

test('titre persisté en DB : rechargement de la page', async ({ page }) => {
  await enterEventList(page)
  await pane1(page).locator('.event-item.selected').press('n')
  const input = pane1(page).locator('.event-item.editing [data-field="title"]')
  await expect(input).toBeVisible()
  await input.fill(EVENT_TITLE)
  await pane1(page).locator('.event-item.selected').press('Enter')
  await page.reload()
  await pane1(page).locator('.project-item.selected').press('ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await expect(pane1(page).locator('.event-item').filter({ hasText: EVENT_TITLE })).toBeVisible()
})
