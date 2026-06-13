# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/link-open-shortcuts.spec.js >> popup : 'a' ferme le popup
- Location: specs/e2e/_tdd/link-open-shortcuts.spec.js:78:1

# Error details

```
Error: expect(locator).not.toBeVisible() failed

Locator:  locator('.link-open-popup')
Expected: not visible
Received: visible
Timeout:  5000ms

Call log:
  - Expect "not toBeVisible" with timeout 5000ms
  - waiting for locator('.link-open-popup')
    14 × locator resolved to <div class="link-open-popup floating-panel">…</div>
       - unexpected value "visible"

```

```yaml
- text: Séquence 3 de Acte I Dans son évènemencier Sa carte Dans l'autre fenêtre ␛ Fermer ↩︎ Ouvrir
```

# Test source

```ts
  1   | import { test, expect } from '../__setup__.js'
  2   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  3   | 
  4   | test.beforeEach(() => {
  5   |   installFixtures('with-links')
  6   | })
  7   | 
  8   | async function gotoEventList(page) {
  9   |   await page.goto('/')
  10  |   await expect(page.locator('.project-item').first()).toHaveClass(/selected/)
  11  |   await page.keyboard.press('ArrowRight')
  12  |   await page.waitForLoadState('networkidle')
  13  |   await expect(page.locator('.event-item').first()).toHaveClass(/selected/)
  14  | }
  15  | 
  16  | async function enterSubLister(page) {
  17  |   const depthAttr = await page.locator('#main-panel').getAttribute('data-depth')
  18  |   const nextDepth  = String((depthAttr != null ? parseInt(depthAttr) : 0) + 1)
  19  |   await page.keyboard.press('ArrowRight')
  20  |   await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', nextDepth)
  21  | }
  22  | 
  23  | // Navigue jusqu'à sc3s2a2 (item avec liens) et active le premier lien
  24  | async function activateFirstLink(page) {
  25  |   await gotoEventList(page)
  26  |   await page.keyboard.press('ArrowDown') // → a2
  27  |   await enterSubLister(page)
  28  |   await page.keyboard.press('ArrowDown') // → s2a2
  29  |   await enterSubLister(page)
  30  |   await page.keyboard.press('ArrowDown')
  31  |   await page.keyboard.press('ArrowDown') // → sc3s2a2
  32  |   await page.keyboard.press('Tab')       // active premier lien
  33  |   await expect(page.locator('.item-link--active')).toHaveCount(1)
  34  | }
  35  | 
  36  | // ─── Labels et badges dans le popup ──────────────────────────────────────────
  37  | 
  38  | test("popup : première option contient badge 'g'", async ({ page }) => {
  39  |   await activateFirstLink(page)
  40  |   await page.keyboard.press('o')
  41  |   await expect(page.locator('.floating-panel__item').nth(0).locator('.link-open-popup__key')).toHaveText('g')
  42  | })
  43  | 
  44  | test("popup : deuxième option contient badge 'c' et texte 'Afficher sa carte'", async ({ page }) => {
  45  |   await activateFirstLink(page)
  46  |   await page.keyboard.press('o')
  47  |   const second = page.locator('.floating-panel__item').nth(1)
  48  |   await expect(second.locator('.link-open-popup__key')).toHaveText('c')
  49  |   await expect(second).toContainText('Afficher sa carte')
  50  | })
  51  | 
  52  | test("popup : troisième option contient badge 'a' et texte 'Dans une autre fenêtre'", async ({ page }) => {
  53  |   await activateFirstLink(page)
  54  |   await page.keyboard.press('o')
  55  |   const third = page.locator('.floating-panel__item').nth(2)
  56  |   await expect(third.locator('.link-open-popup__key')).toHaveText('a')
  57  |   await expect(third).toContainText('Dans une autre fenêtre')
  58  | })
  59  | 
  60  | // ─── Raccourcis g/c/a dans le popup ──────────────────────────────────────────
  61  | 
  62  | test("popup : 'g' ferme le popup et navigue vers la cible", async ({ page }) => {
  63  |   await activateFirstLink(page)
  64  |   await page.keyboard.press('o')
  65  |   await expect(page.locator('.link-open-popup')).toBeVisible()
  66  |   await page.keyboard.press('g')
  67  |   await expect(page.locator('.link-open-popup')).not.toBeVisible()
  68  | })
  69  | 
  70  | test("popup : 'c' ferme le popup", async ({ page }) => {
  71  |   await activateFirstLink(page)
  72  |   await page.keyboard.press('o')
  73  |   await expect(page.locator('.link-open-popup')).toBeVisible()
  74  |   await page.keyboard.press('c')
  75  |   await expect(page.locator('.link-open-popup')).not.toBeVisible()
  76  | })
  77  | 
  78  | test("popup : 'a' ferme le popup", async ({ page }) => {
  79  |   await activateFirstLink(page)
  80  |   await page.keyboard.press('o')
  81  |   await expect(page.locator('.link-open-popup')).toBeVisible()
  82  |   await page.keyboard.press('a')
> 83  |   await expect(page.locator('.link-open-popup')).not.toBeVisible()
      |                                                      ^ Error: expect(locator).not.toBeVisible() failed
  84  | })
  85  | 
  86  | // ─── Raccourcis g/c/a sans popup (lien actif sélectionné) ────────────────────
  87  | 
  88  | test("'g' avec lien actif (sans popup) → navigue et popup ne s'ouvre pas", async ({ page }) => {
  89  |   await activateFirstLink(page)
  90  |   await page.keyboard.press('g')
  91  |   await expect(page.locator('.link-open-popup')).not.toBeVisible()
  92  | })
  93  | 
  94  | test("'c' avec lien actif (sans popup) → action déclenchée, pas de popup", async ({ page }) => {
  95  |   await activateFirstLink(page)
  96  |   await page.keyboard.press('c')
  97  |   await expect(page.locator('.link-open-popup')).not.toBeVisible()
  98  | })
  99  | 
  100 | test("'a' avec lien actif (sans popup) → action déclenchée, pas de popup", async ({ page }) => {
  101 |   await activateFirstLink(page)
  102 |   await page.keyboard.press('a')
  103 |   await expect(page.locator('.link-open-popup')).not.toBeVisible()
  104 | })
  105 | 
  106 | // ─── Raccourcis g/c/a sans cible sélectionnée ────────────────────────────────
  107 | 
  108 | test("'g' sans cible sélectionnée → notification 'Aucune cible'", async ({ page }) => {
  109 |   await gotoEventList(page)
  110 |   await page.keyboard.press('g')
  111 |   await expect(page.locator('.notification')).toBeVisible()
  112 |   await expect(page.locator('.notification')).toContainText('Aucune cible')
  113 | })
  114 | 
  115 | test("'c' sans cible sélectionnée → notification 'Aucune cible'", async ({ page }) => {
  116 |   await gotoEventList(page)
  117 |   await page.keyboard.press('c')
  118 |   await expect(page.locator('.notification')).toBeVisible()
  119 |   await expect(page.locator('.notification')).toContainText('Aucune cible')
  120 | })
  121 | 
  122 | test("'a' sans cible sélectionnée → notification 'Aucune cible'", async ({ page }) => {
  123 |   await gotoEventList(page)
  124 |   await page.keyboard.press('a')
  125 |   await expect(page.locator('.notification')).toBeVisible()
  126 |   await expect(page.locator('.notification')).toContainText('Aucune cible')
  127 | })
  128 | 
```