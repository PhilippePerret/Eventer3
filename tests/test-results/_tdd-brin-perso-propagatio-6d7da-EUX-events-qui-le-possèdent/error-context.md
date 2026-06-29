# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/brin-perso-propagation.spec.js >> cas 1 — modifier un brin met à jour les DEUX events qui le possèdent
- Location: specs/e2e/_tdd/brin-perso-propagation.spec.js:74:1

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.perso-item').first()
Expected pattern: /checked/
Received string:  "perso-item selected"
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.perso-item').first()
    14 × locator resolved to <div data-id="c1" tabindex="-1" class="perso-item selected">…</div>
       - unexpected value "perso-item selected"

```

```yaml
- text: Perso AA Aaa 🫥 AA perso
```

# Test source

```ts
  1   | // Fixture persos-brin-propagation :
  2   | //   b1 (B1, perso_ids=[c1]) ; persos c1 (AA), c2 (BB)
  3   | //   e1, e2 : brin_ids=[b1]            → marque AA (via brin)
  4   | //   e3     : perso_ids=[c1], pas brin → marque AA (DIRECT)
  5   | //   e4     : vide                     → aucune marque (témoin)
  6   | //
  7   | // SPEC (refresh différé) : modifier les persos d'un brin (depuis le panneau brins)
  8   | // ne propage aux events qu'à la FERMETURE du panneau brins, et seulement aux events
  9   | // qui possèdent ce brin. Un event qui a le perso EN DIRECT (e3) n'est pas affecté.
  10  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  11  | import { test, expect, pane1, press, focusInfo, hasFocus } from '../__setup__.js'
  12  | 
  13  | test.beforeEach(() => {
  14  |   installFixtures('persos-brin-propagation')
  15  | })
  16  | 
  17  | const marks = (page, n) => pane1(page).locator('.event-item').nth(n).locator('.event-persos-marks')
  18  | 
  19  | // ── TEST SONDE : vérifier que le bon élément est focusé à chaque étape ──
  20  | // (log de la vérité + assertion hasFocus → pas de faux positif possible)
  21  | test("focus suit le panneau actif à chaque transition", async ({ page }) => {
  22  |   await page.goto('/')
  23  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  24  |   console.log('[FOCUS] après goto :', await focusInfo(page))
  25  |   await hasFocus(page, '.project-item.selected')
  26  | 
  27  |   await press(page, 'ArrowRight')
  28  |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  29  |   console.log('[FOCUS] après → (entrée projet) :', await focusInfo(page))
  30  |   await hasFocus(page, '.event-item.selected')
  31  | 
  32  |   await press(page, 'b')
  33  |   await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  34  |   console.log('[FOCUS] après b (panneau brins) :', await focusInfo(page))
  35  |   await hasFocus(page, '.brin-item.selected')
  36  | 
  37  |   await press(page, 'p')
  38  |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  39  |   console.log('[FOCUS] après p (panneau persos) :', await focusInfo(page))
  40  |   await hasFocus(page, '.perso-item.selected')
  41  | })
  42  | 
  43  | async function goToBrinPanel(page) {
  44  |   await page.goto('/')
  45  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  46  |   await press(page, 'ArrowRight')
  47  |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  48  |   await press(page, 'b')
  49  |   await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  50  | }
  51  | 
  52  | async function openPersosFromB1(page) {
  53  |   await press(page, 'p')
  54  |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  55  | }
  56  | 
  57  | async function closePersosThenBrins(page) {
  58  |   await press(page, 'p')
  59  |   await expect(pane1(page).locator('#persos-panel')).not.toBeVisible()
  60  |   await press(page, 'b')
  61  |   await expect(pane1(page).locator('#brins-panel')).not.toBeVisible()
  62  | }
  63  | 
  64  | // retire c1 de b1 (c1 = index 0, sélectionné à l'ouverture)
  65  | async function removeC1fromB1(page) {
  66  |   await openPersosFromB1(page)
> 67  |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/checked/)
      |                                                           ^ Error: expect(locator).toHaveClass(expected) failed
  68  |   await press(page, ' ')
  69  |   await expect(pane1(page).locator('.perso-item').nth(0)).not.toHaveClass(/checked/)
  70  |   await closePersosThenBrins(page)
  71  | }
  72  | 
  73  | // ── CAS 1 : 2 events possèdent le même brin → modif du brin → les 2 events bougent ──
  74  | test("cas 1 — modifier un brin met à jour les DEUX events qui le possèdent", async ({ page }) => {
  75  |   await goToBrinPanel(page)
  76  |   await expect(marks(page, 0)).toContainText('AA') // e1
  77  |   await expect(marks(page, 1)).toContainText('AA') // e2
  78  | 
  79  |   await removeC1fromB1(page)
  80  | 
  81  |   await expect(marks(page, 0)).not.toContainText('AA') // e1 mis à jour
  82  |   await expect(marks(page, 1)).not.toContainText('AA') // e2 mis à jour
  83  | })
  84  | 
  85  | // ── CAS 2 : ajouter un perso au brin n'apparaît PAS sur un event sans le brin ──
  86  | test("cas 2 — ajouter un perso à un brin n'apparaît pas sur les events sans ce brin", async ({ page }) => {
  87  |   await goToBrinPanel(page)
  88  |   await expect(marks(page, 0)).not.toContainText('BB') // e1
  89  |   await expect(marks(page, 3)).not.toContainText('BB') // e4 (sans brin)
  90  | 
  91  |   // cocher c2 (index 1) sur b1
  92  |   await openPersosFromB1(page)
  93  |   await press(page, 'ArrowDown')
  94  |   await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/selected/)
  95  |   await press(page, ' ')
  96  |   await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/checked/)
  97  |   await closePersosThenBrins(page)
  98  | 
  99  |   await expect(marks(page, 0)).toContainText('BB')      // e1 (a le brin)
  100 |   await expect(marks(page, 1)).toContainText('BB')      // e2 (a le brin)
  101 |   await expect(marks(page, 3)).not.toContainText('BB')  // e4 (PAS le brin)
  102 | })
  103 | 
  104 | // ── CAS 3 : perso sur 3 events (2 via brin, 1 direct) → retiré du brin → 2 perdent, 1 garde ──
  105 | test("cas 3 — retirer un perso du brin : les events via brin perdent la marque, l'event direct la garde", async ({ page }) => {
  106 |   await goToBrinPanel(page)
  107 |   await expect(marks(page, 0)).toContainText('AA') // e1 via brin
  108 |   await expect(marks(page, 1)).toContainText('AA') // e2 via brin
  109 |   await expect(marks(page, 2)).toContainText('AA') // e3 direct
  110 | 
  111 |   await removeC1fromB1(page)
  112 | 
  113 |   await expect(marks(page, 0)).not.toContainText('AA') // e1 perd
  114 |   await expect(marks(page, 1)).not.toContainText('AA') // e2 perd
  115 |   await expect(marks(page, 2)).toContainText('AA')     // e3 GARDE (direct)
  116 | })
  117 | 
```