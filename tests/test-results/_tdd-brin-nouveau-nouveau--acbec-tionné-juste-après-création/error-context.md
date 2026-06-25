# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/brin-nouveau.spec.js >> nouveau brin : il est sélectionné juste après création
- Location: specs/e2e/_tdd/brin-nouveau.spec.js:20:6

# Error details

```
Test timeout of 15000ms exceeded.
```

```
Error: locator.fill: Test timeout of 15000ms exceeded.
Call log:
  - waiting for locator('#pane-1').contentFrame().locator('.brin-item.selected [data-field="title"]')
    - locator resolved to <span tabindex="0" class="brin-title" data-field="title" contenteditable="true"></span>
    - fill("Brin créé")
  - attempting fill action
    2 × waiting for element to be visible, enabled and editable
      - element is not visible
    - retrying fill action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and editable
      - element is not visible
    - retrying fill action
      - waiting 100ms
    29 × waiting for element to be visible, enabled and editable
       - element is not visible
     - retrying fill action
       - waiting 500ms

```

# Page snapshot

```yaml
- iframe [active] [ref=e3]:
  - generic [ref=f1e1]:
    - main [ref=f1e2]:
      - generic [ref=f1e5]:
        - generic [ref=f1e6]: Événement 1
        - generic [ref=f1e7]:
          - generic [ref=f1e8]: —
          - generic [ref=f1e9]: "---"
          - generic [ref=f1e10]: "---"
        - generic [ref=f1e14]: AUT
      - generic [ref=f1e17]:
        - generic [ref=f1e18]: Événement 2
        - generic [ref=f1e19]:
          - generic [ref=f1e20]: —
          - generic [ref=f1e21]: "---"
          - generic [ref=f1e22]: "---"
    - contentinfo "Raccourcis clavier" [ref=f1e23]
    - generic: AIDE ⇧⌘ ?
    - generic [ref=f1e24]:
      - generic [ref=f1e27]:
        - generic [ref=f1e28]: Mon brin
        - generic [ref=f1e29]:
          - generic [ref=f1e30]: "#d9c8a9"
          - generic [ref=f1e31]: MON
          - generic [ref=f1e32]: brin
      - generic [ref=f1e36]:
        - generic [ref=f1e37]: "#c8d9a9"
        - generic [ref=f1e38]: "---"
      - generic [ref=f1e39]:
        - generic [ref=f1e41]: ✓
        - generic [ref=f1e42]:
          - generic [ref=f1e43]: Autre brin
          - generic [ref=f1e44]:
            - generic [ref=f1e45]: "#a9d9c8"
            - generic [ref=f1e46]: AUT
            - generic [ref=f1e47]: brin
```

# Test source

```ts
  1  | // Origine : tests/specs/e2e/brin/brin-nouveau.spec.js
  2  | import { installFixtures } from '../../../helpers/install-fixtures'
  3  | import { test, expect, pane1 } from '../__setup__.js'
  4  | 
  5  | test.beforeEach(() => {
  6  |   installFixtures('with-brins')
  7  | })
  8  | 
  9  | // fixture with-brins : project-a, events e1/e2, brins b1 (MON) / b2 (AUT, coché)
  10 | 
  11 | async function openBrinPanel(page) {
  12 |   await page.goto('/')
  13 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  14 |   await pane1(page).locator('.project-item.selected').press('ArrowRight')
  15 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  16 |   await pane1(page).locator('#main-panel').press('b')
  17 |   await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  18 | }
  19 | 
  20 | test.only("nouveau brin : il est sélectionné juste après création", async ({ page }) => {
  21 |   await openBrinPanel(page)
  22 |   await pane1(page).locator('#main-panel').press('n')
  23 |   const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
> 24 |   await titleInput.fill('Brin créé')
     |                    ^ Error: locator.fill: Test timeout of 15000ms exceeded.
  25 |   await pane1(page).locator('#main-panel').press('Enter')
  26 |   // Le nouveau brin (inséré après le premier) doit être sélectionné
  27 |   await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/selected/)
  28 | })
  29 | 
  30 | test("nouveau brin : il s'affiche avec la classe CSS brin-item", async ({ page }) => {
  31 |   await openBrinPanel(page)
  32 |   await pane1(page).locator('#main-panel').press('n')
  33 |   const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
  34 |   await titleInput.fill('Brin CSS')
  35 |   await pane1(page).locator('#main-panel').press('Enter')
  36 |   const newBrin = pane1(page).locator('.brin-item').nth(1)
  37 |   await expect(newBrin).toHaveClass(/brin-item/)
  38 | })
  39 | 
  40 | test("en création, l'éditeur de brin a les classes CSS brin-item et editing", async ({ page }) => {
  41 |   await openBrinPanel(page)
  42 |   await pane1(page).locator('#main-panel').press('n')
  43 |   const editor = pane1(page).locator('.brin-item.selected')
  44 |   await expect(editor).toHaveClass(/brin-item/)
  45 |   await expect(editor).toHaveClass(/editing/)
  46 | })
  47 | 
```