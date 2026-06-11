import { test, expect } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

// Helper : sélectionne le premier event du projet actif
async function selectFirstEvent(page) {
  await page.goto('/')
  await expect(page.locator('.project-item').first()).toHaveClass(/selected/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  await expect(page.locator('.event-item').first()).toBeVisible()
}

test('k sur item sélectionné → mémorise la cible + notification', async ({ page }) => {
  await selectFirstEvent(page)
  const title = await page.locator('.event-item.selected .event-text').textContent()
  const id    = await page.locator('.event-item.selected').getAttribute('data-id')
  await page.keyboard.press('k')
  await expect(page.locator('.notification')).toBeVisible()
  const notif = await page.locator('.notification').textContent()
  expect(notif).toContain(title.trim())
})

test('k deux fois sur le même item → alerte doublon, pas de doublon dans targets', async ({ page }) => {
  await selectFirstEvent(page)
  await page.keyboard.press('k')
  await expect(page.locator('.notification')).toBeVisible()
  await page.locator('.notification').waitFor({ state: 'hidden' })
  await page.keyboard.press('k')
  await expect(page.locator('.notification')).toBeVisible()
  const notif = await page.locator('.notification').textContent()
  expect(notif.toLowerCase()).toMatch(/déjà|doublon/)
})

test('⌘+k en édition → TargetsPanel s\'ouvre avec la cible mémorisée', async ({ page }) => {
  await selectFirstEvent(page)
  const id    = await page.locator('.event-item.selected').getAttribute('data-id')
  const title = await page.locator('.event-item.selected .event-text').textContent()
  await page.keyboard.press('k')
  await expect(page.locator('.notification')).toBeVisible()
  await page.locator('.notification').waitFor({ state: 'hidden' })

  // Passe sur un autre event + entre en édition
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await expect(page.locator('.event-item.editing input[name="title"]')).toBeFocused()

  await page.keyboard.press('Meta+k')
  await expect(page.locator('.targets-panel')).toBeVisible()
  await expect(page.locator('.targets-panel__item')).toHaveCount(1)
  await expect(page.locator('.targets-panel__item').first()).toContainText(title.trim())
})

test('Enter dans TargetsPanel → insère [title](id) au curseur', async ({ page }) => {
  await selectFirstEvent(page)
  const id    = await page.locator('.event-item.selected').getAttribute('data-id')
  const title = await page.locator('.event-item.selected .event-text').textContent()
  await page.keyboard.press('k')
  await page.locator('.notification').waitFor({ state: 'hidden' })

  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  const field = page.locator('.event-item.editing input[name="title"]')
  await expect(field).toBeFocused()
  await field.fill('avant ')

  await page.keyboard.press('Meta+k')
  await expect(page.locator('.targets-panel')).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(page.locator('.targets-panel')).not.toBeVisible()

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
  await page.keyboard.press('k')
  await page.locator('.notification').waitFor({ state: 'hidden' })

  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  const field = page.locator('.event-item.editing input[name="title"]')
  await expect(field).toBeFocused()
  const before = await field.inputValue()

  await page.keyboard.press('Meta+k')
  await expect(page.locator('.targets-panel')).toBeVisible()
  await page.keyboard.press('Meta+Enter')
  await expect(page.locator('.targets-panel')).not.toBeVisible()

  const after = await field.inputValue()
  expect(after).toBe(before)
})

test('targets persistées : rechargement → cibles toujours présentes', async ({ page }) => {
  await selectFirstEvent(page)
  const id    = await page.locator('.event-item.selected').getAttribute('data-id')
  const title = await page.locator('.event-item.selected .event-text').textContent()
  await page.keyboard.press('k')
  await page.locator('.notification').waitFor({ state: 'hidden' })

  await page.reload()
  await expect(page.locator('.project-item').first()).toHaveClass(/selected/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('.event-item').first()).toBeVisible()
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await expect(page.locator('.event-item.editing input[name="title"]')).toBeFocused()

  await page.keyboard.press('Meta+k')
  await expect(page.locator('.targets-panel')).toBeVisible()
  await expect(page.locator('.targets-panel__item').first()).toContainText(title.trim())
})
