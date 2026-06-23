import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1 } from '../__setup__.js'

/**
 * Fixture 'navigation' :
 *   Projet A (1er) — sans events
 *   Projet B (2e)  — events niveau 1 : e1, e2 (a des enfants), e3
 *                    e2 → e4, e5 (niveau 2)
 */

test.describe('Navigation basique', () => {

  test.beforeEach(() => installFixtures('navigation'))

  test('Navigation complète : projets → events → sous-events → retour', async ({ page }) => {
    await page.goto('/')

    // Liste des projets, Projet A sélectionné (premier)
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)

    // Naviguer sur Projet B (deuxième)
    await pane1(page).locator('#main-panel').press('ArrowDown')
    await expect(pane1(page).locator('.project-item').nth(1)).toHaveClass(/selected/)

    // Entrer dans Projet B
    await pane1(page).locator('.project-item.selected').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)

    // Tous les events de niveau 1 affichés, le premier sélectionné
    await expect(pane1(page).locator('.event-item')).toHaveCount(3)
    await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)

    // Naviguer vers e2 (qui a des enfants)
    await pane1(page).locator('#main-panel').press('ArrowDown')
    await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)

    // e2 doit afficher un indicateur d'enfants
    await expect(pane1(page).locator('.event-item.selected .child-indicator')).toBeVisible()

    // Entrer dans le sous-lister de e2
    await pane1(page).locator('.event-item.selected').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    await expect(pane1(page).locator('.event-item')).toHaveCount(2)

    // Revenir au lister parent (niveau 1)
    await pane1(page).locator('#main-panel').press('ArrowLeft')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    await expect(pane1(page).locator('.event-item')).toHaveCount(3)

    // e2 doit être sélectionné (celui d'où on est parti)
    await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)

    // Revenir à la liste des projets
    await pane1(page).locator('#main-panel').press('ArrowLeft')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)

    // Projet B doit être sélectionné (le deuxième, celui d'où on est parti)
    await expect(pane1(page).locator('.project-item').nth(1)).toHaveClass(/selected/)
  })

})
