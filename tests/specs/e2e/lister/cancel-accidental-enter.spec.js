import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1 } from '../__setup__.js'

test.describe('← annule la création d\'un event dans un lister non-virtuel', () => {

  test.beforeEach(() => installFixtures('many-events'))

  test("← pendant la création d'un event retourne à la liste des projets", async ({ page }) => {

    await page.goto('/')

    console.log('\n=== TEST ← ANNULE CRÉATION EVENT ===')

    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    await pane1(page).locator('#main-panel').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)

    const eventCount = await pane1(page).locator('.event-item').count()
    console.log(`-> ${eventCount} events, appui sur n`)
    await pane1(page).locator('#main-panel').press('n')
    await expect(pane1(page).locator('.event-item input[name="title"]')).toBeVisible()

    console.log('-> ← pour annuler et revenir aux projets')
    await pane1(page).locator('#main-panel').press('ArrowLeft')

    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)

    console.log('\n=== FIN TEST ← ANNULE CRÉATION EVENT ===\n')

  })

})

test.describe('Annulation entrée accidentelle dans un lister vide', () => {

  test.beforeEach(() => installFixtures('many-events'))

  test("Escape après → accidentel sur event sans sous-lister retourne au lister parent", async ({ page }) => {

    await page.goto('/')

    console.log('\n=== TEST ANNULATION ENTRÉE ACCIDENTELLE ===')

    console.log('-> attente liste des projets')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)

    console.log('-> entrée dans le ListerEvent du projet A')
    await pane1(page).locator('#main-panel').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)

    const eventCount = await pane1(page).locator('.event-item').count()
    console.log(`-> ${eventCount} events affichés, e1 sélectionné`)
    await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)

    console.log('-> → accidentel sur e1 (sans sous-lister) → lister virtuel + édition')
    await pane1(page).locator('#main-panel').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel input.event-text')).toBeVisible()

    console.log('-> Escape pour annuler')
    await pane1(page).locator('#main-panel').press('Escape')

    console.log('-> vérification : retour au ListerEvent parent')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    await expect(pane1(page).locator('.event-item')).toHaveCount(eventCount)

    console.log('-> vérification : e1 toujours sélectionné')
    await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)

    console.log('\n=== FIN TEST ANNULATION ENTRÉE ACCIDENTELLE ===\n')

  })

  test("← après → accidentel sur event sans sous-lister retourne au lister parent", async ({ page }) => {

    await page.goto('/')

    console.log('\n=== TEST ANNULATION ENTRÉE ACCIDENTELLE AVEC ← ===')

    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    await pane1(page).locator('#main-panel').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)

    const eventCount = await pane1(page).locator('.event-item').count()
    await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)

    console.log('-> → accidentel sur e1')
    await pane1(page).locator('#main-panel').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel input.event-text')).toBeVisible()

    console.log('-> ← pour annuler')
    await pane1(page).locator('#main-panel').press('ArrowLeft')

    console.log('-> vérification : retour au ListerEvent parent')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    await expect(pane1(page).locator('.event-item')).toHaveCount(eventCount)
    await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)

    console.log('\n=== FIN TEST ← ===\n')

  })

})
