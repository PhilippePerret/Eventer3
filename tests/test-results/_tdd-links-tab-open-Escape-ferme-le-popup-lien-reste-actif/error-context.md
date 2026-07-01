# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/links-tab-open.spec.js >> Escape ferme le popup, lien reste actif
- Location: specs/e2e/_tdd/links-tab-open.spec.js:144:1

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.event-item').first()
Expected pattern: /selected/
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.event-item').first()

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
  12  |   await page.waitForLoadState('networkidle')
> 13  |   await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
      |                                                            ^ Error: expect(locator).toHaveClass(expected) failed
  14  | }
  15  | 
  16  | async function enterSubLister(page) {
  17  |   const depthAttr = await pane1(page).locator('#events-panel').getAttribute('data-depth')
  18  |   const nextDepth  = String((depthAttr != null ? parseInt(depthAttr) : 0) + 1)
  19  |   await press(page, 'ArrowRight')
  20  |   await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', nextDepth)
  21  | }
  22  | 
  23  | // ─── TAB navigation ──────────────────────────────────────────────────────────
  24  | 
  25  | test('TAB sur item sans lien → notification "aucun lien"', async ({ page }) => {
  26  |   await gotoEventList(page)
  27  |   // a1 sélectionné : "Acte I", pas de lien
  28  |   await press(page, 'Tab')
  29  |   await expect(pane1(page).locator('.notification')).toBeVisible()
  30  |   await expect(pane1(page).locator('.notification')).toContainText('aucun lien')
  31  | })
  32  | 
  33  | test('TAB sur item avec lien → premier lien activé', async ({ page }) => {
  34  |   await gotoEventList(page)
  35  |   await enterSubLister(page) // entre dans a1 (séquences Acte I)
  36  |   await press(page, 'ArrowDown') // → s2a1
  37  |   await press(page, 'Tab')
  38  |   await expect(pane1(page).locator('.event-item.selected .item-link--active')).toHaveCount(1)
  39  |   await expect(pane1(page).locator('.event-item.selected .item-link--active')).toContainText('Acte III')
  40  | })
  41  | 
  42  | test('TAB cycle : 2e TAB → 2e lien activé', async ({ page }) => {
  43  |   await gotoEventList(page)
  44  |   await press(page, 'ArrowDown') // → a2
  45  |   await enterSubLister(page)             // entre dans Acte II
  46  |   await press(page, 'ArrowDown') // → s2a2
  47  |   await enterSubLister(page)             // entre dans Séquence 2
  48  |   await press(page, 'ArrowDown')
  49  |   await press(page, 'ArrowDown') // → sc3s2a2 (3e scène, 2 liens)
  50  |   await press(page, 'Tab') // lien 1
  51  |   await press(page, 'Tab') // lien 2
  52  |   await expect(pane1(page).locator('.event-item.selected .item-link--active')).toContainText('Scène 1 de Séquence 4 de Acte III')
  53  | })
  54  | 
  55  | test('TAB bouclage : après dernier lien → retour au premier', async ({ page }) => {
  56  |   await gotoEventList(page)
  57  |   await press(page, 'ArrowDown') // → a2
  58  |   await enterSubLister(page)
  59  |   await press(page, 'ArrowDown') // → s2a2
  60  |   await enterSubLister(page)
  61  |   await press(page, 'ArrowDown')
  62  |   await press(page, 'ArrowDown') // → sc3s2a2 (3 liens)
  63  |   await press(page, 'Tab') // lien 1
  64  |   await press(page, 'Tab') // lien 2
  65  |   await press(page, 'Tab') // lien 3
  66  |   await press(page, 'Tab') // bouclage → lien 1
  67  |   await expect(pane1(page).locator('.event-item.selected .item-link--active')).toContainText('Séquence 3 de Acte I')
  68  | })
  69  | 
  70  | test('changer item sélectionné efface le lien actif', async ({ page }) => {
  71  |   await gotoEventList(page)
  72  |   await press(page, 'ArrowDown') // → a2
  73  |   await enterSubLister(page)
  74  |   await press(page, 'ArrowDown') // → s2a2
  75  |   await enterSubLister(page)
  76  |   await press(page, 'ArrowDown')
  77  |   await press(page, 'ArrowDown') // → sc3s2a2
  78  |   await press(page, 'Tab')
  79  |   await expect(pane1(page).locator('.item-link--active')).toHaveCount(1)
  80  |   await press(page, 'ArrowUp')
  81  |   await expect(pane1(page).locator('.item-link--active')).toHaveCount(0)
  82  | })
  83  | 
  84  | test('MAJ+TAB cycle à l\'envers : TAB → lien 1, Shift+TAB → lien 3 (wrap arrière)', async ({ page }) => {
  85  |   await gotoEventList(page)
  86  |   await press(page, 'ArrowDown') // → a2
  87  |   await enterSubLister(page)
  88  |   await press(page, 'ArrowDown') // → s2a2
  89  |   await enterSubLister(page)
  90  |   await press(page, 'ArrowDown')
  91  |   await press(page, 'ArrowDown') // → sc3s2a2 (3 liens)
  92  |   await press(page, 'Tab')       // lien 1 : "Séquence 3 de Acte I"
  93  |   // Shift+TAB depuis index 0 → backward wrap → index 2 (lien 3 : "Acte II")
  94  |   await press(page, 'Shift+Tab')
  95  |   await expect(pane1(page).locator('.event-item.selected .item-link--active')).toContainText('Acte II')
  96  | })
  97  | 
  98  | // ─── 'o' sans lien actif ─────────────────────────────────────────────────────
  99  | 
  100 | test("'o' sans lien actif sur item sans liens → notification", async ({ page }) => {
  101 |   await gotoEventList(page)
  102 |   await press(page, 'o')
  103 |   await expect(pane1(page).locator('.notification')).toBeVisible()
  104 |   await expect(pane1(page).locator('.notification')).toContainText('aucun lien')
  105 | })
  106 | 
  107 | test("'o' sans TAB sur item avec liens → notification", async ({ page }) => {
  108 |   await gotoEventList(page)
  109 |   await press(page, 'ArrowDown') // → a2
  110 |   await enterSubLister(page)
  111 |   await press(page, 'ArrowDown') // → s2a2
  112 |   await enterSubLister(page)
  113 |   await press(page, 'ArrowDown')
```