# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app/aide-contextuelle-contenus.spec.js >> Aide contextuelle — contenus par contexte >> ListerProject >> ⌦ présent quand plusieurs projets
- Location: specs/e2e/app/aide-contextuelle-contenus.spec.js:13:5

# Error details

```
Test timeout of 15000ms exceeded.
```

```
Error: locator.press: Test timeout of 15000ms exceeded.
Call log:
  - waiting for locator('#pane-1').contentFrame().locator('.event-item.selected')

```

# Page snapshot

```yaml
- iframe [active] [ref=e3]:
  - generic [ref=f1e1]:
    - generic [ref=f1e5]:
      - generic [ref=f1e7]:
        - generic [ref=f1e8]: Projet A
        - generic [ref=f1e9]:
          - generic [ref=f1e10]: "---"
          - generic [ref=f1e11]: roman
      - generic [ref=f1e13]:
        - generic [ref=f1e14]: Projet B
        - generic [ref=f1e15]:
          - generic [ref=f1e16]: "---"
          - generic [ref=f1e17]: roman
      - generic [ref=f1e19]:
        - generic [ref=f1e20]: Projet C
        - generic [ref=f1e21]:
          - generic [ref=f1e22]: "---"
          - generic [ref=f1e23]: roman
      - generic [ref=f1e25]:
        - generic [ref=f1e26]: Projet caché
        - generic [ref=f1e27]:
          - generic [ref=f1e28]: "---"
          - generic [ref=f1e29]: roman
    - contentinfo "Raccourcis clavier" [ref=f1e30]
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  2  | import { test, expect, pane1 } from '../__setup__.js'
  3  | 
  4  | // Validité des contenus de l'aide contextuelle par contexte
  5  | // (quels raccourcis apparaissent dans quels contextes)
  6  | 
  7  | test.describe('Aide contextuelle — contenus par contexte', () => {
  8  | 
  9  |   test.describe('ListerProject', () => {
  10 | 
  11 |     test.beforeEach(() => installFixtures('many-projects'))
  12 | 
  13 |     test('⌦ présent quand plusieurs projets', async ({ page }) => {
  14 |       await page.goto('/')
  15 |       await expect(pane1(page).locator('#projects-panel')).toBeVisible()
> 16 |       await pane1(page).locator('.event-item.selected').press('Meta+?')
     |                                                         ^ Error: locator.press: Test timeout of 15000ms exceeded.
  17 |       await expect(pane1(page).locator('.contextual-help')).toContainText('⌦')
  18 |       await pane1(page).locator('.event-item.selected').press('Escape')
  19 |     })
  20 | 
  21 |   })
  22 | 
  23 | })
  24 | 
```