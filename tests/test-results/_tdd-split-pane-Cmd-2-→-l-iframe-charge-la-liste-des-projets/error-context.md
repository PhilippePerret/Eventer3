# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/split-pane.spec.js >> Cmd+2 → l'iframe charge la liste des projets
- Location: specs/e2e/_tdd/split-pane.spec.js:35:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#split-pane iframe').contentFrame().locator('.project-item').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#split-pane iframe').contentFrame().locator('.project-item').first()

```

```yaml
- main:
  - heading "Liste des projets" [level=1]
  - text: Projet A
- text: DISP MODE PROJECTS
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { test, expect } from '../__setup__.js'
  2  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  3  | import { ERRORS } from '../../../../public/locale/fr/ERRORS.js'
  4  | 
  5  | test.beforeEach(() => {
  6  |   installFixtures('with-links')
  7  | })
  8  | 
  9  | async function gotoApp(page) {
  10 |   await page.goto('/')
  11 |   await expect(page.locator('.project-item').first()).toHaveClass(/selected/)
  12 | }
  13 | 
  14 | // ─── État initial ─────────────────────────────────────────────────────────────
  15 | 
  16 | test('pas de second panneau au démarrage', async ({ page }) => {
  17 |   await gotoApp(page)
  18 |   await expect(page.locator('#split-pane')).not.toBeVisible()
  19 | })
  20 | 
  21 | // ─── Cmd+2 ouvre le split ─────────────────────────────────────────────────────
  22 | 
  23 | test('Cmd+2 → second panneau visible', async ({ page }) => {
  24 |   await gotoApp(page)
  25 |   await page.keyboard.press('Meta+2')
  26 |   await expect(page.locator('#split-pane')).toBeVisible()
  27 | })
  28 | 
  29 | test('Cmd+2 → second panneau contient un iframe', async ({ page }) => {
  30 |   await gotoApp(page)
  31 |   await page.keyboard.press('Meta+2')
  32 |   await expect(page.locator('#split-pane iframe')).toHaveCount(1)
  33 | })
  34 | 
  35 | test("Cmd+2 → l'iframe charge la liste des projets", async ({ page }) => {
  36 |   await gotoApp(page)
  37 |   await page.keyboard.press('Meta+2')
  38 |   const frame = page.frameLocator('#split-pane iframe')
> 39 |   await expect(frame.locator('.project-item').first()).toBeVisible()
     |                                                        ^ Error: expect(locator).toBeVisible() failed
  40 | })
  41 | 
  42 | test('Cmd+2 une deuxième fois → pas de second iframe créé (idempotent)', async ({ page }) => {
  43 |   await gotoApp(page)
  44 |   await page.keyboard.press('Meta+2')
  45 |   await page.keyboard.press('Meta+2')
  46 |   await expect(page.locator('#split-pane iframe')).toHaveCount(1)
  47 | })
  48 | 
  49 | // ─── Cmd+0 ferme le split ─────────────────────────────────────────────────────
  50 | 
  51 | test('Cmd+0 après Cmd+2 → second panneau masqué', async ({ page }) => {
  52 |   await gotoApp(page)
  53 |   await page.keyboard.press('Meta+2')
  54 |   await expect(page.locator('#split-pane')).toBeVisible()
  55 |   await page.keyboard.press('Meta+0')
  56 |   await expect(page.locator('#split-pane')).not.toBeVisible()
  57 | })
  58 | 
  59 | test('Cmd+0 sans split actif → notification erreur 6100', async ({ page }) => {
  60 |   await gotoApp(page)
  61 |   await page.keyboard.press('Meta+0')
  62 |   await expect(page.locator('.notification')).toBeVisible()
  63 |   await expect(page.locator('.notification')).toContainText(ERRORS[6100])
  64 | })
  65 | 
  66 | // ─── Maj+Tab bascule entre les panneaux ──────────────────────────────────────
  67 | 
  68 | test('Maj+Tab depuis pane 1 → focus dans le pane 2', async ({ page }) => {
  69 |   await gotoApp(page)
  70 |   await page.keyboard.press('Meta+2')
  71 |   await page.keyboard.press('Shift+Tab')
  72 |   const frame = page.frameLocator('#split-pane iframe')
  73 |   await expect(frame.locator('body')).toBeFocused()
  74 | })
  75 | 
  76 | test('Maj+Tab depuis pane 2 → focus revient dans pane 1', async ({ page }) => {
  77 |   await gotoApp(page)
  78 |   await page.keyboard.press('Meta+2')
  79 |   await page.keyboard.press('Shift+Tab') // → pane 2
  80 |   await page.keyboard.press('Shift+Tab') // → pane 1
  81 |   await expect(page.locator('#main-panel')).toBeVisible()
  82 |   // Le pane 1 est actif : une touche clavier doit répondre
  83 |   await page.keyboard.press('ArrowDown')
  84 |   await expect(page.locator('.project-item').nth(1)).toHaveClass(/selected/)
  85 | })
  86 | 
  87 | // ─── Cmd+1 active le pane 1 ───────────────────────────────────────────────────
  88 | 
  89 | test('Cmd+1 → focus dans pane 1', async ({ page }) => {
  90 |   await gotoApp(page)
  91 |   await page.keyboard.press('Meta+2')
  92 |   await page.keyboard.press('Shift+Tab') // → pane 2
  93 |   await page.keyboard.press('Meta+1')   // → pane 1
  94 |   await page.keyboard.press('ArrowDown')
  95 |   await expect(page.locator('.project-item').nth(1)).toHaveClass(/selected/)
  96 | })
  97 | 
```