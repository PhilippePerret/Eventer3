# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: barre-etat/status-bar-display-mode.spec.js >> ⌘+m dans EventLister bascule NESTING → LEVEL → NESTING
- Location: specs/e2e/barre-etat/status-bar-display-mode.spec.js:36:1

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
  4  | test.beforeEach(() => {
  5  |   installFixtures('deep-events')
  6  | })
  7  | 
  8  | test("barre d'état visible au démarrage avec mode PROJECTS", async ({ page }) => {
  9  |   await page.goto('/')
  10 | 
  11 |   console.log('\n=== TEST STATUS BAR — DÉMARRAGE ===')
  12 | 
  13 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  14 | 
  15 |   console.log('-> #status-bar doit exister et être visible')
  16 |   await expect(pane1(page).locator('#status-bar')).toBeVisible()
  17 | 
  18 |   console.log('-> mode par défaut sur liste des projets : DISP MODE PROJECTS')
  19 |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE PROJECTS')
  20 | 
  21 |   console.log('\n=== FIN ===\n')
  22 | })
  23 | 
  24 | test("barre d'état passe en NESTING à l'entrée dans un EventLister", async ({ page }) => {
  25 |   await page.goto('/')
  26 | 
  27 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  28 |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  29 |   await page.keyboard.press('ArrowRight')
  30 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  31 | 
  32 |   console.log('-> mode NESTING affiché dans EventLister')
  33 |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')
  34 | })
  35 | 
  36 | test("⌘+m dans EventLister bascule NESTING → LEVEL → NESTING", async ({ page }) => {
  37 |   await page.goto('/')
  38 | 
  39 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  40 |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  41 |   await page.keyboard.press('ArrowRight')
  42 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  43 |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')
  44 | 
  45 |   console.log('-> ⌘+m : bascule vers LEVEL')
  46 |   await page.keyboard.press('Meta+m')
> 47 |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
     |                                                    ^ Error: expect(locator).toContainText(expected) failed
  48 | 
  49 |   console.log('-> ⌘+m : retour vers NESTING')
  50 |   await page.keyboard.press('Meta+m')
  51 |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')
  52 | })
  53 | 
  54 | test("retour liste des projets repasse en PROJECTS", async ({ page }) => {
  55 |   await page.goto('/')
  56 | 
  57 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  58 |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  59 |   await page.keyboard.press('ArrowRight')
  60 |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')
  61 | 
  62 |   await page.keyboard.press('ArrowLeft')
  63 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  64 | 
  65 |   console.log('-> retour liste projets : status bar repasse en PROJECTS')
  66 |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE PROJECTS')
  67 | })
  68 | 
  69 | test("⌘+m inactif sur liste des projets", async ({ page }) => {
  70 |   await page.goto('/')
  71 | 
  72 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  73 | 
  74 |   await page.keyboard.press('Meta+m')
  75 |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE PROJECTS')
  76 | })
  77 | 
```