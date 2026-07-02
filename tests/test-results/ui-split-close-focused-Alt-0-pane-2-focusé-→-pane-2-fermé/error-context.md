# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/split-close-focused.spec.js >> Alt+0 pane-2 focusé → pane-2 fermé
- Location: specs/e2e/ui/split-close-focused.spec.js:44:1

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
      - generic [ref=f1e10]: roman
    - generic:
      - generic: DISP MODE PROJECTS
    - contentinfo "Raccourcis clavier" [ref=f1e11]
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  2  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  3  | 
  4  | test.beforeEach(() => installFixtures('with-links'))
  5  | 
  6  | async function gotoApp(page) {
  7  |   await page.goto('/')
  8  |   await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  9  | }
  10 | 
  11 | async function openSplit(page) {
  12 |   await press(page, 'Alt+2')
> 13 |   await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
     |                                                                               ^ Error: locator.click: Test timeout of 15000ms exceeded.
  14 |   await expect(page.frameLocator('#pane-2').locator('.project-item').first()).toBeVisible()
  15 | }
  16 | 
  17 | // Navigue pane-2 jusqu'à e3 (sélectionné)
  18 | async function navigatePane2ToE3(page) {
  19 |   const pane2 = page.frameLocator('#pane-2')
  20 |   // Entrer dans le projet
  21 |   await pane2.locator('.project-item').first().click()
  22 |   await press(page, 'ArrowRight')
  23 |   await expect(pane2.locator('.event-item').first()).toHaveClass(/selected/)
  24 |   // Re-cliquer pour rétablir focus CDP
  25 |   await pane2.locator('.event-item').first().click()
  26 |   // Descendre jusqu'à e3
  27 |   await press(page, 'ArrowDown')
  28 |   await press(page, 'ArrowDown')
  29 |   await expect(pane2.locator('.event-item[data-id="e3"]')).toHaveClass(/selected/)
  30 | }
  31 | 
  32 | // ─── Alt+0 avec pane-2 focusé ────────────────────────────────────────────────
  33 | 
  34 | test('Alt+0 pane-2 focusé → pane-1 navigue vers l\'item sélectionné dans pane-2', async ({ page }) => {
  35 |   await gotoApp(page)
  36 |   await openSplit(page)
  37 |   // pane-2 a le focus après chargement
  38 |   await navigatePane2ToE3(page)
  39 |   await press(page, 'Alt+0')
  40 |   // pane-1 doit afficher e3 sélectionné
  41 |   await expect(pane1(page).locator('.event-item[data-id="e3"]')).toHaveClass(/selected/)
  42 | })
  43 | 
  44 | test('Alt+0 pane-2 focusé → pane-2 fermé', async ({ page }) => {
  45 |   await gotoApp(page)
  46 |   await openSplit(page)
  47 |   await navigatePane2ToE3(page)
  48 |   await press(page, 'Alt+0')
  49 |   await expect(page.locator('#pane-2')).not.toBeVisible()
  50 | })
  51 | 
  52 | test('Alt+0 pane-2 focusé → focus revient sur pane-1', async ({ page }) => {
  53 |   await gotoApp(page)
  54 |   await openSplit(page)
  55 |   await navigatePane2ToE3(page)
  56 |   await press(page, 'Alt+0')
  57 |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  58 | })
  59 | 
  60 | // ─── Alt+0 avec pane-1 focusé (comportement inchangé) ───────────────────────
  61 | 
  62 | test('Alt+0 pane-1 focusé → pane-1 reste dans son état courant', async ({ page }) => {
  63 |   await gotoApp(page)
  64 |   await openSplit(page)
  65 |   // Revenir sur pane-1
  66 |   await press(page, 'Alt+1')
  67 |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  68 |   // pane-1 est sur la liste de projets
  69 |   await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  70 |   await press(page, 'Alt+0')
  71 |   // pane-1 reste avec le projet sélectionné (pas de navigation forcée)
  72 |   await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  73 | })
  74 | 
  75 | // ─── Cas ListerProject en pane-2, ListerEvent en pane-1 ──────────────────────
  76 | 
  77 | test('Alt+0 pane-2 niveau projets, pane-1 en ListerEvent → pane-1 revient à la liste projets', async ({ page }) => {
  78 |   await gotoApp(page)
  79 |   await openSplit(page)
  80 |   // pane-1 : entrer dans le projet (ListerEvent)
  81 |   await press(page, 'Alt+1')
  82 |   await pane1(page).locator('.project-item').first().click()
  83 |   await press(page, 'ArrowRight')
  84 |   await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
  85 |   // pane-2 : rester au niveau projets, cliquer pour obtenir CDP focus
  86 |   const pane2 = page.frameLocator('#pane-2')
  87 |   await pane2.locator('.project-item').first().click()
  88 |   // Alt+0 depuis pane-2 (niveau projets — currentState lu depuis activeLister)
  89 |   await press(page, 'Alt+0')
  90 |   // pane-1 doit revenir à la liste des projets
  91 |   await expect(pane1(page).locator('.project-item').first()).toBeVisible()
  92 |   await expect(pane1(page).locator('.event-item').first()).not.toBeVisible()
  93 | })
  94 | 
```