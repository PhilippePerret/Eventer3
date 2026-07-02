# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: panels/panel-move.spec.js >> Ctrl+Shift+↓ déplace le panneau raccourcis de 50px
- Location: specs/e2e/panels/panel-move.spec.js:67:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 50
Received: 0
```

# Page snapshot

```yaml
- iframe [active] [ref=e3]:
  - generic [ref=f1e1]:
    - generic [ref=f1e7]:
      - generic [ref=f1e8]: Projet A
      - generic [ref=f1e10]: roman
    - generic:
      - generic: DISP MODE PROJECTS
    - contentinfo "Raccourcis clavier" [ref=f1e11]
    - paragraph [ref=f1e14]: Test
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  2  | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3  | 
  4  | test.beforeEach(() => {
  5  |   installFixtures('with-styles')
  6  | })
  7  | 
  8  | async function goToListerEvent(page) {
  9  |   await page.goto('/')
  10 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  11 |   await press(page, 'ArrowRight')
  12 |   await press(page, 'ArrowRight')
  13 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  14 | }
  15 | 
  16 | async function openStylePanel(page) {
  17 |   await goToListerEvent(page)
  18 |   await press(page, 's')
  19 |   await expect(pane1(page).locator('#style-panel')).toBeVisible()
  20 | }
  21 | 
  22 | // ─── Style panel ──────────────────────────────────────────────────────────────
  23 | 
  24 | test("Ctrl+Shift+↓ déplace le style panel de 50px vers le bas", async ({ page }) => {
  25 |   await openStylePanel(page)
  26 |   const before = await pane1(page).locator('.style-panel__inner').boundingBox()
  27 |   await press(page, 'Control+Shift+ArrowDown')
  28 |   const after = await pane1(page).locator('.style-panel__inner').boundingBox()
  29 |   expect(Math.round(after.y - before.y)).toBe(50)
  30 | })
  31 | 
  32 | test("Ctrl+Shift+↑ déplace le style panel de 50px vers le haut", async ({ page }) => {
  33 |   await openStylePanel(page)
  34 |   const before = await pane1(page).locator('.style-panel__inner').boundingBox()
  35 |   await press(page, 'Control+Shift+ArrowUp')
  36 |   const after = await pane1(page).locator('.style-panel__inner').boundingBox()
  37 |   expect(Math.round(before.y - after.y)).toBe(50)
  38 | })
  39 | 
  40 | test("Ctrl+Shift+→ déplace le style panel de 50px vers la droite", async ({ page }) => {
  41 |   await openStylePanel(page)
  42 |   const before = await pane1(page).locator('.style-panel__inner').boundingBox()
  43 |   await press(page, 'Control+Shift+ArrowRight')
  44 |   const after = await pane1(page).locator('.style-panel__inner').boundingBox()
  45 |   expect(Math.round(after.x - before.x)).toBe(50)
  46 | })
  47 | 
  48 | test("Ctrl+Shift+← déplace le style panel de 50px vers la gauche", async ({ page }) => {
  49 |   await openStylePanel(page)
  50 |   const before = await pane1(page).locator('.style-panel__inner').boundingBox()
  51 |   await press(page, 'Control+Shift+ArrowLeft')
  52 |   const after = await pane1(page).locator('.style-panel__inner').boundingBox()
  53 |   expect(Math.round(before.x - after.x)).toBe(50)
  54 | })
  55 | 
  56 | test("deux Ctrl+Shift+↓ accumulent : 100px total", async ({ page }) => {
  57 |   await openStylePanel(page)
  58 |   const before = await pane1(page).locator('.style-panel__inner').boundingBox()
  59 |   await press(page, 'Control+Shift+ArrowDown')
  60 |   await press(page, 'Control+Shift+ArrowDown')
  61 |   const after = await pane1(page).locator('.style-panel__inner').boundingBox()
  62 |   expect(Math.round(after.y - before.y)).toBe(100)
  63 | })
  64 | 
  65 | // ─── Shortcuts panel ──────────────────────────────────────────────────────────
  66 | 
  67 | test("Ctrl+Shift+↓ déplace le panneau raccourcis de 50px", async ({ page }) => {
  68 |   await page.goto('/')
  69 |   const frame = page.frames().find(f => f.url().includes('app-frame'))
  70 |   await frame.evaluate(() => {
  71 |     const panel = document.querySelector('#shortcuts-panel')
  72 |     panel.innerHTML = '<div class="shortcuts-panel__inner"><p>Test</p></div>'
  73 |     panel.classList.remove('hidden')
  74 |   })
  75 |   await expect(pane1(page).locator('#shortcuts-panel')).toBeVisible()
  76 |   const before = await pane1(page).locator('.shortcuts-panel__inner').boundingBox()
  77 |   await press(page, 'Control+Shift+ArrowDown')
  78 |   const after = await pane1(page).locator('.shortcuts-panel__inner').boundingBox()
> 79 |   expect(Math.round(after.y - before.y)).toBe(50)
     |                                          ^ Error: expect(received).toBe(expected) // Object.is equality
  80 | })
  81 | 
  82 | // ─── Tools panel ─────────────────────────────────────────────────────────────
  83 | 
  84 | test("Ctrl+Shift+↓ déplace le panneau outils de 50px", async ({ page }) => {
  85 |   await goToListerEvent(page)
  86 |   await press(page, 'Meta+t')
  87 |   await expect(pane1(page).locator('.tools-panel')).toBeVisible()
  88 |   const before = await pane1(page).locator('.tools-panel').boundingBox()
  89 |   await press(page, 'Control+Shift+ArrowDown')
  90 |   const after = await pane1(page).locator('.tools-panel').boundingBox()
  91 |   expect(Math.round(after.y - before.y)).toBe(50)
  92 | })
  93 | 
```