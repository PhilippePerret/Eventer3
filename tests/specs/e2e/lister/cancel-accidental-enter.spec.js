import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

test.describe('← annule la création d\'un event dans un lister non-virtuel', () => {

  test.beforeEach(() => installFixtures('many-events'))

  test("← pendant la création d'un event retourne à la liste des projets", async ({ page }) => {

    await page.goto('/')

    console.log('\n=== TEST ← ANNULE CRÉATION EVENT ===')

    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)

    const eventCount = await page.locator('.event-item').count()
    console.log(`-> ${eventCount} events, appui sur n`)
    await page.keyboard.press('n')
    await expect(page.locator('.event-item input[name="title"]')).toBeVisible()

    console.log('-> ← pour annuler et revenir aux projets')
    await page.keyboard.press('ArrowLeft')

    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

    console.log('\n=== FIN TEST ← ANNULE CRÉATION EVENT ===\n')

  })

})

test.describe('Annulation entrée accidentelle dans un lister vide', () => {

  test.beforeEach(() => installFixtures('many-events'))

  test("Escape après → accidentel sur event sans sous-lister retourne au lister parent", async ({ page }) => {

    await page.goto('/')

    console.log('\n=== TEST ANNULATION ENTRÉE ACCIDENTELLE ===')

    console.log('-> attente liste des projets')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

    console.log('-> entrée dans le EventLister du projet A')
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)

    const eventCount = await page.locator('.event-item').count()
    console.log(`-> ${eventCount} events affichés, e1 sélectionné`)
    await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)

    console.log('-> → accidentel sur e1 (sans sous-lister) → lister virtuel + édition')
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel input.event-text')).toBeVisible()

    console.log('-> Escape pour annuler')
    await page.keyboard.press('Escape')

    console.log('-> vérification : retour au EventLister parent')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
    await expect(page.locator('.event-item')).toHaveCount(eventCount)

    console.log('-> vérification : e1 toujours sélectionné')
    await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)

    console.log('\n=== FIN TEST ANNULATION ENTRÉE ACCIDENTELLE ===\n')

  })

  test("← après → accidentel sur event sans sous-lister retourne au lister parent", async ({ page }) => {

    await page.goto('/')

    console.log('\n=== TEST ANNULATION ENTRÉE ACCIDENTELLE AVEC ← ===')

    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)

    const eventCount = await page.locator('.event-item').count()
    await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)

    console.log('-> → accidentel sur e1')
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel input.event-text')).toBeVisible()

    console.log('-> ← pour annuler')
    await page.keyboard.press('ArrowLeft')

    console.log('-> vérification : retour au EventLister parent')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
    await expect(page.locator('.event-item')).toHaveCount(eventCount)
    await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)

    console.log('\n=== FIN TEST ← ===\n')

  })

})
