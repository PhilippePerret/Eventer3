# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/confirm-dialog-tab.spec.js >> Tab→Non puis Enter → man_depth non sauvegardé
- Location: specs/e2e/ui/confirm-dialog-tab.spec.js:76:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#pane-1').contentFrame().locator('.confirm-dialog')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.confirm-dialog')

```

```yaml
- text: Séquence 1 — Séquence 2 — DISP MODE NESTING
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  2   | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3   | 
  4   | test.beforeEach(() => {
  5   |   installFixtures('depth-move')
  6   | })
  7   | 
  8   | // Ouvre le ConfirmDialog man_depth (2 boutons : Non / Oui)
  9   | async function openManDepthConfirm(page) {
  10  |   await page.goto('/')
  11  |   await press(page, 'ArrowRight')
  12  |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  13  |   await press(page, 'ArrowRight')
  14  |   await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '2')
  15  |   await press(page, 't')
  16  |   await press(page, 'Enter')
  17  |   await press(page, 'ArrowUp')   // film/BD
  18  |   await press(page, 'ArrowUp')   // roman
  19  |   await press(page, 'Enter')
  20  |   await press(page, 'ArrowDown')
  21  |   await press(page, 'Enter')
  22  |   await press(page, 'ArrowUp')   // manuscrit
  23  |   await press(page, 'Enter')
  24  |   await press(page, 'Tab')       // footer → Annuler
  25  |   await press(page, 'Tab')       // footer → Appliquer
  26  |   await press(page, 'Enter')     // appliquer
> 27  |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
      |                                                        ^ Error: expect(locator).toBeVisible() failed
  28  | }
  29  | 
  30  | // ─── Focus par défaut ─────────────────────────────────────────────────────────
  31  | 
  32  | test("ConfirmDialog : bouton 'Oui' focused par défaut (dernier bouton = action principale)", async ({ page }) => {
  33  |   await openManDepthConfirm(page)
  34  |   const btns = pane1(page).locator('.panel-btn')
  35  |   // Dernier bouton = Oui → doit avoir la classe focused
  36  |   const lastBtn = btns.last()
  37  |   await expect(lastBtn).toHaveClass(/panel-btn--focused/)
  38  |   await expect(lastBtn).toContainText('Oui')
  39  | })
  40  | 
  41  | // ─── Tab cycle ────────────────────────────────────────────────────────────────
  42  | 
  43  | test("Tab bascule le focus de Oui vers Non", async ({ page }) => {
  44  |   await openManDepthConfirm(page)
  45  |   // Par défaut : Oui focused
  46  |   await expect(pane1(page).locator('.panel-btn--focused')).toContainText('Oui')
  47  |   await press(page, 'Tab')
  48  |   // Après Tab : Non focused
  49  |   await expect(pane1(page).locator('.panel-btn--focused')).toContainText('Non')
  50  | })
  51  | 
  52  | test("Tab cycle complet : Non → Oui → Non", async ({ page }) => {
  53  |   await openManDepthConfirm(page)
  54  |   await press(page, 'Tab')  // Non
  55  |   await expect(pane1(page).locator('.panel-btn--focused')).toContainText('Non')
  56  |   await press(page, 'Tab')  // Oui
  57  |   await expect(pane1(page).locator('.panel-btn--focused')).toContainText('Oui')
  58  |   await press(page, 'Tab')  // Non
  59  |   await expect(pane1(page).locator('.panel-btn--focused')).toContainText('Non')
  60  | })
  61  | 
  62  | // ─── Enter active le bouton focused ──────────────────────────────────────────
  63  | 
  64  | test("Enter avec Oui focused → man_depth sauvegardé, sibling devient roman-man", async ({ page }) => {
  65  |   await openManDepthConfirm(page)
  66  |   // Oui focused par défaut → Enter
  67  |   await press(page, 'Enter')
  68  |   await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  69  |   // Vérifier que man_depth a été sauvegardé : sibling lister est roman-man
  70  |   await press(page, 'ArrowLeft')
  71  |   await press(page, 'ArrowDown')
  72  |   await press(page, 'ArrowRight')
  73  |   await expect(pane1(page).locator('#events-panel')).toHaveClass(/roman-man/)
  74  | })
  75  | 
  76  | test("Tab→Non puis Enter → man_depth non sauvegardé", async ({ page }) => {
  77  |   await openManDepthConfirm(page)
  78  |   await press(page, 'Tab')  // bascule sur Non
  79  |   await press(page, 'Enter')
  80  |   await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  81  |   // man_depth non sauvegardé : sibling ne devient pas roman-man
  82  |   await press(page, 'ArrowLeft')
  83  |   await press(page, 'ArrowDown')
  84  |   await press(page, 'ArrowRight')
  85  |   await expect(pane1(page).locator('#events-panel')).not.toHaveClass(/roman-man/)
  86  | })
  87  | 
  88  | // ─── Escape annule toujours ───────────────────────────────────────────────────
  89  | 
  90  | test("Escape annule même si Oui est focused", async ({ page }) => {
  91  |   await openManDepthConfirm(page)
  92  |   // Oui est focused par défaut
  93  |   await press(page, 'Escape')
  94  |   await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  95  |   await press(page, 'ArrowLeft')
  96  |   await press(page, 'ArrowDown')
  97  |   await press(page, 'ArrowRight')
  98  |   await expect(pane1(page).locator('#events-panel')).not.toHaveClass(/roman-man/)
  99  | })
  100 | 
  101 | // ─── CSS : bouton focused est vert ────────────────────────────────────────────
  102 | 
  103 | test("bouton focused a une couleur verte (background non-transparent)", async ({ page }) => {
  104 |   await openManDepthConfirm(page)
  105 |   const focusedBtn = pane1(page).locator('.panel-btn--focused')
  106 |   const bg = await focusedBtn.evaluate(el => getComputedStyle(el).backgroundColor)
  107 |   // Vert : ne doit pas être transparent ni blanc
  108 |   expect(bg).not.toBe('rgba(0, 0, 0, 0)')
  109 |   expect(bg).not.toBe('rgb(255, 255, 255)')
  110 |   // Doit contenir du vert (G > R et G > B dans rgb)
  111 |   const match = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  112 |   if (match) {
  113 |     const [, r, g, b] = match.map(Number)
  114 |     expect(g).toBeGreaterThan(r)
  115 |     expect(g).toBeGreaterThan(b)
  116 |   }
  117 | })
  118 | 
```