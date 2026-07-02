# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/link-open-shortcuts.spec.js >> 'a' sans cible sélectionnée → notification 'Aucune cible'
- Location: specs/e2e/_tdd/link-open-shortcuts.spec.js:122:1

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
- text: Projet A roman DISP MODE PROJECTS
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  2   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  3   | 
  4   | test.beforeEach(() => {
  5   |   installFixtures('with-links')
  6   | })
  7   | 
  8   | async function gotoEventList(page) {
  9   |   await page.goto('/')
  10  |   await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  11  |   await press(page, 'ArrowRight')
> 12  |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
      |                                                      ^ Error: expect(locator).toBeVisible() failed
  13  |   await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
  14  | }
  15  | 
  16  | async function enterSubLister(page) {
  17  |   const depthAttr = await pane1(page).locator('#events-panel').getAttribute('data-depth')
  18  |   const nextDepth  = String((depthAttr != null ? parseInt(depthAttr) : 0) + 1)
  19  |   await press(page, 'ArrowRight')
  20  |   await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', nextDepth)
  21  | }
  22  | 
  23  | // Navigue jusqu'à sc3s2a2 (item avec liens) et active le premier lien
  24  | async function activateFirstLink(page) {
  25  |   await gotoEventList(page)
  26  |   await press(page, 'ArrowDown') // → a2
  27  |   await enterSubLister(page)
  28  |   await press(page, 'ArrowDown') // → s2a2
  29  |   await enterSubLister(page)
  30  |   await press(page, 'ArrowDown')
  31  |   await press(page, 'ArrowDown') // → sc3s2a2
  32  |   await press(page, 'Tab')       // active premier lien
  33  |   await expect(pane1(page).locator('.item-link--active')).toHaveCount(1)
  34  | }
  35  | 
  36  | // ─── Labels et badges dans le popup ──────────────────────────────────────────
  37  | 
  38  | test("popup : première option contient badge 'g'", async ({ page }) => {
  39  |   await activateFirstLink(page)
  40  |   await press(page, 'o')
  41  |   await expect(pane1(page).locator('.floating-panel__item').nth(0).locator('.link-open-popup__key')).toHaveText('g')
  42  | })
  43  | 
  44  | test("popup : deuxième option contient badge 'c' et texte 'Afficher sa carte'", async ({ page }) => {
  45  |   await activateFirstLink(page)
  46  |   await press(page, 'o')
  47  |   const second = pane1(page).locator('.floating-panel__item').nth(1)
  48  |   await expect(second.locator('.link-open-popup__key')).toHaveText('c')
  49  |   await expect(second).toContainText('Afficher sa carte')
  50  | })
  51  | 
  52  | test("popup : troisième option contient badge 'a' et texte 'Dans une autre fenêtre'", async ({ page }) => {
  53  |   await activateFirstLink(page)
  54  |   await press(page, 'o')
  55  |   const third = pane1(page).locator('.floating-panel__item').nth(2)
  56  |   await expect(third.locator('.link-open-popup__key')).toHaveText('a')
  57  |   await expect(third).toContainText('Dans une autre fenêtre')
  58  | })
  59  | 
  60  | // ─── Raccourcis g/c/a dans le popup ──────────────────────────────────────────
  61  | 
  62  | test("popup : 'g' ferme le popup et navigue vers la cible", async ({ page }) => {
  63  |   await activateFirstLink(page)
  64  |   await press(page, 'o')
  65  |   await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  66  |   await press(page, 'g')
  67  |   await expect(pane1(page).locator('.link-open-popup')).not.toBeVisible()
  68  | })
  69  | 
  70  | test("popup : 'c' ferme le popup", async ({ page }) => {
  71  |   await activateFirstLink(page)
  72  |   await press(page, 'o')
  73  |   await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  74  |   await press(page, 'c')
  75  |   await expect(pane1(page).locator('.link-open-popup')).not.toBeVisible()
  76  | })
  77  | 
  78  | test("popup : 'a' ferme le popup", async ({ page }) => {
  79  |   await activateFirstLink(page)
  80  |   await press(page, 'o')
  81  |   await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  82  |   await press(page, 'a')
  83  |   await expect(pane1(page).locator('.link-open-popup')).not.toBeVisible()
  84  | })
  85  | 
  86  | // ─── Raccourcis g/c/a sans popup (lien actif sélectionné) ────────────────────
  87  | 
  88  | test("'g' avec lien actif (sans popup) → navigue et popup ne s'ouvre pas", async ({ page }) => {
  89  |   await activateFirstLink(page)
  90  |   await press(page, 'g')
  91  |   await expect(pane1(page).locator('.link-open-popup')).not.toBeVisible()
  92  | })
  93  | 
  94  | test("'c' avec lien actif (sans popup) → action déclenchée, pas de popup", async ({ page }) => {
  95  |   await activateFirstLink(page)
  96  |   await press(page, 'c')
  97  |   await expect(pane1(page).locator('.link-open-popup')).not.toBeVisible()
  98  | })
  99  | 
  100 | test("'a' avec lien actif (sans popup) → action déclenchée, pas de popup", async ({ page }) => {
  101 |   await activateFirstLink(page)
  102 |   await press(page, 'a')
  103 |   await expect(pane1(page).locator('.link-open-popup')).not.toBeVisible()
  104 | })
  105 | 
  106 | // ─── Raccourcis g/c/a sans cible sélectionnée ────────────────────────────────
  107 | 
  108 | test("'g' sans cible sélectionnée → notification 'Aucune cible'", async ({ page }) => {
  109 |   await gotoEventList(page)
  110 |   await press(page, 'g')
  111 |   await expect(pane1(page).locator('.notification')).toBeVisible()
  112 |   await expect(pane1(page).locator('.notification')).toContainText('Aucune cible')
```