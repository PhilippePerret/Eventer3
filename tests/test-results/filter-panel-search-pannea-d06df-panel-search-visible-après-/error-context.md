# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: filter/panel-search.spec.js >> panneau brins : champ .panel-search visible après ':'
- Location: specs/e2e/filter/panel-search.spec.js:25:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#pane-1').contentFrame().locator('#brins-panel .filter-bar')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('#brins-panel .filter-bar')

```

```yaml
- text: "✓ Mon brin MON brin #d9c8a9 Autre brin AUT brin #c8d9a9 Événement 1 — MON CY RO Événement 2 — DISP MODE NESTING"
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  2   | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3   | 
  4   | // Fixtures:
  5   | //   with-brins-and-persos : b1="Mon brin", b2="Autre brin", c1="Cyrano", c2="Roxane"
  6   | //   with-styles           : titre, note-rouge
  7   | 
  8   | async function goToListerEvent(page, fixture) {
  9   |   installFixtures(fixture)
  10  |   await page.goto('/')
  11  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  12  |   await press(page, 'ArrowRight')
  13  |   await press(page, 'ArrowRight')
  14  |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  15  | }
  16  | 
  17  | async function revealFilter(page, panelSelector = '#events-panel') {
  18  |   await expect(pane1(page).locator(panelSelector)).toBeVisible()
  19  |   await press(page, ':')
> 20  |   await expect(pane1(page).locator(`${panelSelector} .filter-bar`)).toBeVisible()
      |                                                                     ^ Error: expect(locator).toBeVisible() failed
  21  | }
  22  | 
  23  | // ─── ListerBrin ───────────────────────────────────────────────────────────────
  24  | 
  25  | test("panneau brins : champ .panel-search visible après ':'", async ({ page }) => {
  26  |   await goToListerEvent(page, 'with-brins-and-persos')
  27  |   await press(page, 'b')
  28  |   await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  29  |   await revealFilter(page, '#brins-panel')
  30  |   await expect(pane1(page).locator('#brins-panel .panel-search')).toBeVisible()
  31  | })
  32  | 
  33  | test("panneau brins : taper 'mon' cache 'Autre brin'", async ({ page }) => {
  34  |   await goToListerEvent(page, 'with-brins-and-persos')
  35  |   await press(page, 'b')
  36  |   await expect(pane1(page).locator('.brin-row')).toHaveCount(2)
  37  |   await revealFilter(page, '#brins-panel')
  38  |   await pane1(page).locator('#brins-panel .panel-search').fill('mon')
  39  |   await expect(pane1(page).locator('.brin-row:not(.hidden)')).toHaveCount(1)
  40  |   await expect(pane1(page).locator('.brin-row.hidden')).toHaveCount(1)
  41  | })
  42  | 
  43  | test("panneau brins : vider le champ réaffiche tout", async ({ page }) => {
  44  |   await goToListerEvent(page, 'with-brins-and-persos')
  45  |   await press(page, 'b')
  46  |   await revealFilter(page, '#brins-panel')
  47  |   await pane1(page).locator('#brins-panel .panel-search').fill('mon')
  48  |   await expect(pane1(page).locator('.brin-row:not(.hidden)')).toHaveCount(1)
  49  |   await pane1(page).locator('#brins-panel .panel-search').fill('')
  50  |   await expect(pane1(page).locator('.brin-row:not(.hidden)')).toHaveCount(2)
  51  | })
  52  | 
  53  | test("panneau brins : filtre remis à zéro à la fermeture/réouverture", async ({ page }) => {
  54  |   await goToListerEvent(page, 'with-brins-and-persos')
  55  |   await press(page, 'b')
  56  |   await revealFilter(page, '#brins-panel')
  57  |   await pane1(page).locator('#brins-panel .panel-search').fill('mon')
  58  |   await expect(pane1(page).locator('.brin-row:not(.hidden)')).toHaveCount(1)
  59  |   await press(page, 'Escape') // fermer
  60  |   await press(page, 'b')     // rouvrir
  61  |   await expect(pane1(page).locator('.brin-row:not(.hidden)')).toHaveCount(2)
  62  |   const inputVal = await pane1(page).locator('#brins-panel .panel-search').inputValue()
  63  |   expect(inputVal).toBe('')
  64  | })
  65  | 
  66  | // ─── ListerPerso ─────────────────────────────────────────────────────────────
  67  | 
  68  | test("panneau persos : champ .panel-search visible après ':'", async ({ page }) => {
  69  |   await goToListerEvent(page, 'with-brins-and-persos')
  70  |   await press(page, 'p')
  71  |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  72  |   await revealFilter(page, '#persos-panel')
  73  |   await expect(pane1(page).locator('#persos-panel .panel-search')).toBeVisible()
  74  | })
  75  | 
  76  | test("panneau persos : taper 'cyr' cache 'Roxane'", async ({ page }) => {
  77  |   await goToListerEvent(page, 'with-brins-and-persos')
  78  |   await press(page, 'p')
  79  |   await expect(pane1(page).locator('.perso-row')).toHaveCount(2)
  80  |   await revealFilter(page, '#persos-panel')
  81  |   await pane1(page).locator('#persos-panel .panel-search').fill('cyr')
  82  |   await expect(pane1(page).locator('.perso-row:not(.hidden)')).toHaveCount(1)
  83  |   await expect(pane1(page).locator('.perso-row.hidden')).toHaveCount(1)
  84  | })
  85  | 
  86  | // ─── ListerStyle ─────────────────────────────────────────────────────────────
  87  | 
  88  | test("panneau styles : champ .panel-search visible après ':'", async ({ page }) => {
  89  |   await goToListerEvent(page, 'with-styles')
  90  |   await press(page, 's')
  91  |   await expect(pane1(page).locator('#style-panel')).toBeVisible()
  92  |   await revealFilter(page, '#style-panel')
  93  |   await expect(pane1(page).locator('#style-panel .panel-search')).toBeVisible()
  94  | })
  95  | 
  96  | test("panneau styles : taper 'titre' cache 'note-rouge'", async ({ page }) => {
  97  |   await goToListerEvent(page, 'with-styles')
  98  |   await press(page, 's')
  99  |   await expect(pane1(page).locator('.style-row')).toHaveCount(2)
  100 |   await revealFilter(page, '#style-panel')
  101 |   await pane1(page).locator('#style-panel .panel-search').fill('titre')
  102 |   await expect(pane1(page).locator('.style-row:not(.hidden)')).toHaveCount(1)
  103 |   await expect(pane1(page).locator('.style-row.hidden')).toHaveCount(1)
  104 | })
  105 | 
  106 | // ─── ListerEvent ─────────────────────────────────────────────────────────────
  107 | 
  108 | test("liste events : champ .panel-search visible après ':'", async ({ page }) => {
  109 |   await goToListerEvent(page, 'with-brins-and-persos')
  110 |   await revealFilter(page, '#events-panel')
  111 |   await expect(pane1(page).locator('#events-panel .panel-search')).toBeVisible()
  112 | })
  113 | 
  114 | test("liste projets : champ .panel-search visible après ':'", async ({ page }) => {
  115 |   installFixtures('with-brins-and-persos')
  116 |   await page.goto('/')
  117 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  118 |   await revealFilter(page, '#events-panel')
  119 |   await expect(pane1(page).locator('#events-panel .panel-search')).toBeVisible()
  120 | })
```