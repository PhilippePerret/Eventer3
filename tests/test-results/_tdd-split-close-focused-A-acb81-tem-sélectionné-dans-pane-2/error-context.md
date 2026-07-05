# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/split-close-focused.spec.js >> Alt+0 pane-2 focusé → pane-1 navigue vers l'item sélectionné dans pane-2
- Location: specs/e2e/_tdd/split-close-focused.spec.js:35:1

# Error details

```
Test timeout of 15000ms exceeded.
```

```
Error: locator.click: Test timeout of 15000ms exceeded.
Call log:
  - waiting for locator('#pane-1').contentFrame().locator('.popup-select__option').filter({ hasText: 'Vertical' })

```

# Page snapshot

```yaml
- iframe [active] [ref=e3]:
  - generic [ref=f1e1]:
    - generic [ref=f1e7]:
      - generic [ref=f1e8]: Projet A
      - generic [ref=f1e11]: roman
    - generic:
      - generic: DISP MODE PROJECTS
    - contentinfo "Raccourcis clavier" [ref=f1e12]
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | //Origine: tests/specs/e2e/ui/split-close-focused.spec.js
  2  | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  4  | 
  5  | test.beforeEach(() => installFixtures('with-links'))
  6  | 
  7  | async function gotoApp(page) {
  8  |   await page.goto('/')
  9  |   await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  10 | }
  11 | 
  12 | async function openSplit(page) {
  13 |   await press(page, 'Alt+2')
> 14 |   await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
     |                                                                               ^ Error: locator.click: Test timeout of 15000ms exceeded.
  15 |   await expect(page.frameLocator('#pane-2').locator('.project-item').first()).toBeVisible()
  16 | }
  17 | 
  18 | // Navigue pane-2 jusqu'à e3 (sélectionné)
  19 | async function navigatePane2ToE3(page) {
  20 |   const pane2 = page.frameLocator('#pane-2')
  21 |   // Entrer dans le projet
  22 |   await pane2.locator('.project-item').first().click()
  23 |   await press(page, 'ArrowRight')
  24 |   await expect(pane2.locator('.event-item').first()).toHaveClass(/selected/)
  25 |   // Re-cliquer pour rétablir focus CDP
  26 |   await pane2.locator('.event-item').first().click()
  27 |   // Descendre jusqu'à e3
  28 |   await press(page, 'ArrowDown')
  29 |   await press(page, 'ArrowDown')
  30 |   await expect(pane2.locator('.event-item[data-id="e3"]')).toHaveClass(/selected/)
  31 | }
  32 | 
  33 | // ─── Alt+0 avec pane-2 focusé ────────────────────────────────────────────────
  34 | 
  35 | test('Alt+0 pane-2 focusé → pane-1 navigue vers l\'item sélectionné dans pane-2', async ({ page }) => {
  36 |   await gotoApp(page)
  37 |   await openSplit(page)
  38 |   // pane-2 a le focus après chargement
  39 |   await navigatePane2ToE3(page)
  40 |   await press(page, 'Alt+0')
  41 |   // pane-1 doit afficher e3 sélectionné
  42 |   await expect(pane1(page).locator('.event-item[data-id="e3"]')).toHaveClass(/selected/)
  43 | })
  44 | 
  45 | test('Alt+0 pane-2 focusé → pane-2 fermé', async ({ page }) => {
  46 |   await gotoApp(page)
  47 |   await openSplit(page)
  48 |   await navigatePane2ToE3(page)
  49 |   await press(page, 'Alt+0')
  50 |   await expect(page.locator('#pane-2')).not.toBeVisible()
  51 | })
  52 | 
  53 | test('Alt+0 pane-2 focusé → focus revient sur pane-1', async ({ page }) => {
  54 |   await gotoApp(page)
  55 |   await openSplit(page)
  56 |   await navigatePane2ToE3(page)
  57 |   await press(page, 'Alt+0')
  58 |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  59 | })
  60 | 
  61 | // ─── Alt+0 avec pane-1 focusé (comportement inchangé) ───────────────────────
  62 | 
  63 | test('Alt+0 pane-1 focusé → pane-1 reste dans son état courant', async ({ page }) => {
  64 |   await gotoApp(page)
  65 |   await openSplit(page)
  66 |   // Revenir sur pane-1
  67 |   await press(page, 'Alt+1')
  68 |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  69 |   // pane-1 est sur la liste de projets
  70 |   await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  71 |   await press(page, 'Alt+0')
  72 |   // pane-1 reste avec le projet sélectionné (pas de navigation forcée)
  73 |   await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  74 | })
  75 | 
  76 | // ─── Cas ListerProject en pane-2, ListerEvent en pane-1 ──────────────────────
  77 | 
  78 | test('Alt+0 pane-2 niveau projets, pane-1 en ListerEvent → pane-1 revient à la liste projets', async ({ page }) => {
  79 |   await gotoApp(page)
  80 |   await openSplit(page)
  81 |   // pane-1 : entrer dans le projet (ListerEvent)
  82 |   await press(page, 'Alt+1')
  83 |   await pane1(page).locator('.project-item').first().click()
  84 |   await press(page, 'ArrowRight')
  85 |   await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
  86 |   // pane-2 : rester au niveau projets, cliquer pour obtenir CDP focus
  87 |   const pane2 = page.frameLocator('#pane-2')
  88 |   await pane2.locator('.project-item').first().click()
  89 |   // Alt+0 depuis pane-2 (niveau projets — currentState lu depuis activeLister)
  90 |   await press(page, 'Alt+0')
  91 |   // pane-1 doit revenir à la liste des projets
  92 |   await expect(pane1(page).locator('.project-item').first()).toBeVisible()
  93 |   await expect(pane1(page).locator('.event-item').first()).not.toBeVisible()
  94 | })
  95 | 
```