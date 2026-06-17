# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: eventer/level-mode-edit.spec.js >> LEVEL mode : item réel après un virtuel est sélectionnable et éditable
- Location: specs/e2e/eventer/level-mode-edit.spec.js:26:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#pane-1').contentFrame().locator('#status-bar')
Expected substring: "DISP MODE LEVEL"
Received string:    "DISP MODE NESTING"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('#status-bar')
    14 × locator resolved to <div id="status-bar">…</div>
       - unexpected value "DISP MODE NESTING"

```

```yaml
- text: DISP MODE NESTING
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures'
  2  | import { test, expect, pane1 } from '../__setup__.js'
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
  16 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  17 |   await page.keyboard.press('ArrowRight')
  18 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  19 |   await page.keyboard.press('ArrowRight')
  20 |   await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  21 |   await page.keyboard.press('Meta+m')
> 22 |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
     |                                                    ^ Error: expect(locator).toContainText(expected) failed
  23 |   await expect(pane1(page).locator('.event-item')).toHaveCount(3)
  24 | }
  25 | 
  26 | test("LEVEL mode : item réel après un virtuel est sélectionnable et éditable", async ({ page }) => {
  27 |   await page.goto('/')
  28 |   await enterLevelMode(page)
  29 | 
  30 |   console.log('\n=== TEST ÉDITION DERNIER ITEM RÉEL EN LEVEL MODE ===')
  31 | 
  32 |   console.log('-> sélection initiale : e11')
  33 |   await expect(pane1(page).locator('.event-item[data-id="e11"]')).toHaveClass(/selected/)
  34 | 
  35 |   console.log('-> ↓ : saute le virtuel, sélectionne e31')
  36 |   await page.keyboard.press('ArrowDown')
  37 |   await expect(pane1(page).locator('.event-item[data-id="e31"]')).toHaveClass(/selected/)
  38 | 
  39 |   console.log('-> Enter : édition de e31')
  40 |   await page.keyboard.press('Enter')
  41 |   const input = pane1(page).locator('.event-item[data-id="e31"] input[name="title"]')
  42 |   await expect(input).toBeVisible()
  43 |   await expect(input).toBeFocused()
  44 |   await expect(input).toHaveValue('Séquence 1 de Acte III')
  45 | 
  46 |   console.log('\n=== FIN ===\n')
  47 | })
  48 | 
```