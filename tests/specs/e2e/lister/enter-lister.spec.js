import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1 } from '../__setup__.js'

test.describe('→ entre dans le Lister', () => {

  test.beforeEach(() => installFixtures('many-projects'))

  test("la touche → entre dans le Lister de l'item sélectionné", async ({ page }) => {

    await page.goto('/')

    console.log('\n=== TEST ENTRÉE DANS UN LISTER ===')

    console.log('-> vérification état initial : ListerProject affiché')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()

    console.log('-> vérification : premier projet sélectionné')
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)

    console.log('-> appui sur →')
    await pane1(page).locator('.event-item.selected').press('ArrowRight')

    console.log('-> vérification : on est dans l\'ListerEvent du projet')
    await expect(pane1(page).locator('#events-panel')).not.toHaveClass(/project-list/)
    await expect(pane1(page).locator('#events-panel')).toBeVisible()

    console.log('\n=== FIN TEST ENTRÉE DANS UN LISTER ===\n')

  })

})

test.describe('→ charge les events du projet', () => {

  test.beforeEach(() => installFixtures('many-events'))

  test("→ sur un projet charge et affiche ses events", async ({ page }) => {

    await page.goto('/')

    console.log('\n=== TEST CHARGEMENT EVENTS ===')

    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)

    console.log('-> appui sur →')
    await pane1(page).locator('.event-item.selected').press('ArrowRight')

    await expect(pane1(page).locator('#events-panel')).toBeVisible()

    console.log('-> vérification : des events sont affichés')
    await expect(pane1(page).locator('.event-item')).not.toHaveCount(0)
    await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Évènement un')

    console.log('\n=== FIN TEST CHARGEMENT EVENTS ===\n')

  })

})
