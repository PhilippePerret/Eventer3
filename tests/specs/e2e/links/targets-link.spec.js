import { test, expect, pane1, press } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

const field = page => pane1(page).locator('.event-item.editing [contenteditable][data-field="title"]')

async function selectFirstEvent(page) {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await expect(pane1(page).locator('.event-item').first()).toBeVisible()
}

test('k sur item sélectionné → mémorise la cible + notification', async ({ page }) => {
  await selectFirstEvent(page)
  const title = await pane1(page).locator('.event-item.selected .event-title').textContent()
  await press(page, 'k')
  await expect(pane1(page).locator('.notification')).toBeVisible()
  const notif = await pane1(page).locator('.notification').textContent()
  expect(notif).toContain(title.trim())
})

test('k deux fois sur le même item → alerte doublon, pas de doublon dans targets', async ({ page }) => {
  await selectFirstEvent(page)
  await press(page, 'k')
  await expect(pane1(page).locator('.notification')).toBeVisible()
  await pane1(page).locator('.notification').waitFor({ state: 'hidden' })
  await press(page, 'k')
  await expect(pane1(page).locator('.notification')).toBeVisible()
  const notif = await pane1(page).locator('.notification').textContent()
  expect(notif.toLowerCase()).toMatch(/déjà|doublon/)
})

test('⌘+k en édition → TargetsPanel s\'ouvre avec la cible mémorisée', async ({ page }) => {
  await selectFirstEvent(page)
  const title = await pane1(page).locator('.event-item.selected .event-title').textContent()
  await press(page, 'k')
  await expect(pane1(page).locator('.notification')).toBeVisible()
  await pane1(page).locator('.notification').waitFor({ state: 'hidden' })

  await press(page, 'ArrowDown')
  await press(page, 'Enter')
  await expect(field(page)).toBeFocused()

  await press(page, 'Meta+k')
  await expect(pane1(page).locator('.targets-panel')).toBeVisible()
  await expect(pane1(page).locator('.floating-panel__item')).toHaveCount(1)
  await expect(pane1(page).locator('.floating-panel__item').first()).toContainText(title.trim())
})

test('Enter dans TargetsPanel → insère [title](id) au curseur', async ({ page }) => {
  await selectFirstEvent(page)
  const id    = await pane1(page).locator('.event-item.selected').getAttribute('data-id')
  const title = await pane1(page).locator('.event-item.selected .event-title').textContent()
  await press(page, 'k')
  await pane1(page).locator('.notification').waitFor({ state: 'hidden' })

  await press(page, 'ArrowDown')
  await press(page, 'Enter')
  await expect(field(page)).toBeFocused()
  await field(page).fill('avant ')

  await press(page, 'Meta+k')
  await expect(pane1(page).locator('.targets-panel')).toBeVisible()
  await press(page, 'Enter')
  await expect(pane1(page).locator('.targets-panel')).not.toBeVisible()

  const val = (await field(page).evaluate(el => el.textContent)).replace(/ /g, ' ')
  const t   = title.trim()
  expect(val).toBe(`avant [${t}](${id})`)

  const sel = await field(page).evaluate(el => {
    const s = window.getSelection()
    if (!s?.rangeCount) return { start: 0, end: 0 }
    const r = s.getRangeAt(0)
    const pre = r.cloneRange()
    pre.selectNodeContents(el)
    pre.setEnd(r.startContainer, r.startOffset)
    const start = pre.toString().length
    return { start, end: start + r.toString().length }
  })
  const linkStart = val.indexOf('[') + 1
  expect(sel.start).toBe(linkStart)
  expect(sel.end).toBe(linkStart + t.length)
})

test('⌘+Enter dans TargetsPanel → ferme sans insérer', async ({ page }) => {
  await selectFirstEvent(page)
  await press(page, 'k')
  await pane1(page).locator('.notification').waitFor({ state: 'hidden' })

  await press(page, 'ArrowDown')
  await press(page, 'Enter')
  await expect(field(page)).toBeFocused()
  const before = await field(page).evaluate(el => el.textContent)

  await press(page, 'Meta+k')
  await expect(pane1(page).locator('.targets-panel')).toBeVisible()
  await press(page, 'Meta+Enter')
  await expect(pane1(page).locator('.targets-panel')).not.toBeVisible()

  const after = await field(page).evaluate(el => el.textContent)
  expect(after).toBe(before)
})

test('targets persistées : rechargement → cibles toujours présentes', async ({ page }) => {
  await selectFirstEvent(page)
  const title = await pane1(page).locator('.event-item.selected .event-title').textContent()
  await press(page, 'k')
  await pane1(page).locator('.notification').waitFor({ state: 'hidden' })
  await page.waitForLoadState('networkidle')

  await page.reload()
  await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('.event-item').first()).toBeVisible()
  await press(page, 'ArrowDown')
  await press(page, 'Enter')
  await expect(field(page)).toBeFocused()

  await press(page, 'Meta+k')
  await expect(pane1(page).locator('.targets-panel')).toBeVisible()
  await expect(pane1(page).locator('.floating-panel__item').first()).toContainText(title.trim())
})
