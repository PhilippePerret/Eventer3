import { test, expect, pane1 } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

// Helper : sélectionne le premier event du projet actif
async function selectFirstEvent(page) {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  await pane1(page).locator('body').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  await expect(pane1(page).locator('.event-item').first()).toBeVisible()
}

test('k sur item sélectionné → mémorise la cible + notification', async ({ page }) => {
  await selectFirstEvent(page)
  const title = await pane1(page).locator('.event-item.selected .event-text').textContent()
  const id    = await pane1(page).locator('.event-item.selected').getAttribute('data-id')
  await pane1(page).locator('body').press('k')
  await expect(pane1(page).locator('.notification')).toBeVisible()
  const notif = await pane1(page).locator('.notification').textContent()
  expect(notif).toContain(title.trim())
})

test('k deux fois sur le même item → alerte doublon, pas de doublon dans targets', async ({ page }) => {
  await selectFirstEvent(page)
  await pane1(page).locator('body').press('k')
  await expect(pane1(page).locator('.notification')).toBeVisible()
  await pane1(page).locator('.notification').waitFor({ state: 'hidden' })
  await pane1(page).locator('body').press('k')
  await expect(pane1(page).locator('.notification')).toBeVisible()
  const notif = await pane1(page).locator('.notification').textContent()
  expect(notif.toLowerCase()).toMatch(/déjà|doublon/)
})

test('⌘+k en édition → TargetsPanel s\'ouvre avec la cible mémorisée', async ({ page }) => {
  await selectFirstEvent(page)
  const id    = await pane1(page).locator('.event-item.selected').getAttribute('data-id')
  const title = await pane1(page).locator('.event-item.selected .event-text').textContent()
  await pane1(page).locator('body').press('k')
  await expect(pane1(page).locator('.notification')).toBeVisible()
  await pane1(page).locator('.notification').waitFor({ state: 'hidden' })

  // Passe sur un autre event + entre en édition
  await pane1(page).locator('body').press('ArrowDown')
  await pane1(page).locator('body').press('Enter')
  await expect(pane1(page).locator('.event-item.editing input[name="title"]')).toBeFocused()

  await pane1(page).locator('body').press('Meta+k')
  await expect(pane1(page).locator('.targets-panel')).toBeVisible()
  await expect(pane1(page).locator('.floating-panel__item')).toHaveCount(1)
  await expect(pane1(page).locator('.floating-panel__item').first()).toContainText(title.trim())
})

test('Enter dans TargetsPanel → insère [title](id) au curseur', async ({ page }) => {
  await selectFirstEvent(page)
  const id    = await pane1(page).locator('.event-item.selected').getAttribute('data-id')
  const title = await pane1(page).locator('.event-item.selected .event-text').textContent()
  await pane1(page).locator('body').press('k')
  await pane1(page).locator('.notification').waitFor({ state: 'hidden' })

  await pane1(page).locator('body').press('ArrowDown')
  await pane1(page).locator('body').press('Enter')
  const field = pane1(page).locator('.event-item.editing input[name="title"]')
  await expect(field).toBeFocused()
  await field.fill('avant ')

  await pane1(page).locator('body').press('Meta+k')
  await expect(pane1(page).locator('.targets-panel')).toBeVisible()
  await pane1(page).locator('body').press('Enter')
  await expect(pane1(page).locator('.targets-panel')).not.toBeVisible()

  const val = await field.inputValue()
  const t   = title.trim()
  expect(val).toBe(`avant [${t}](${id})`)

  // Le titre entre crochets doit être sélectionné pour modification immédiate
  const sel = await field.evaluate(el => ({ start: el.selectionStart, end: el.selectionEnd }))
  const linkStart = val.indexOf('[') + 1   // après le '['
  expect(sel.start).toBe(linkStart)
  expect(sel.end).toBe(linkStart + t.length)
})

test('⌘+Enter dans TargetsPanel → ferme sans insérer', async ({ page }) => {
  await selectFirstEvent(page)
  await pane1(page).locator('body').press('k')
  await pane1(page).locator('.notification').waitFor({ state: 'hidden' })

  await pane1(page).locator('body').press('ArrowDown')
  await pane1(page).locator('body').press('Enter')
  const field = pane1(page).locator('.event-item.editing input[name="title"]')
  await expect(field).toBeFocused()
  const before = await field.inputValue()

  await pane1(page).locator('body').press('Meta+k')
  await expect(pane1(page).locator('.targets-panel')).toBeVisible()
  await pane1(page).locator('body').press('Meta+Enter')
  await expect(pane1(page).locator('.targets-panel')).not.toBeVisible()

  const after = await field.inputValue()
  expect(after).toBe(before)
})

test('targets persistées : rechargement → cibles toujours présentes', async ({ page }) => {
  await selectFirstEvent(page)
  const id    = await pane1(page).locator('.event-item.selected').getAttribute('data-id')
  const title = await pane1(page).locator('.event-item.selected .event-text').textContent()
  await pane1(page).locator('body').press('k')
  await pane1(page).locator('.notification').waitFor({ state: 'hidden' })

  await page.reload()
  await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  await pane1(page).locator('body').press('ArrowRight')
  await expect(pane1(page).locator('.event-item').first()).toBeVisible()
  await pane1(page).locator('body').press('ArrowDown')
  await pane1(page).locator('body').press('Enter')
  await expect(pane1(page).locator('.event-item.editing input[name="title"]')).toBeFocused()

  await pane1(page).locator('body').press('Meta+k')
  await expect(pane1(page).locator('.targets-panel')).toBeVisible()
  await expect(pane1(page).locator('.floating-panel__item').first()).toContainText(title.trim())
})
