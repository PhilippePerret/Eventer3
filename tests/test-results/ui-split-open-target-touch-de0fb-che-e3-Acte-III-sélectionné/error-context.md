# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/split-open-target.spec.js >> touche a → pane-2 affiche e3 (Acte III) sélectionné
- Location: specs/e2e/ui/split-open-target.spec.js:66:1

# Error details

```
Test timeout of 15000ms exceeded.
```

```
Error: locator.click: Test timeout of 15000ms exceeded.
Call log:
  - waiting for locator('#pane-1').contentFrame().locator('.popup-select__option').filter({ hasText: 'Vertical' })

```

# Page snapshot

```yaml
- iframe [active] [ref=e3]:
  - generic [ref=f1e1]:
    - generic [ref=f1e7]:
      - generic [ref=f1e8]: Projet A
      - generic [ref=f1e10]: roman
    - generic:
      - generic: DISP MODE PROJECTS
    - contentinfo "Raccourcis clavier" [ref=f1e11]
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  2   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  3   | 
  4   | test.beforeEach(() => installFixtures('with-links'))
  5   | 
  6   | async function gotoApp(page) {
  7   |   await page.goto('/')
  8   |   await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  9   | }
  10  | 
  11  | // Ouvre le split et navigue pane-1 jusqu'à e5 (qui a un lien vers e3)
  12  | async function setupLinkOnE5(page) {
  13  |   await gotoApp(page)
  14  |   // Ouvrir split
  15  |   await press(page, 'Alt+2')
> 16  |   await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
      |                                                                               ^ Error: locator.click: Test timeout of 15000ms exceeded.
  17  |   await expect(page.frameLocator('#pane-2').locator('.project-item').first()).toBeVisible()
  18  |   // Entrer dans le projet (e1, e2, e3) depuis pane-1 via click
  19  |   await pane1(page).locator('.project-item').first().click()
  20  |   await press(page, 'ArrowRight')
  21  |   await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
  22  |   // Re-cliquer pour rétablir le focus CDP après changement de lister
  23  |   await pane1(page).locator('.event-item').first().click()
  24  |   // Entrer dans e1 → e4,e5,e6,e7
  25  |   await press(page, 'ArrowRight')
  26  |   await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
  27  |   // Re-cliquer, puis descendre sur e5
  28  |   await pane1(page).locator('.event-item').first().click()
  29  |   await press(page, 'ArrowDown')
  30  |   await expect(pane1(page).locator('.event-item[data-id="e5"]')).toHaveClass(/selected/)
  31  |   // Tab → sélectionner le lien dans e5
  32  |   await press(page, 'Tab')
  33  | }
  34  | 
  35  | // Navigue vers e5 SANS split actif
  36  | async function navigateToE5NoSplit(page) {
  37  |   await gotoApp(page)
  38  |   await press(page, 'ArrowRight')
  39  |   await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
  40  |   await pane1(page).locator('.event-item').first().click()
  41  |   await press(page, 'ArrowRight')
  42  |   await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
  43  |   await pane1(page).locator('.event-item').first().click()
  44  |   await press(page, 'ArrowDown')
  45  |   await expect(pane1(page).locator('.event-item[data-id="e5"]')).toHaveClass(/selected/)
  46  |   await press(page, 'Tab')
  47  | }
  48  | 
  49  | // ─── Popup ────────────────────────────────────────────────────────────────────
  50  | 
  51  | test('split actif : popup affiche "Dans l\'autre fenêtre"', async ({ page }) => {
  52  |   await setupLinkOnE5(page)
  53  |   await press(page, 'o')
  54  |   await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  55  |   await expect(pane1(page).locator('.link-open-popup')).toContainText("Dans l'autre fenêtre")
  56  | })
  57  | 
  58  | test('split inactif : popup affiche "Dans une autre fenêtre"', async ({ page }) => {
  59  |   await navigateToE5NoSplit(page)
  60  |   await press(page, 'o')
  61  |   await expect(pane1(page).locator('.link-open-popup')).toContainText("Dans une autre fenêtre")
  62  | })
  63  | 
  64  | // ─── Navigation dans l'autre pane ─────────────────────────────────────────────
  65  | 
  66  | test('touche a → pane-2 affiche e3 (Acte III) sélectionné', async ({ page }) => {
  67  |   await setupLinkOnE5(page)
  68  |   await press(page, 'o')
  69  |   await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  70  |   await press(page, 'a')
  71  |   // pane-2 doit montrer e3 sélectionné
  72  |   const pane2 = page.frameLocator('#pane-2')
  73  |   await expect(pane2.locator('.event-item.selected')).toContainText('Acte III')
  74  | })
  75  | 
  76  | test('touche a → focus passe sur pane-2', async ({ page }) => {
  77  |   await setupLinkOnE5(page)
  78  |   await press(page, 'o')
  79  |   await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  80  |   await press(page, 'a')
  81  |   await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
  82  | })
  83  | 
  84  | // ─── Sans split : 'a' ouvre le split puis navigue ─────────────────────────────
  85  | 
  86  | test('sans split, touche a → popup direction apparaît', async ({ page }) => {
  87  |   await navigateToE5NoSplit(page)
  88  |   await press(page, 'o')
  89  |   await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  90  |   await press(page, 'a')
  91  |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  92  | })
  93  | 
  94  | test('sans split, touche a + Vertical → pane-2 affiche e3 sélectionné', async ({ page }) => {
  95  |   await navigateToE5NoSplit(page)
  96  |   await press(page, 'o')
  97  |   await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  98  |   await press(page, 'a')
  99  |   await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
  100 |   const pane2 = page.frameLocator('#pane-2')
  101 |   await expect(pane2.locator('.event-item.selected')).toContainText('Acte III')
  102 | })
  103 | 
  104 | test('sans split, touche a + Vertical → focus passe sur pane-2', async ({ page }) => {
  105 |   await navigateToE5NoSplit(page)
  106 |   await press(page, 'o')
  107 |   await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  108 |   await press(page, 'a')
  109 |   await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
  110 |   await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
  111 | })
  112 | 
```