//Origine: tests/specs/e2e/project/new-sans-title-cancel-create.spec.js
import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-projects')
})

test('Annuler dans le FilePicker ne crée pas de projet', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()

  const items = pane1(page).locator('.project-item')
  const countBefore = await items.count()

  await press(page, 'n')
  await expect(pane1(page).locator('.file-picker')).toBeVisible()
  await press(page, 'Tab')    // focus path
  await press(page, 'Tab')    // focus Annuler
  await press(page, 'Enter')  // déclenche _cancel()
  await expect(pane1(page).locator('.file-picker')).not.toBeVisible()

  await expect(items).toHaveCount(countBefore)
})

test('la touche Entrée sans titre : l\'éditeur reste visible', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()

  await press(page, 'n')
  await press(page, 'Enter')

  await expect(pane1(page).locator('.project-item [data-field="title"]')).toBeVisible()
})

test('la touche Entrée sans titre : aucun projet créé', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()

  const items = pane1(page).locator('.project-item')
  const countBefore = await items.count()

  await press(page, 'n')
  await press(page, 'Enter')
  await press(page, 'Escape')

  await expect(items).toHaveCount(countBefore)
})
