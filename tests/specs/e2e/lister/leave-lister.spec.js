import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1 } from '../__setup__.js'

test.describe('← depuis un ListerEvent vers la liste des projets', () => {

  test.beforeEach(() => installFixtures('many-events'))

  test("← retourne à la liste des projets avec le projet courant sélectionné", async ({ page }) => {

    await page.goto('/')


    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)

    await pane1(page).locator('.event-item.selected').press('ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()

    await pane1(page).locator('.event-item.selected').press('ArrowLeft')

    await expect(pane1(page).locator('#projects-panel')).toBeVisible()

    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)


  })

})

test.describe('← depuis un sous-ListerEvent vers le ListerEvent parent', () => {

  test.beforeEach(() => installFixtures('deep-events'))

  test("← retourne au ListerEvent parent avec l'évènement courant sélectionné", async ({ page }) => {

    await page.goto('/')


    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)

    await pane1(page).locator('.event-item.selected').press('ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()

    await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
    await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Évènement un')

    await pane1(page).locator('.event-item.selected').press('ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    await expect(pane1(page).locator('.event-item')).toHaveCount(2)
    await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Évènement e4')

    await pane1(page).locator('.event-item.selected').press('ArrowLeft')

    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    await expect(pane1(page).locator('.event-item')).toHaveCount(3)

    await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
    await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Évènement un')


  })

})
