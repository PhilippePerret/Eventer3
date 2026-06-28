# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/brin-perso-propagation.spec.js >> retirer un perso d'un brin met à jour les events possédant le brin, mais pas l'event qui l'a en direct
- Location: specs/e2e/_tdd/brin-perso-propagation.spec.js:41:6

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#pane-1').contentFrame().locator('#events-panel')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('#events-panel')

```

```yaml
- text: Projet A --- roman
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | // Fixture persos-brin-propagation :
  2  | //   b1 (B1, perso_ids=[c1]) ; persos c1 (AA), c2 (BB)
  3  | //   e1, e2 : brin_ids=[b1]            → marque AA (via brin)
  4  | //   e3     : perso_ids=[c1], pas brin → marque AA (DIRECT)
  5  | //   e4     : vide                     → aucune marque (témoin)
  6  | //
  7  | // SPEC (refresh différé) : modifier les persos d'un brin (depuis le panneau brins)
  8  | // ne propage aux events qu'à la FERMETURE du panneau brins, et seulement aux events
  9  | // qui possèdent ce brin. Un event qui a le perso EN DIRECT (e3) n'est pas affecté.
  10 | import { installFixtures } from '../../../helpers/install-fixtures.js'
  11 | import { test, expect, pane1 } from '../__setup__.js'
  12 | 
  13 | test.beforeEach(() => {
  14 |   installFixtures('persos-brin-propagation')
  15 | })
  16 | 
  17 | const marks = (page, n) => pane1(page).locator('.event-item').nth(n).locator('.event-persos-marks')
  18 | 
  19 | async function goToBrinPanel(page) {
  20 |   await page.goto('/')
  21 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  22 |   await pane1(page).locator('.project-item.selected').press('ArrowRight')
> 23 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
     |                                                      ^ Error: expect(locator).toBeVisible() failed
  24 |   await pane1(page).locator('.event-item.selected').press('b')
  25 |   await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  26 | }
  27 | 
  28 | async function openPersosFromB1(page) {
  29 |   await pane1(page).locator('.brin-item.selected').press('p')
  30 |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  31 | }
  32 | 
  33 | async function closePersosThenBrins(page) {
  34 |   await pane1(page).locator('.brin-item.selected').press('p')
  35 |   await expect(pane1(page).locator('#persos-panel')).not.toBeVisible()
  36 |   await pane1(page).locator('.brin-item.selected').press('b')
  37 |   await expect(pane1(page).locator('#brins-panel')).not.toBeVisible()
  38 | }
  39 | 
  40 | // ── CAS 1 + 3 : retirer un perso du brin ────────────────────────────────────
  41 | test.only("retirer un perso d'un brin met à jour les events possédant le brin, mais pas l'event qui l'a en direct", async ({ page }) => {
  42 |   await goToBrinPanel(page)
  43 |   // état initial : AA partout sauf e4
  44 |   await expect(marks(page, 0)).toContainText('AA') // e1 (via brin)
  45 |   await expect(marks(page, 1)).toContainText('AA') // e2 (via brin)
  46 |   await expect(marks(page, 2)).toContainText('AA') // e3 (direct)
  47 |   await expect(marks(page, 3)).not.toContainText('AA') // e4
  48 | 
  49 |   // décocher c1 (index 0, sélectionné à l'ouverture) sur b1
  50 |   await openPersosFromB1(page)
  51 |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/checked/)
  52 |   await pane1(page).locator('.brin-item.selected').press(' ')
  53 |   await expect(pane1(page).locator('.perso-item').nth(0)).not.toHaveClass(/checked/)
  54 | 
  55 |   await closePersosThenBrins(page)
  56 | 
  57 |   // e1, e2 perdent AA (ils ont le brin) ; e3 GARDE AA (direct) ; e4 toujours rien
  58 |   await expect(marks(page, 0)).not.toContainText('AA')
  59 |   await expect(marks(page, 1)).not.toContainText('AA')
  60 |   await expect(marks(page, 2)).toContainText('AA')
  61 |   await expect(marks(page, 3)).not.toContainText('AA')
  62 | })
  63 | 
  64 | // ── CAS 2 : ajouter un perso au brin ne touche pas les events sans le brin ───
  65 | test.only("ajouter un perso à un brin n'apparaît que sur les events possédant le brin", async ({ page }) => {
  66 |   await goToBrinPanel(page)
  67 |   await expect(marks(page, 0)).not.toContainText('BB')
  68 |   await expect(marks(page, 1)).not.toContainText('BB')
  69 |   await expect(marks(page, 2)).not.toContainText('BB')
  70 |   await expect(marks(page, 3)).not.toContainText('BB')
  71 | 
  72 |   // cocher c2 (index 1) sur b1
  73 |   await openPersosFromB1(page)
  74 |   await pane1(page).locator('.brin-item.selected').press('ArrowDown')
  75 |   await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/selected/)
  76 |   await pane1(page).locator('.brin-item.selected').press(' ')
  77 |   await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/checked/)
  78 | 
  79 |   await closePersosThenBrins(page)
  80 | 
  81 |   // BB apparaît sur e1, e2 (ils ont b1) ; PAS sur e3 ni e4 (pas le brin)
  82 |   await expect(marks(page, 0)).toContainText('BB')
  83 |   await expect(marks(page, 1)).toContainText('BB')
  84 |   await expect(marks(page, 2)).not.toContainText('BB')
  85 |   await expect(marks(page, 3)).not.toContainText('BB')
  86 | })
  87 | 
```