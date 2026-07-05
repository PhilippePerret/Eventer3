//Origine: tests/specs/e2e/lister/enter-lister.spec.js
import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

test.describe('→ entre dans le Lister', () => {

  test.beforeEach(() => installFixtures('many-projects'))

  test("la touche → entre dans le Lister de l'item sélectionné", async ({ page }) => {

    await page.goto('/')


    await expect(pane1(page).locator('#projects-panel')).toBeVisible()

    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)

    await press(page, 'ArrowRight')

    await expect(pane1(page).locator('#events-panel')).not.toHaveClass(/project-list/)
    await expect(pane1(page).locator('#events-panel')).toBeVisible()


  })

})

test.describe('→ charge les events du projet', () => {

  test.beforeEach(() => installFixtures('many-events'))

  test("→ sur un projet charge et affiche ses events", async ({ page }) => {

    await page.goto('/')


    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)

    await press(page, 'ArrowRight')

    await expect(pane1(page).locator('#events-panel')).toBeVisible()

    await expect(pane1(page).locator('.event-item')).not.toHaveCount(0)
    await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Évènement un')


  })

})
