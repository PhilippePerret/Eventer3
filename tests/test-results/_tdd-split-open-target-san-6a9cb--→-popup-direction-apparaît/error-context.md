# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/split-open-target.spec.js >> sans split, touche a → popup direction apparaît
- Location: specs/e2e/_tdd/split-open-target.spec.js:87:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#pane-1').contentFrame().locator('.popup-select')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.popup-select')

```

```yaml
- text: Acte I Séquence 1 de Acte I — Séquence 2 de Acte I, avec Acte III — Séquence 3 de Acte I — Séquence 4 de Acte I — DISP MODE NESTING
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | //Origine: tests/specs/e2e/ui/split-open-target.spec.js
  2   | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  4   | 
  5   | test.beforeEach(() => installFixtures('with-links'))
  6   | 
  7   | async function gotoApp(page) {
  8   |   await page.goto('/')
  9   |   await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  10  | }
  11  | 
  12  | // Ouvre le split et navigue pane-1 jusqu'à e5 (qui a un lien vers e3)
  13  | async function setupLinkOnE5(page) {
  14  |   await gotoApp(page)
  15  |   // Ouvrir split
  16  |   await press(page, 'Alt+2')
  17  |   await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
  18  |   await expect(page.frameLocator('#pane-2').locator('.project-item').first()).toBeVisible()
  19  |   // Entrer dans le projet (e1, e2, e3) depuis pane-1 via click
  20  |   await pane1(page).locator('.project-item').first().click()
  21  |   await press(page, 'ArrowRight')
  22  |   await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
  23  |   // Re-cliquer pour rétablir le focus CDP après changement de lister
  24  |   await pane1(page).locator('.event-item').first().click()
  25  |   // Entrer dans e1 → e4,e5,e6,e7
  26  |   await press(page, 'ArrowRight')
  27  |   await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
  28  |   // Re-cliquer, puis descendre sur e5
  29  |   await pane1(page).locator('.event-item').first().click()
  30  |   await press(page, 'ArrowDown')
  31  |   await expect(pane1(page).locator('.event-item[data-id="e5"]')).toHaveClass(/selected/)
  32  |   // Tab → sélectionner le lien dans e5
  33  |   await press(page, 'Tab')
  34  | }
  35  | 
  36  | // Navigue vers e5 SANS split actif
  37  | async function navigateToE5NoSplit(page) {
  38  |   await gotoApp(page)
  39  |   await press(page, 'ArrowRight')
  40  |   await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
  41  |   await pane1(page).locator('.event-item').first().click()
  42  |   await press(page, 'ArrowRight')
  43  |   await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
  44  |   await pane1(page).locator('.event-item').first().click()
  45  |   await press(page, 'ArrowDown')
  46  |   await expect(pane1(page).locator('.event-item[data-id="e5"]')).toHaveClass(/selected/)
  47  |   await press(page, 'Tab')
  48  | }
  49  | 
  50  | // ─── Popup ────────────────────────────────────────────────────────────────────
  51  | 
  52  | test('split actif : popup affiche "Dans l\'autre fenêtre"', async ({ page }) => {
  53  |   await setupLinkOnE5(page)
  54  |   await press(page, 'o')
  55  |   await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  56  |   await expect(pane1(page).locator('.link-open-popup')).toContainText("Dans l'autre fenêtre")
  57  | })
  58  | 
  59  | test('split inactif : popup affiche "Dans une autre fenêtre"', async ({ page }) => {
  60  |   await navigateToE5NoSplit(page)
  61  |   await press(page, 'o')
  62  |   await expect(pane1(page).locator('.link-open-popup')).toContainText("Dans une autre fenêtre")
  63  | })
  64  | 
  65  | // ─── Navigation dans l'autre pane ─────────────────────────────────────────────
  66  | 
  67  | test('touche a → pane-2 affiche e3 (Acte III) sélectionné', async ({ page }) => {
  68  |   await setupLinkOnE5(page)
  69  |   await press(page, 'o')
  70  |   await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  71  |   await press(page, 'a')
  72  |   // pane-2 doit montrer e3 sélectionné
  73  |   const pane2 = page.frameLocator('#pane-2')
  74  |   await expect(pane2.locator('.event-item.selected')).toContainText('Acte III')
  75  | })
  76  | 
  77  | test('touche a → focus passe sur pane-2', async ({ page }) => {
  78  |   await setupLinkOnE5(page)
  79  |   await press(page, 'o')
  80  |   await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  81  |   await press(page, 'a')
  82  |   await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
  83  | })
  84  | 
  85  | // ─── Sans split : 'a' ouvre le split puis navigue ─────────────────────────────
  86  | 
  87  | test('sans split, touche a → popup direction apparaît', async ({ page }) => {
  88  |   await navigateToE5NoSplit(page)
  89  |   await press(page, 'o')
  90  |   await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  91  |   await press(page, 'a')
> 92  |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
      |                                                      ^ Error: expect(locator).toBeVisible() failed
  93  | })
  94  | 
  95  | test('sans split, touche a + Vertical → pane-2 affiche e3 sélectionné', async ({ page }) => {
  96  |   await navigateToE5NoSplit(page)
  97  |   await press(page, 'o')
  98  |   await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  99  |   await press(page, 'a')
  100 |   await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
  101 |   const pane2 = page.frameLocator('#pane-2')
  102 |   await expect(pane2.locator('.event-item.selected')).toContainText('Acte III')
  103 | })
  104 | 
  105 | test('sans split, touche a + Vertical → focus passe sur pane-2', async ({ page }) => {
  106 |   await navigateToE5NoSplit(page)
  107 |   await press(page, 'o')
  108 |   await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  109 |   await press(page, 'a')
  110 |   await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
  111 |   await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
  112 | })
  113 | 
```