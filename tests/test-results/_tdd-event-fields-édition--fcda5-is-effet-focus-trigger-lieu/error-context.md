# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/event-fields.spec.js >> édition : TAB depuis effet focus trigger lieu
- Location: specs/e2e/_tdd/event-fields.spec.js:67:1

# Error details

```
Error: expect(locator).toBeFocused() failed

Locator:  locator('#pane-1').contentFrame().locator('.event-item.editing [data-field="lieu"]')
Expected: focused
Received: inactive
Timeout:  5000ms

Call log:
  - Expect "toBeFocused" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.event-item.editing [data-field="lieu"]')
    14 × locator resolved to <span tabindex="0" data-field="lieu" class="event-lieu display-select"></span>
       - unexpected value "inactive"

```

```yaml
- text: Scène du bal ébauche ☀️ Matin Arrivée à Paris développement 🌨️ Nuit La trahison ébauche ☀️ Jour DISP MODE NESTING
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  2   | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3   | 
  4   | // Fixture with-event-states :
  5   | //   e1="Scène du bal"    meteo='ps'(☀️)  effet='ma'(Matin) lieu=null
  6   | //   e2="Arrivée à Paris" meteo='pl'(🌨️) effet='nu'(Nuit)  lieu=null
  7   | //   e3="La trahison"     meteo='ps'(☀️)  effet='jr'(Jour)  lieu=null
  8   | 
  9   | async function goToListerEvent(page) {
  10  |   await installFixtures('with-event-states')
  11  |   await page.goto('/')
  12  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  13  |   await press(page, 'ArrowRight')
  14  |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  15  | }
  16  | 
  17  | async function enterEditionOnFirst(page) {
  18  |   await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
  19  |   await press(page, 'Enter')
  20  |   await expect(pane1(page).locator('.event-item.editing')).toBeVisible()
  21  |   await expect(pane1(page).locator('.event-item.editing [data-field="title"]')).toBeFocused()
  22  | }
  23  | 
  24  | // ─── Affichage ────────────────────────────────────────────────────────────────
  25  | 
  26  | test("event row : badge météo affiché (e1 → ☀️)", async ({ page }) => {
  27  |   await goToListerEvent(page)
  28  |   await expect(pane1(page).locator('.event-item').first().locator('.event-meteo')).toHaveText('☀️')
  29  | })
  30  | 
  31  | test("event row : badge effet affiché (e1 → Matin)", async ({ page }) => {
  32  |   await goToListerEvent(page)
  33  |   await expect(pane1(page).locator('.event-item').first().locator('.event-effet')).toHaveText('Matin')
  34  | })
  35  | 
  36  | test("event row : badge lieu vide si non défini", async ({ page }) => {
  37  |   await goToListerEvent(page)
  38  |   await expect(pane1(page).locator('.event-item').first().locator('.event-lieu')).toHaveText('')
  39  | })
  40  | 
  41  | // ─── TAB en mode édition ──────────────────────────────────────────────────────
  42  | 
  43  | test("édition : TAB depuis titre focus trigger état", async ({ page }) => {
  44  |   await goToListerEvent(page)
  45  |   await enterEditionOnFirst(page)
  46  |   await press(page, 'Tab')
  47  |   await expect(pane1(page).locator('.event-item.editing [data-field="state"]')).toBeFocused()
  48  | })
  49  | 
  50  | test("édition : TAB depuis état focus trigger météo", async ({ page }) => {
  51  |   await goToListerEvent(page)
  52  |   await enterEditionOnFirst(page)
  53  |   await press(page, 'Tab') // → state
  54  |   await press(page, 'Tab') // → meteo
  55  |   await expect(pane1(page).locator('.event-item.editing [data-field="meteo"]')).toBeFocused()
  56  | })
  57  | 
  58  | test("édition : TAB depuis météo focus trigger effet", async ({ page }) => {
  59  |   await goToListerEvent(page)
  60  |   await enterEditionOnFirst(page)
  61  |   await press(page, 'Tab') // → state
  62  |   await press(page, 'Tab') // → meteo
  63  |   await press(page, 'Tab') // → effet
  64  |   await expect(pane1(page).locator('.event-item.editing [data-field="effet"]')).toBeFocused()
  65  | })
  66  | 
  67  | test("édition : TAB depuis effet focus trigger lieu", async ({ page }) => {
  68  |   await goToListerEvent(page)
  69  |   await enterEditionOnFirst(page)
  70  |   await press(page, 'Tab') // → state
  71  |   await press(page, 'Tab') // → meteo
  72  |   await press(page, 'Tab') // → effet
  73  |   await press(page, 'Tab') // → lieu
> 74  |   await expect(pane1(page).locator('.event-item.editing [data-field="lieu"]')).toBeFocused()
      |                                                                                ^ Error: expect(locator).toBeFocused() failed
  75  | })
  76  | 
  77  | test("édition : TAB depuis lieu revient au titre", async ({ page }) => {
  78  |   await goToListerEvent(page)
  79  |   await enterEditionOnFirst(page)
  80  |   for (let i = 0; i < 5; i++) await press(page, 'Tab') // titre→state→meteo→effet→lieu→titre
  81  |   await expect(pane1(page).locator('.event-item.editing [data-field="title"]')).toBeFocused()
  82  | })
  83  | 
  84  | // ─── Ouverture popup ─────────────────────────────────────────────────────────
  85  | 
  86  | test("édition : ArrowDown sur trigger météo ouvre popup", async ({ page }) => {
  87  |   await goToListerEvent(page)
  88  |   await enterEditionOnFirst(page)
  89  |   await press(page, 'Tab') // → state
  90  |   await press(page, 'Tab') // → meteo
  91  |   await press(page, 'ArrowDown')
  92  |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  93  | })
  94  | 
  95  | test("édition : ArrowDown sur trigger effet ouvre popup", async ({ page }) => {
  96  |   await goToListerEvent(page)
  97  |   await enterEditionOnFirst(page)
  98  |   await press(page, 'Tab') // → state
  99  |   await press(page, 'Tab') // → meteo
  100 |   await press(page, 'Tab') // → effet
  101 |   await press(page, 'ArrowDown')
  102 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  103 | })
  104 | 
  105 | test("édition : ArrowDown sur trigger lieu ouvre popup", async ({ page }) => {
  106 |   await goToListerEvent(page)
  107 |   await enterEditionOnFirst(page)
  108 |   await press(page, 'Tab') // → state
  109 |   await press(page, 'Tab') // → meteo
  110 |   await press(page, 'Tab') // → effet
  111 |   await press(page, 'Tab') // → lieu
  112 |   await press(page, 'ArrowDown')
  113 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  114 | })
  115 | 
  116 | // ─── Persistance ─────────────────────────────────────────────────────────────
  117 | 
  118 | test("météo : sélection 'pl' persiste après sauvegarde", async ({ page }) => {
  119 |   await goToListerEvent(page)
  120 |   await enterEditionOnFirst(page)
  121 |   await press(page, 'Tab') // → state
  122 |   await press(page, 'Tab') // → meteo
  123 |   await press(page, 'ArrowDown') // ouvre popup
  124 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  125 |   await pane1(page).locator('.popup-select__option[data-value="pl"]').click()
  126 |   await press(page, 'Enter') // confirme edition
  127 |   await expect(pane1(page).locator('.event-item').first().locator('.event-meteo')).toHaveText('🌨️')
  128 |   // Reload et vérifier persistance
  129 |   await page.waitForLoadState('networkidle')
  130 |   await page.reload()
  131 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  132 |   await press(page, 'ArrowRight')
  133 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  134 |   await expect(pane1(page).locator('.event-item').first().locator('.event-meteo')).toHaveText('🌨️')
  135 | })
  136 | 
  137 | test("lieu : sélection 'ext' persiste après sauvegarde", async ({ page }) => {
  138 |   await goToListerEvent(page)
  139 |   await enterEditionOnFirst(page)
  140 |   await press(page, 'Tab') // → state
  141 |   await press(page, 'Tab') // → meteo
  142 |   await press(page, 'Tab') // → effet
  143 |   await press(page, 'Tab') // → lieu
  144 |   await press(page, 'ArrowDown') // ouvre popup
  145 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  146 |   await pane1(page).locator('.popup-select__option[data-value="ext"]').click()
  147 |   await press(page, 'Enter') // confirme edition
  148 |   await expect(pane1(page).locator('.event-item').first().locator('.event-lieu')).toHaveText('Extérieur')
  149 |   // Reload et vérifier persistance
  150 |   await page.waitForLoadState('networkidle')
  151 |   await page.reload()
  152 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  153 |   await press(page, 'ArrowRight')
  154 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  155 |   await expect(pane1(page).locator('.event-item').first().locator('.event-lieu')).toHaveText('Extérieur')
  156 | })
  157 | 
  158 | // ─── Incompatibilités ────────────────────────────────────────────────────────
  159 | 
  160 | // e1 a meteo='ps' → effets incompatibles : au, cr, nu
  161 | test("incompatibilité : meteo=ps → effet popup grise au/cr/nu", async ({ page }) => {
  162 |   await goToListerEvent(page)
  163 |   await enterEditionOnFirst(page) // e1 : meteo='ps'
  164 |   await press(page, 'Tab') // → state
  165 |   await press(page, 'Tab') // → meteo
  166 |   await press(page, 'Tab') // → effet
  167 |   await press(page, 'ArrowDown') // ouvre popup effet
  168 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  169 |   await expect(pane1(page).locator('.popup-select__option[data-value="au"]')).toHaveClass(/disabled/)
  170 |   await expect(pane1(page).locator('.popup-select__option[data-value="cr"]')).toHaveClass(/disabled/)
  171 |   await expect(pane1(page).locator('.popup-select__option[data-value="nu"]')).toHaveClass(/disabled/)
  172 |   await expect(pane1(page).locator('.popup-select__option[data-value="ma"]')).not.toHaveClass(/disabled/)
  173 |   await press(page, 'Escape')
  174 | })
```