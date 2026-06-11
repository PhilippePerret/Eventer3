# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/targets-link.spec.js >> k deux fois sur le même item → alerte doublon, pas de doublon dans targets
- Location: specs/e2e/_tdd/targets-link.spec.js:27:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.notification')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.notification')

```

```yaml
- main:
  - navigation:
    - button "Projet A"
    - text: ‹
  - text: Évènement un — Évènement deux — Évènement trois —
- text: DISP MODE NESTING
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | import { test, expect } from '../__setup__.js'
  2   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  3   | 
  4   | test.beforeEach(() => {
  5   |   installFixtures('many-events')
  6   | })
  7   | 
  8   | // Helper : sélectionne le premier event du projet actif
  9   | async function selectFirstEvent(page) {
  10  |   await page.goto('/')
  11  |   await expect(page.locator('.project-item').first()).toHaveClass(/selected/)
  12  |   await page.keyboard.press('ArrowRight')
  13  |   await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  14  |   await expect(page.locator('.event-item').first()).toBeVisible()
  15  | }
  16  | 
  17  | test('k sur item sélectionné → mémorise la cible + notification', async ({ page }) => {
  18  |   await selectFirstEvent(page)
  19  |   const title = await page.locator('.event-item.selected .event-text').textContent()
  20  |   const id    = await page.locator('.event-item.selected').getAttribute('data-id')
  21  |   await page.keyboard.press('k')
  22  |   await expect(page.locator('.notification')).toBeVisible()
  23  |   const notif = await page.locator('.notification').textContent()
  24  |   expect(notif).toContain(title.trim())
  25  | })
  26  | 
  27  | test('k deux fois sur le même item → alerte doublon, pas de doublon dans targets', async ({ page }) => {
  28  |   await selectFirstEvent(page)
  29  |   await page.keyboard.press('k')
> 30  |   await expect(page.locator('.notification')).toBeVisible()
      |                                               ^ Error: expect(locator).toBeVisible() failed
  31  |   await page.locator('.notification').waitFor({ state: 'hidden' })
  32  |   await page.keyboard.press('k')
  33  |   await expect(page.locator('.notification')).toBeVisible()
  34  |   const notif = await page.locator('.notification').textContent()
  35  |   expect(notif.toLowerCase()).toMatch(/déjà|doublon/)
  36  | })
  37  | 
  38  | test('⌘+k en édition → TargetsPanel s\'ouvre avec la cible mémorisée', async ({ page }) => {
  39  |   await selectFirstEvent(page)
  40  |   const id    = await page.locator('.event-item.selected').getAttribute('data-id')
  41  |   const title = await page.locator('.event-item.selected .event-text').textContent()
  42  |   await page.keyboard.press('k')
  43  |   await expect(page.locator('.notification')).toBeVisible()
  44  |   await page.locator('.notification').waitFor({ state: 'hidden' })
  45  | 
  46  |   // Passe sur un autre event + entre en édition
  47  |   await page.keyboard.press('ArrowDown')
  48  |   await page.keyboard.press('Enter')
  49  |   await expect(page.locator('.event-item.editing input[name="title"]')).toBeFocused()
  50  | 
  51  |   await page.keyboard.press('Meta+k')
  52  |   await expect(page.locator('.targets-panel')).toBeVisible()
  53  |   await expect(page.locator('.targets-panel__item')).toHaveCount(1)
  54  |   await expect(page.locator('.targets-panel__item').first()).toContainText(title.trim())
  55  | })
  56  | 
  57  | test('Enter dans TargetsPanel → insère [title](id) au curseur', async ({ page }) => {
  58  |   await selectFirstEvent(page)
  59  |   const id    = await page.locator('.event-item.selected').getAttribute('data-id')
  60  |   const title = await page.locator('.event-item.selected .event-text').textContent()
  61  |   await page.keyboard.press('k')
  62  |   await page.locator('.notification').waitFor({ state: 'hidden' })
  63  | 
  64  |   await page.keyboard.press('ArrowDown')
  65  |   await page.keyboard.press('Enter')
  66  |   const field = page.locator('.event-item.editing input[name="title"]')
  67  |   await expect(field).toBeFocused()
  68  |   await field.fill('avant ')
  69  | 
  70  |   await page.keyboard.press('Meta+k')
  71  |   await expect(page.locator('.targets-panel')).toBeVisible()
  72  |   await page.keyboard.press('Enter')
  73  |   await expect(page.locator('.targets-panel')).not.toBeVisible()
  74  | 
  75  |   const val = await field.inputValue()
  76  |   const t   = title.trim()
  77  |   expect(val).toBe(`avant [${t}](${id})`)
  78  | 
  79  |   // Le titre entre crochets doit être sélectionné pour modification immédiate
  80  |   const sel = await field.evaluate(el => ({ start: el.selectionStart, end: el.selectionEnd }))
  81  |   const linkStart = val.indexOf('[') + 1   // après le '['
  82  |   expect(sel.start).toBe(linkStart)
  83  |   expect(sel.end).toBe(linkStart + t.length)
  84  | })
  85  | 
  86  | test('⌘+Enter dans TargetsPanel → ferme sans insérer', async ({ page }) => {
  87  |   await selectFirstEvent(page)
  88  |   await page.keyboard.press('k')
  89  |   await page.locator('.notification').waitFor({ state: 'hidden' })
  90  | 
  91  |   await page.keyboard.press('ArrowDown')
  92  |   await page.keyboard.press('Enter')
  93  |   const field = page.locator('.event-item.editing input[name="title"]')
  94  |   await expect(field).toBeFocused()
  95  |   const before = await field.inputValue()
  96  | 
  97  |   await page.keyboard.press('Meta+k')
  98  |   await expect(page.locator('.targets-panel')).toBeVisible()
  99  |   await page.keyboard.press('Meta+Enter')
  100 |   await expect(page.locator('.targets-panel')).not.toBeVisible()
  101 | 
  102 |   const after = await field.inputValue()
  103 |   expect(after).toBe(before)
  104 | })
  105 | 
  106 | test('targets persistées : rechargement → cibles toujours présentes', async ({ page }) => {
  107 |   await selectFirstEvent(page)
  108 |   const id    = await page.locator('.event-item.selected').getAttribute('data-id')
  109 |   const title = await page.locator('.event-item.selected .event-text').textContent()
  110 |   await page.keyboard.press('k')
  111 |   await page.locator('.notification').waitFor({ state: 'hidden' })
  112 | 
  113 |   await page.reload()
  114 |   await expect(page.locator('.project-item').first()).toHaveClass(/selected/)
  115 |   await page.keyboard.press('ArrowRight')
  116 |   await expect(page.locator('.event-item').first()).toBeVisible()
  117 |   await page.keyboard.press('ArrowDown')
  118 |   await page.keyboard.press('Enter')
  119 |   await expect(page.locator('.event-item.editing input[name="title"]')).toBeFocused()
  120 | 
  121 |   await page.keyboard.press('Meta+k')
  122 |   await expect(page.locator('.targets-panel')).toBeVisible()
  123 |   await expect(page.locator('.targets-panel__item').first()).toContainText(title.trim())
  124 | })
  125 | 
```