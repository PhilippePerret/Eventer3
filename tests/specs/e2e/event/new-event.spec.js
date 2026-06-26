// Origine : tests/specs/e2e/event/new-event.spec.js
import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1 } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

test("dans un ListerEvent, la touche « n » crée un nouvel Event après celui sélectionné", async ({ page }) => {

  await page.goto('/')


  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)

  await pane1(page).locator('.project-item.selected').press('ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()

  await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  const firstEventTitle = await pane1(page).locator('.event-item').nth(0).textContent()

  await pane1(page).locator('.event-item.selected').press('n')

  const input = pane1(page).locator('.event-item [data-field="title"]')
  await expect(input).toBeVisible()
  await expect(input).toBeFocused()

  await input.fill('Nouvel évènement test')
  await input.press('Enter')

  const items = pane1(page).locator('.event-item')
  await expect(items).toHaveCount(4)

  await expect(items.nth(0)).toContainText(firstEventTitle.trim())
  await expect(items.nth(1)).toContainText('Nouvel évènement test')


})
