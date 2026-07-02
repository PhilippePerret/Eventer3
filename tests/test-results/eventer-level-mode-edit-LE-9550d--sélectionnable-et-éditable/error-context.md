# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: eventer/level-mode-edit.spec.js >> LEVEL mode : item réel après un virtuel est sélectionnable et éditable
- Location: specs/e2e/eventer/level-mode-edit.spec.js:27:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#pane-1').contentFrame().locator('.event-item[data-id="e31"] input[name="title"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.event-item[data-id="e31"] input[name="title"]')

```

```yaml
- text: Séquence 1 de Acte I — +1 Acte II Séquence 1 de Acte III — DISP MODE LEVEL
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures'
  2  | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3  | 
  4  | // Fixture level-mode-mixed :
  5  | //   Liste#2 (depth=1) : [e1 "Acte I", e2 "Acte II", e3 "Acte III"]
  6  | //   Liste#3 (depth=2, enfant e1) : [e11 "Séquence 1 de Acte I"]
  7  | //   (e2 sans sous-liste → virtuel en LEVEL depth=2)
  8  | //   Liste#4 (depth=2, enfant e3) : [e31 "Séquence 1 de Acte III"]
  9  | // En LEVEL depth=2 : [e11 (réel), "Acte II +1" (virtuel), e31 (réel)]
  10 | 
  11 | test.beforeEach(() => {
  12 |   installFixtures('level-mode-mixed')
  13 | })
  14 | 
  15 | async function enterLevelMode(page) {
  16 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  17 |   await press(page, 'ArrowRight')
  18 |   await press(page, 'ArrowRight')
  19 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  20 |   await press(page, 'ArrowRight')
  21 |   await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '2')
  22 |   await press(page, 'Meta+m')
  23 |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
  24 |   await expect(pane1(page).locator('.event-item')).toHaveCount(3)
  25 | }
  26 | 
  27 | test("LEVEL mode : item réel après un virtuel est sélectionnable et éditable", async ({ page }) => {
  28 |   await page.goto('/')
  29 |   await enterLevelMode(page)
  30 | 
  31 | 
  32 |   await expect(pane1(page).locator('.event-item[data-id="e11"]')).toHaveClass(/selected/)
  33 | 
  34 |   await press(page, 'ArrowDown')
  35 |   await expect(pane1(page).locator('.event-item[data-id="e31"]')).toHaveClass(/selected/)
  36 | 
  37 |   await press(page, 'Enter')
  38 |   const input = pane1(page).locator('.event-item[data-id="e31"] input[name="title"]')
> 39 |   await expect(input).toBeVisible()
     |                       ^ Error: expect(locator).toBeVisible() failed
  40 |   await expect(input).toBeFocused()
  41 |   await expect(input).toHaveValue('Séquence 1 de Acte III')
  42 | 
  43 | })
  44 | 
```