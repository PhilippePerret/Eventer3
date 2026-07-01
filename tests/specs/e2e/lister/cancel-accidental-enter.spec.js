import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

test.describe('← annule la création d\'un event dans un lister non-virtuel', () => {

  test.beforeEach(() => installFixtures('many-events'))

  test("← pendant la création d'un event retourne à la liste des projets", async ({ page }) => {

    await page.goto('/')


    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    await press(page, 'ArrowRight')
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()

    const eventCount = await pane1(page).locator('.event-item').count()
    await press(page, 'n')
    await expect(pane1(page).locator('.event-item input[name="title"]')).toBeVisible()

    await press(page, 'ArrowLeft')

    await expect(pane1(page).locator('#projects-panel')).toBeVisible()


  })

})

test.describe('Annulation entrée accidentelle dans un lister vide', () => {

  test.beforeEach(() => installFixtures('many-events'))

  test("Escape après → accidentel sur event sans sous-lister retourne au lister parent", async ({ page }) => {

    await page.goto('/')


    await expect(pane1(page).locator('#projects-panel')).toBeVisible()

    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()

    const eventCount = await pane1(page).locator('.event-item').count()
    await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)

    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel input.event-text')).toBeVisible()

    await press(page, 'Escape')

    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    await expect(pane1(page).locator('.event-item')).toHaveCount(eventCount)

    await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)


  })

  test("← après → accidentel sur event sans sous-lister retourne au lister parent", async ({ page }) => {

    await page.goto('/')


    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    await press(page, 'ArrowRight')
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()

    const eventCount = await pane1(page).locator('.event-item').count()
    await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)

    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel input.event-text')).toBeVisible()

    await press(page, 'ArrowLeft')

    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    await expect(pane1(page).locator('.event-item')).toHaveCount(eventCount)
    await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)


  })

})
