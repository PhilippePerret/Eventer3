# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/brin-perso-propagation.spec.js >> cas 2 — ajouter un perso à un brin n'apparaît pas sur les events sans ce brin
- Location: specs/e2e/_tdd/brin-perso-propagation.spec.js:62:1

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.perso-item').nth(1)
Expected pattern: /selected/
Received string:  "perso-item"
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.perso-item').nth(1)
    14 × locator resolved to <div data-id="c2" tabindex="-1" class="perso-item">…</div>
       - unexpected value "perso-item"

```

```yaml
- text: Perso BB Bbb 🫥 BB perso
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
  23 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
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
  40 | // retire c1 de b1 (c1 = index 0, sélectionné à l'ouverture)
  41 | async function removeC1fromB1(page) {
  42 |   await openPersosFromB1(page)
  43 |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/checked/)
  44 |   await pane1(page).locator('.brin-item.selected').press(' ')
  45 |   await expect(pane1(page).locator('.perso-item').nth(0)).not.toHaveClass(/checked/)
  46 |   await closePersosThenBrins(page)
  47 | }
  48 | 
  49 | // ── CAS 1 : 2 events possèdent le même brin → modif du brin → les 2 events bougent ──
  50 | test("cas 1 — modifier un brin met à jour les DEUX events qui le possèdent", async ({ page }) => {
  51 |   await goToBrinPanel(page)
  52 |   await expect(marks(page, 0)).toContainText('AA') // e1
  53 |   await expect(marks(page, 1)).toContainText('AA') // e2
  54 | 
  55 |   await removeC1fromB1(page)
  56 | 
  57 |   await expect(marks(page, 0)).not.toContainText('AA') // e1 mis à jour
  58 |   await expect(marks(page, 1)).not.toContainText('AA') // e2 mis à jour
  59 | })
  60 | 
  61 | // ── CAS 2 : ajouter un perso au brin n'apparaît PAS sur un event sans le brin ──
  62 | test("cas 2 — ajouter un perso à un brin n'apparaît pas sur les events sans ce brin", async ({ page }) => {
  63 |   await goToBrinPanel(page)
  64 |   await expect(marks(page, 0)).not.toContainText('BB') // e1
  65 |   await expect(marks(page, 3)).not.toContainText('BB') // e4 (sans brin)
  66 | 
  67 |   // cocher c2 (index 1) sur b1
  68 |   await openPersosFromB1(page)
  69 |   await pane1(page).locator('.brin-item.selected').press('ArrowDown')
> 70 |   await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/selected/)
     |                                                           ^ Error: expect(locator).toHaveClass(expected) failed
  71 |   await pane1(page).locator('.brin-item.selected').press(' ')
  72 |   await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/checked/)
  73 |   await closePersosThenBrins(page)
  74 | 
  75 |   await expect(marks(page, 0)).toContainText('BB')      // e1 (a le brin)
  76 |   await expect(marks(page, 1)).toContainText('BB')      // e2 (a le brin)
  77 |   await expect(marks(page, 3)).not.toContainText('BB')  // e4 (PAS le brin)
  78 | })
  79 | 
  80 | // ── CAS 3 : perso sur 3 events (2 via brin, 1 direct) → retiré du brin → 2 perdent, 1 garde ──
  81 | test("cas 3 — retirer un perso du brin : les events via brin perdent la marque, l'event direct la garde", async ({ page }) => {
  82 |   await goToBrinPanel(page)
  83 |   await expect(marks(page, 0)).toContainText('AA') // e1 via brin
  84 |   await expect(marks(page, 1)).toContainText('AA') // e2 via brin
  85 |   await expect(marks(page, 2)).toContainText('AA') // e3 direct
  86 | 
  87 |   await removeC1fromB1(page)
  88 | 
  89 |   await expect(marks(page, 0)).not.toContainText('AA') // e1 perd
  90 |   await expect(marks(page, 1)).not.toContainText('AA') // e2 perd
  91 |   await expect(marks(page, 2)).toContainText('AA')     // e3 GARDE (direct)
  92 | })
  93 | 
```