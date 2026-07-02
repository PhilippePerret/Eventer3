# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: texte/markdown-editing.spec.js >> ⌘+i sur *[world]* sélection exclut marques → retire italique
- Location: specs/e2e/texte/markdown-editing.spec.js:75:1

# Error details

```
Error: expect(locator).toBeFocused() failed

Locator: locator('#pane-1').contentFrame().locator('.event-item.editing input[name="title"]')
Expected: focused
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeFocused" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.event-item.editing input[name="title"]')

```

```yaml
- text: Évènement un — Évènement deux — Évènement trois — DISP MODE NESTING
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  2  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  3  | 
  4  | test.beforeEach(() => {
  5  |   installFixtures('many-events')
  6  | })
  7  | 
  8  | // Helper : entre dans l'édition du premier event et efface le titre
  9  | async function enterEditFirstEvent(page) {
  10 |   await page.goto('/')
  11 |   await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  12 |   await press(page, 'ArrowRight')
  13 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  14 |   await expect(pane1(page).locator('.event-item').first()).toBeVisible()
  15 |   await press(page, 'Enter')
  16 |   const field = pane1(page).locator('.event-item.editing input[name="title"]')
> 17 |   await expect(field).toBeFocused()
     |                       ^ Error: expect(locator).toBeFocused() failed
  18 |   // Sélectionner tout + remplacer par "hello world"
  19 |   await field.fill('hello world')
  20 |   return field
  21 | }
  22 | 
  23 | // Helper : sélectionne les N derniers caractères dans le champ
  24 | async function selectLastNChars(page, n) {
  25 |   for (let i = 0; i < n; i++) await press(page, 'Shift+ArrowLeft')
  26 | }
  27 | 
  28 | test('⌘+i entoure la sélection avec *...* (italique)', async ({ page }) => {
  29 |   await enterEditFirstEvent(page)
  30 |   await selectLastNChars(page, 5) // sélectionne "world"
  31 |   await press(page, 'Meta+i')
  32 |   await press(page, 'Enter')
  33 |   const html = await pane1(page).locator('.event-item.selected .event-text').innerHTML()
  34 |   expect(html).toContain('<em>world</em>')
  35 | })
  36 | 
  37 | test('⌘+g entoure la sélection avec **...** (gras)', async ({ page }) => {
  38 |   await enterEditFirstEvent(page)
  39 |   await selectLastNChars(page, 5)
  40 |   await press(page, 'Meta+g')
  41 |   await press(page, 'Enter')
  42 |   const html = await pane1(page).locator('.event-item.selected .event-text').innerHTML()
  43 |   expect(html).toContain('<strong>world</strong>')
  44 | })
  45 | 
  46 | test('⌘+b entoure la sélection avec ~~...~~ (barré)', async ({ page }) => {
  47 |   await enterEditFirstEvent(page)
  48 |   await selectLastNChars(page, 5)
  49 |   await press(page, 'Meta+b')
  50 |   await press(page, 'Enter')
  51 |   const html = await pane1(page).locator('.event-item.selected .event-text').innerHTML()
  52 |   expect(html).toContain('<s>world</s>')
  53 | })
  54 | 
  55 | test('⌘+u entoure la sélection avec __...__ (souligné)', async ({ page }) => {
  56 |   await enterEditFirstEvent(page)
  57 |   await selectLastNChars(page, 5)
  58 |   await press(page, 'Meta+u')
  59 |   await press(page, 'Enter')
  60 |   const html = await pane1(page).locator('.event-item.selected .event-text').innerHTML()
  61 |   expect(html).toContain('<u>world</u>')
  62 | })
  63 | 
  64 | test('⌘+i sur [*world*] sélection inclut marques → retire italique', async ({ page }) => {
  65 |   const field = await enterEditFirstEvent(page)
  66 |   await field.fill('*world*')
  67 |   await field.evaluate(el => el.setSelectionRange(0, 7))
  68 |   await press(page, 'Meta+i')
  69 |   await press(page, 'Enter')
  70 |   const html = await pane1(page).locator('.event-item.selected .event-text').innerHTML()
  71 |   expect(html).not.toContain('<em>')
  72 |   expect(html).not.toContain('*')
  73 | })
  74 | 
  75 | test('⌘+i sur *[world]* sélection exclut marques → retire italique', async ({ page }) => {
  76 |   const field = await enterEditFirstEvent(page)
  77 |   await field.fill('*world*')
  78 |   await field.evaluate(el => el.setSelectionRange(1, 6))
  79 |   await press(page, 'Meta+i')
  80 |   await press(page, 'Enter')
  81 |   const html = await pane1(page).locator('.event-item.selected .event-text').innerHTML()
  82 |   expect(html).not.toContain('<em>')
  83 |   expect(html).not.toContain('*')
  84 | })
  85 | 
```