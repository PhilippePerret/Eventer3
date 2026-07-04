//Origine: tests/specs/e2e/texte/markdown-editing.spec.js
import { test, expect, pane1, press, getErr } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

// Helper : entre dans l'édition du premier event et efface le titre
async function enterEditFirstEvent(page) {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await expect(pane1(page).locator('.event-item').first()).toBeVisible()
  await press(page, 'Enter')
  const field = pane1(page).locator('.event-item.editing [data-field="title"]')
  await expect(field).toBeFocused()
  // Sélectionner tout + remplacer par "hello world"
  await field.fill('hello world')
  return field
}

// Helper : sélectionne les N derniers caractères dans le champ
async function selectLastNChars(page, n) {
  for (let i = 0; i < n; i++) await press(page, 'Shift+ArrowLeft')
}

// Helper : sélectionne une plage de caractères dans un contenteditable
async function selectRange(field, start, end) {
  await field.evaluate((el, [s, e]) => {
    const textNode = el.firstChild
    if (!textNode) return
    const range = document.createRange()
    range.setStart(textNode, s)
    range.setEnd(textNode, e)
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
  }, [start, end])
}

test('⌘+i entoure la sélection avec *...* (italique)', async ({ page }) => {
  await enterEditFirstEvent(page)
  await selectLastNChars(page, 5) // sélectionne "world"
  await press(page, 'Meta+i')
  await press(page, 'Enter')
  const html = await pane1(page).locator('.event-item.selected .event-title').innerHTML()
  expect(html).toContain('<em>world</em>')
})

test('⌘+g entoure la sélection avec **...** (gras)', async ({ page }) => {
  await enterEditFirstEvent(page)
  await selectLastNChars(page, 5)
  await press(page, 'Meta+g')
  await press(page, 'Enter')
  const html = await pane1(page).locator('.event-item.selected .event-title').innerHTML()
  expect(html).toContain('<strong>world</strong>')
})

test('⌘+b entoure la sélection avec ~~...~~ (barré)', async ({ page }) => {
  await enterEditFirstEvent(page)
  await selectLastNChars(page, 5)
  await press(page, 'Meta+b')
  await press(page, 'Enter')
  const html = await pane1(page).locator('.event-item.selected .event-title').innerHTML()
  expect(html).toContain('<s>world</s>')
})

test('⌘+u entoure la sélection avec __...__ (souligné)', async ({ page }) => {
  await enterEditFirstEvent(page)
  await selectLastNChars(page, 5)
  await press(page, 'Meta+u')
  await press(page, 'Enter')
  const html = await pane1(page).locator('.event-item.selected .event-title').innerHTML()
  expect(html).toContain('<u>world</u>')
})

test('⌘+i sur [*world*] sélection inclut marques → retire italique', async ({ page }) => {
  const field = await enterEditFirstEvent(page)
  await field.fill('*world*')
  await selectRange(field, 0, 7)
  await press(page, 'Meta+i')
  await press(page, 'Enter')
  const html = await pane1(page).locator('.event-item.selected .event-title').innerHTML()
  expect(html).not.toContain('<em>')
  expect(html).not.toContain('*')
})

test('⌘+i sur *[world]* sélection exclut marques → retire italique', async ({ page }) => {
  const field = await enterEditFirstEvent(page)
  await field.fill('*world*')
  await selectRange(field, 1, 6)
  await press(page, 'Meta+i')
  await press(page, 'Enter')
  const html = await pane1(page).locator('.event-item.selected .event-title').innerHTML()
  expect(html).not.toContain('<em>')
  expect(html).not.toContain('*')
})
