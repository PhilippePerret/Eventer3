# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: perso/perso-no-perso.spec.js >> 'Votre protagoniste' survit au rechargement
- Location: specs/e2e/perso/perso-no-perso.spec.js:34:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('#pane-1').contentFrame().locator('.perso-item')
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.perso-item')
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

# Page snapshot

```yaml
- iframe [active] [ref=e3]:
  - generic [ref=f3e1]:
    - generic [ref=f3e6]:
      - generic [ref=f3e9]:
        - generic [ref=f3e10]: Événement 1
        - generic [ref=f3e12]: —
        - generic [ref=f3e16]: AUT
      - generic [ref=f3e19]:
        - generic [ref=f3e20]: Événement 2
        - generic [ref=f3e22]: —
    - generic:
      - generic: DISP MODE NESTING
    - contentinfo "Raccourcis clavier" [ref=f3e23]
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures'
  2  | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3  | 
  4  | test.beforeEach(() => {
  5  |   installFixtures('with-brins')
  6  | })
  7  | 
  8  | // Fixture with-brins :
  9  | //   project-a, events e1/e2, brins b1/b2 — AUCUN personnage défini
  10 | 
  11 | async function openPersoPanel(page) {
  12 |   await page.goto('/')
  13 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  14 |   await press(page, 'ArrowRight')
  15 |   await press(page, 'ArrowRight')
  16 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  17 |   await press(page, 'p')
  18 |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  19 | }
  20 | 
  21 | // ─── Règle : toujours au moins un élément ─────────────────────────────────────
  22 | 
  23 | test("ouvrir le panneau sans perso existant → 'Votre protagoniste' créé automatiquement", async ({ page }) => {
  24 |   await openPersoPanel(page)
  25 |   await expect(pane1(page).locator('.perso-item')).toHaveCount(1)
  26 |   await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-item__title')).toHaveText('Votre protagoniste')
  27 | })
  28 | 
  29 | test("le perso auto-créé est sélectionné", async ({ page }) => {
  30 |   await openPersoPanel(page)
  31 |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
  32 | })
  33 | 
  34 | test("'Votre protagoniste' survit au rechargement", async ({ page }) => {
  35 |   await openPersoPanel(page)
  36 |   await page.waitForLoadState('networkidle')
  37 |   await page.reload()
  38 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  39 |   await press(page, 'ArrowRight')
  40 |   await press(page, 'ArrowRight')
  41 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  42 |   await press(page, 'p')
  43 |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
> 44 |   await expect(pane1(page).locator('.perso-item')).toHaveCount(1)
     |                                                    ^ Error: expect(locator).toHaveCount(expected) failed
  45 |   await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-item__title')).toHaveText('Votre protagoniste')
  46 | })
  47 | 
```