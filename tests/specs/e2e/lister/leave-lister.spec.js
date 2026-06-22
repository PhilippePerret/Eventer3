import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1 } from '../__setup__.js'

test.describe('← depuis un EventLister vers la liste des projets', () => {

  test.beforeEach(() => installFixtures('many-events'))

  test("← retourne à la liste des projets avec le projet courant sélectionné", async ({ page }) => {

    await page.goto('/')

    console.log('\n=== TEST RETOUR VERS PROJETS ===')

    console.log('-> attente du rendu initial')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)

    console.log('-> entrée dans le EventLister du premier projet')
    await pane1(page).locator('#main-panel').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)

    console.log('-> appui sur ←')
    await pane1(page).locator('#main-panel').press('ArrowLeft')

    console.log('-> vérification : retour à la liste des projets')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)

    console.log('-> vérification : le projet d\'origine est sélectionné')
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)

    console.log('\n=== FIN TEST RETOUR VERS PROJETS ===\n')

  })

})

test.describe('← depuis un sous-EventLister vers le EventLister parent', () => {

  test.beforeEach(() => installFixtures('deep-events'))

  test("← retourne au EventLister parent avec l'évènement courant sélectionné", async ({ page }) => {

    await page.goto('/')

    console.log('\n=== TEST RETOUR VERS EVÈNEMENCIER PARENT ===')

    console.log('-> attente du rendu initial')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)

    console.log('-> entrée dans le EventLister du projet')
    await pane1(page).locator('#main-panel').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)

    console.log('-> vérification : premier évènement (e1) sélectionné')
    await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
    await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Évènement un')

    console.log('-> entrée dans le sous-EventLister de e1')
    await pane1(page).locator('#main-panel').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    await expect(pane1(page).locator('.event-item')).toHaveCount(2)
    await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Évènement e4')

    console.log('-> appui sur ←')
    await pane1(page).locator('#main-panel').press('ArrowLeft')

    console.log('-> vérification : retour au EventLister parent')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    await expect(pane1(page).locator('.event-item')).toHaveCount(3)

    console.log('-> vérification : e1 est sélectionné')
    await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
    await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Évènement un')

    console.log('\n=== FIN TEST RETOUR VERS EVÈNEMENCIER PARENT ===\n')

  })

})
