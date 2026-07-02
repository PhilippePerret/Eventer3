# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: filter/filter-bar.spec.js >> état : cliquer le bouton ouvre le popup
- Location: specs/e2e/filter/filter-bar.spec.js:124:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#pane-1').contentFrame().locator('#events-panel .filter-bar')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('#events-panel .filter-bar')

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
  5   | //   e1="Scène du bal"    state=1(ébauche)      meteo='ps' effet='ma'
  6   | //   e2="Arrivée à Paris" state=2(développement) meteo='pl' effet='nu'
  7   | //   e3="La trahison"     state=1(ébauche)      meteo='ps' effet='jr'
  8   | 
  9   | async function goToListerEvent(page, fixture = 'with-event-states') {
  10  |   installFixtures(fixture)
  11  |   await page.goto('/')
  12  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  13  |   await press(page, 'ArrowRight')
  14  |   await press(page, 'ArrowRight')
  15  |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  16  |   await press(page, ':')
> 17  |   await expect(pane1(page).locator('#events-panel .filter-bar')).toBeVisible()
      |                                                                  ^ Error: expect(locator).toBeVisible() failed
  18  | }
  19  | 
  20  | async function openWidgetPopup(page, field) {
  21  |   await pane1(page).locator(`#events-panel .filter-widget[data-field="${field}"] .filter-widget__btn`).click()
  22  |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  23  | }
  24  | 
  25  | // ─── Structure ────────────────────────────────────────────────────────────────
  26  | 
  27  | test("ListerEvent : barre de filtres cachée par défaut", async ({ page }) => {
  28  |   installFixtures('with-event-states')
  29  |   await page.goto('/')
  30  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  31  |   await press(page, 'ArrowRight')
  32  |   await press(page, 'ArrowRight')
  33  |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  34  |   await expect(pane1(page).locator('#events-panel .filter-bar')).toBeHidden()
  35  | })
  36  | 
  37  | test("ListerEvent : ':' révèle la barre et focus le titre", async ({ page }) => {
  38  |   installFixtures('with-event-states')
  39  |   await page.goto('/')
  40  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  41  |   await press(page, 'ArrowRight')
  42  |   await press(page, 'ArrowRight')
  43  |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  44  |   await press(page, ':')
  45  |   await expect(pane1(page).locator('#events-panel .filter-bar')).toBeVisible()
  46  |   await expect(pane1(page).locator('#events-panel .panel-search')).toBeFocused()
  47  | })
  48  | 
  49  | test("ListerEvent : widget titre présent dans la barre", async ({ page }) => {
  50  |   await goToListerEvent(page)
  51  |   await expect(pane1(page).locator('#events-panel .filter-bar .filter-widget[data-field="title"] .panel-search')).toBeVisible()
  52  | })
  53  | 
  54  | test("ListerEvent : widget état présent dans la barre", async ({ page }) => {
  55  |   await goToListerEvent(page)
  56  |   await expect(pane1(page).locator('#events-panel .filter-bar .filter-widget[data-field="state"]')).toBeVisible()
  57  | })
  58  | 
  59  | test("ListerEvent : widget météo présent dans la barre", async ({ page }) => {
  60  |   await goToListerEvent(page)
  61  |   await expect(pane1(page).locator('#events-panel .filter-bar .filter-widget[data-field="meteo"]')).toBeVisible()
  62  | })
  63  | 
  64  | test("ListerEvent : widget effet présent dans la barre", async ({ page }) => {
  65  |   await goToListerEvent(page)
  66  |   await expect(pane1(page).locator('#events-panel .filter-bar .filter-widget[data-field="effet"]')).toBeVisible()
  67  | })
  68  | 
  69  | // ─── Navigation clavier ───────────────────────────────────────────────────────
  70  | 
  71  | test("TAB depuis titre : focus widget état", async ({ page }) => {
  72  |   await goToListerEvent(page)
  73  |   await press(page, 'Tab')
  74  |   await expect(pane1(page).locator('#events-panel .filter-widget[data-field="state"] .filter-widget__btn')).toBeFocused()
  75  | })
  76  | 
  77  | test("TAB depuis état : focus widget météo", async ({ page }) => {
  78  |   await goToListerEvent(page)
  79  |   await pane1(page).locator('#events-panel .filter-widget[data-field="state"] .filter-widget__btn').focus()
  80  |   await press(page, 'Tab')
  81  |   await expect(pane1(page).locator('#events-panel .filter-widget[data-field="meteo"] .filter-widget__btn')).toBeFocused()
  82  | })
  83  | 
  84  | test("TAB depuis météo : focus widget effet", async ({ page }) => {
  85  |   await goToListerEvent(page)
  86  |   await pane1(page).locator('#events-panel .filter-widget[data-field="meteo"] .filter-widget__btn').focus()
  87  |   await press(page, 'Tab')
  88  |   await expect(pane1(page).locator('#events-panel .filter-widget[data-field="effet"] .filter-widget__btn')).toBeFocused()
  89  | })
  90  | 
  91  | test("TAB depuis dernier widget : revient au champ titre", async ({ page }) => {
  92  |   await goToListerEvent(page)
  93  |   await pane1(page).locator('#events-panel .filter-widget[data-field="effet"] .filter-widget__btn').focus()
  94  |   await press(page, 'Tab')
  95  |   await expect(pane1(page).locator('#events-panel .panel-search')).toBeFocused()
  96  | })
  97  | 
  98  | test("widget état focusé : ArrowDown ouvre le popup", async ({ page }) => {
  99  |   await goToListerEvent(page)
  100 |   await pane1(page).locator('#events-panel .filter-widget[data-field="state"] .filter-widget__btn').focus()
  101 |   await press(page, 'ArrowDown')
  102 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  103 | })
  104 | 
  105 | test("widget état focusé : ArrowDown n'affecte pas la sélection d'items", async ({ page }) => {
  106 |   await goToListerEvent(page)
  107 |   const firstItem = pane1(page).locator('.event-item').first()
  108 |   await expect(firstItem).toHaveClass(/selected/)
  109 |   await pane1(page).locator('#events-panel .filter-widget[data-field="state"] .filter-widget__btn').focus()
  110 |   await press(page, 'ArrowDown')
  111 |   await expect(firstItem).toHaveClass(/selected/)
  112 | })
  113 | 
  114 | test("TAB depuis popup ouvert : ferme popup et focus widget suivant", async ({ page }) => {
  115 |   await goToListerEvent(page)
  116 |   await openWidgetPopup(page, 'state')
  117 |   await press(page, 'Tab')
```