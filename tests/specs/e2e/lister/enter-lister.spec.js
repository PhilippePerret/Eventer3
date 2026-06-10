import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

test.describe('→ entre dans le Lister', () => {

  test.beforeEach(() => installFixtures('many-projects'))

  test("la touche → entre dans le Lister de l'item sélectionné", async ({ page }) => {

    await page.goto('/')

    console.log('\n=== TEST ENTRÉE DANS UN LISTER ===')

    console.log('-> vérification état initial : ProjectLister affiché')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

    console.log('-> vérification : premier projet sélectionné')
    await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)

    console.log('-> appui sur →')
    await page.keyboard.press('ArrowRight')

    console.log('-> vérification : on est dans l\'EventLister du projet')
    await expect(page.locator('#main-panel')).not.toHaveClass(/project-list/)
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)

    console.log('\n=== FIN TEST ENTRÉE DANS UN LISTER ===\n')

  })

})

test.describe('→ charge les events du projet', () => {

  test.beforeEach(() => installFixtures('many-events'))

  test("→ sur un projet charge et affiche ses events", async ({ page }) => {

    await page.goto('/')

    console.log('\n=== TEST CHARGEMENT EVENTS ===')

    await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)

    console.log('-> appui sur →')
    await page.keyboard.press('ArrowRight')

    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)

    console.log('-> vérification : des events sont affichés')
    await expect(page.locator('.event-item')).not.toHaveCount(0)
    await expect(page.locator('.event-item').nth(0)).toContainText('Évènement un')

    console.log('\n=== FIN TEST CHARGEMENT EVENTS ===\n')

  })

})
