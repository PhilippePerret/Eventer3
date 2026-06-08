# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: barre-etat/status-bar-display-mode.spec.js >> ⌘+m inactif sur liste des projets
- Location: specs/e2e/barre-etat/status-bar-display-mode.spec.js:69:1

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#main-panel')
Expected pattern: /project-list/
Received string:  ""
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#main-panel')
    14 × locator resolved to <main id="main-panel"></main>
       - unexpected value ""

```

```yaml
- main
- contentinfo "Raccourcis clavier"
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures'
  2  | import { test, expect } from '../__setup__.js'
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
  13 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  14 | 
  15 |   console.log('-> #status-bar doit exister et être visible')
  16 |   await expect(page.locator('#status-bar')).toBeVisible()
  17 | 
  18 |   console.log('-> mode par défaut sur liste des projets : DISP MODE PROJECTS')
  19 |   await expect(page.locator('#status-bar')).toContainText('DISP MODE PROJECTS')
  20 | 
  21 |   console.log('\n=== FIN ===\n')
  22 | })
  23 | 
  24 | test("barre d'état passe en NESTING à l'entrée dans un EventLister", async ({ page }) => {
  25 |   await page.goto('/')
  26 | 
  27 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  28 |   await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)
  29 |   await page.keyboard.press('ArrowRight')
  30 |   await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  31 | 
  32 |   console.log('-> mode NESTING affiché dans EventLister')
  33 |   await expect(page.locator('#status-bar')).toContainText('DISP MODE NESTING')
  34 | })
  35 | 
  36 | test("⌘+m dans EventLister bascule NESTING → LEVEL → NESTING", async ({ page }) => {
  37 |   await page.goto('/')
  38 | 
  39 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  40 |   await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)
  41 |   await page.keyboard.press('ArrowRight')
  42 |   await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  43 |   await expect(page.locator('#status-bar')).toContainText('DISP MODE NESTING')
  44 | 
  45 |   console.log('-> ⌘+m : bascule vers LEVEL')
  46 |   await page.keyboard.press('Meta+m')
  47 |   await expect(page.locator('#status-bar')).toContainText('DISP MODE LEVEL')
  48 | 
  49 |   console.log('-> ⌘+m : retour vers NESTING')
  50 |   await page.keyboard.press('Meta+m')
  51 |   await expect(page.locator('#status-bar')).toContainText('DISP MODE NESTING')
  52 | })
  53 | 
  54 | test("retour liste des projets repasse en PROJECTS", async ({ page }) => {
  55 |   await page.goto('/')
  56 | 
  57 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  58 |   await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)
  59 |   await page.keyboard.press('ArrowRight')
  60 |   await expect(page.locator('#status-bar')).toContainText('DISP MODE NESTING')
  61 | 
  62 |   await page.keyboard.press('ArrowLeft')
  63 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  64 | 
  65 |   console.log('-> retour liste projets : status bar repasse en PROJECTS')
  66 |   await expect(page.locator('#status-bar')).toContainText('DISP MODE PROJECTS')
  67 | })
  68 | 
  69 | test("⌘+m inactif sur liste des projets", async ({ page }) => {
  70 |   await page.goto('/')
  71 | 
> 72 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
     |                                             ^ Error: expect(locator).toHaveClass(expected) failed
  73 | 
  74 |   await page.keyboard.press('Meta+m')
  75 |   await expect(page.locator('#status-bar')).toContainText('DISP MODE PROJECTS')
  76 | })
  77 | 
```