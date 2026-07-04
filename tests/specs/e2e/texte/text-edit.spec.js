//Origine: tests/specs/e2e/texte/text-edit.spec.js
import { test, expect, pane1, press } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'

// Fixture with-brins-and-persos :
//   project, events, brins, persos

test.describe('TextEdit — raccourcis markdown dans les champs titre', () => {

  test.beforeEach(() => installFixtures('with-brins-and-persos'))

  // ─── Helpers ────────────────────────────────────────────────────────────────

  async function enterEditEvent(page) {
    await page.goto('/')
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('.event-item').first()).toBeVisible()
    await press(page, 'Enter')
    const field = pane1(page).locator('.event-item.editing [data-field="title"]')
    await expect(field).toBeFocused()
    await field.fill('hello world')
    return field
  }

  async function enterEditBrin(page) {
    await page.goto('/')
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('.event-item').first()).toBeVisible()
    await press(page, 'b')
    await expect(pane1(page).locator('#brins-panel')).toBeVisible()
    await press(page, 'Enter')
    const field = pane1(page).locator('.brin-item.editing [data-field="title"]')
    await expect(field).toBeFocused()
    await field.fill('hello world')
    return field
  }

  async function enterEditPerso(page) {
    await page.goto('/')
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('.event-item').first()).toBeVisible()
    await press(page, 'p')
    await expect(pane1(page).locator('#persos-panel')).toBeVisible()
    await press(page, 'Enter')
    const field = pane1(page).locator('.perso-item.editing [data-field="title"]')
    await expect(field).toBeFocused()
    await field.fill('hello world')
    return field
  }

  async function selectLastNChars(page, n) {
    for (let i = 0; i < n; i++) await press(page, 'Shift+ArrowLeft')
  }

  async function confirmEdit(page) {
    await press(page, 'Enter')
    await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {})
  }

  // ─── ⌘+i italique ──────────────────────────────────────────────────────────

  test('event : ⌘+i entoure la sélection avec *...* (italique)', async ({ page }) => {
    await enterEditEvent(page)
    await selectLastNChars(page, 5)
    await press(page, 'Meta+i')
    await confirmEdit(page)
    const html = await pane1(page).locator('.event-item.selected .event-title').innerHTML()
    expect(html).toContain('<em>world</em>')
  })

  test('brin : ⌘+i entoure la sélection avec *...* (italique)', async ({ page }) => {
    await enterEditBrin(page)
    await selectLastNChars(page, 5)
    await press(page, 'Meta+i')
    await confirmEdit(page)
    const html = await pane1(page).locator('.brin-item.selected .brin-title').innerHTML()
    expect(html).toContain('<em>world</em>')
  })

  test('perso : ⌘+i entoure la sélection avec *...* (italique)', async ({ page }) => {
    await enterEditPerso(page)
    await selectLastNChars(page, 5)
    await press(page, 'Meta+i')
    await confirmEdit(page)
    const html = await pane1(page).locator('.perso-item.selected .perso-title').innerHTML()
    expect(html).toContain('<em>world</em>')
  })

  // ─── ⌘+g gras ──────────────────────────────────────────────────────────────

  test('event : ⌘+g entoure la sélection avec **...** (gras)', async ({ page }) => {
    await enterEditEvent(page)
    await selectLastNChars(page, 5)
    await press(page, 'Meta+g')
    await confirmEdit(page)
    const html = await pane1(page).locator('.event-item.selected .event-title').innerHTML()
    expect(html).toContain('<strong>world</strong>')
  })

  // ─── ⌘+b barré ─────────────────────────────────────────────────────────────

  test('event : ⌘+b entoure la sélection avec ~~...~~ (barré)', async ({ page }) => {
    await enterEditEvent(page)
    await selectLastNChars(page, 5)
    await press(page, 'Meta+b')
    await confirmEdit(page)
    const html = await pane1(page).locator('.event-item.selected .event-title').innerHTML()
    expect(html).toContain('<s>world</s>')
  })

  // ─── ⌘+u souligné ──────────────────────────────────────────────────────────

  test('event : ⌘+u entoure la sélection avec __...__ (souligné)', async ({ page }) => {
    await enterEditEvent(page)
    await selectLastNChars(page, 5)
    await press(page, 'Meta+u')
    await confirmEdit(page)
    const html = await pane1(page).locator('.event-item.selected .event-title').innerHTML()
    expect(html).toContain('<u>world</u>')
  })

  // ─── Toggle (retrait des marques) ──────────────────────────────────────────

  test('event : ⌘+i sur [*world*] sélection inclut marques → retire italique', async ({ page }) => {
    const field = await enterEditEvent(page)
    await field.fill('*world*')
    await field.evaluate((el, [s, e]) => {
      const t = el.firstChild; if (!t) return
      const r = document.createRange(); r.setStart(t, s); r.setEnd(t, e)
      const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r)
    }, [0, 7])
    await press(page, 'Meta+i')
    await confirmEdit(page)
    const html = await pane1(page).locator('.event-item.selected .event-title').innerHTML()
    expect(html).not.toContain('<em>')
    expect(html).not.toContain('*')
  })

  // ─── Propagation (Shift+ArrowLeft ne doit pas quitter l'édition) ───────────

  test('event : Shift+ArrowLeft ne quitte pas l\'édition', async ({ page }) => {
    await enterEditEvent(page)
    await selectLastNChars(page, 5)
    await expect(pane1(page).locator('.event-item.editing')).toBeVisible()
  })

})
