# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: links/broken-links.spec.js >> TargetsPanel : cibles inexistantes filtrées à l'ouverture
- Location: specs/e2e/links/broken-links.spec.js:31:1

# Error details

```
Error: expect(locator).toBeFocused() failed

Locator: locator('#pane-1').contentFrame().locator('.event-item.editing input[name="title"]')
Expected: focused
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeFocused" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.event-item.editing input[name="title"]')

```

```yaml
- text: Projet A roman DISP MODE PROJECTS
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  2  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  3  | 
  4  | test.beforeEach(() => {
  5  |   installFixtures('with-broken-links')
  6  | })
  7  | 
  8  | async function enterSubLister(page) {
  9  |   const depthAttr = await pane1(page).locator('#events-panel').getAttribute('data-depth')
  10 |   const nextDepth = String((depthAttr != null ? parseInt(depthAttr) : 0) + 1)
  11 |   await press(page, 'ArrowRight')
  12 |   await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', nextDepth)
  13 | }
  14 | 
  15 | // Navigue jusqu'à e5 dans le sous-lister de Acte I (item avec lien cassé vers e999)
  16 | async function gotoItemWithBrokenLink(page) {
  17 |   await page.goto('/')
  18 |   await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  19 |   await press(page, 'ArrowRight')
  20 |   await page.waitForLoadState('networkidle')
  21 |   await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
  22 |   // Entrer dans le sous-lister de Acte I (e1 sélectionné par défaut)
  23 |   await enterSubLister(page)
  24 |   // e4 sélectionné → ArrowDown → e5
  25 |   await press(page, 'ArrowDown')
  26 |   await expect(pane1(page).locator('.event-item.selected')).toContainText('Séquence 2')
  27 | }
  28 | 
  29 | // ─── TargetsPanel ─────────────────────────────────────────────────────────────
  30 | 
  31 | test('TargetsPanel : cibles inexistantes filtrées à l\'ouverture', async ({ page }) => {
  32 |   await page.goto('/')
  33 |   await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  34 |   await press(page, 'ArrowRight')
  35 |   await page.waitForLoadState('networkidle')
  36 |   // Entrer en édition sur le premier item
  37 |   await press(page, 'Enter')
> 38 |   await expect(pane1(page).locator('.event-item.editing input[name="title"]')).toBeFocused()
     |                                                                                ^ Error: expect(locator).toBeFocused() failed
  39 |   // Ouvrir TargetsPanel — fixture a 2 cibles : e999 (inexistant) + e1 (existant)
  40 |   await press(page, 'Meta+k')
  41 |   await expect(pane1(page).locator('.targets-panel')).toBeVisible()
  42 |   // Seulement e1 doit apparaître
  43 |   await expect(pane1(page).locator('.floating-panel__item')).toHaveCount(1)
  44 |   await expect(pane1(page).locator('.floating-panel__item').first()).toContainText('Acte I')
  45 | })
  46 | 
  47 | // ─── Liens cassés ─────────────────────────────────────────────────────────────
  48 | 
  49 | test("lien cassé : 'o' → notification, pas de popup", async ({ page }) => {
  50 |   await gotoItemWithBrokenLink(page)
  51 |   await press(page, 'Tab')   // active [Acte III](e3) — valide
  52 |   await press(page, 'Tab')   // active [Fantôme](e999) — cassé
  53 |   await press(page, 'o')
  54 |   await expect(pane1(page).locator('.link-open-popup')).not.toBeVisible()
  55 |   await expect(pane1(page).locator('.notification')).toBeVisible()
  56 |   await expect(pane1(page).locator('.notification')).toContainText(/supprimée|introuvable/i)
  57 | })
  58 | 
  59 | test("lien cassé : 'g' → notification sans naviguer", async ({ page }) => {
  60 |   await gotoItemWithBrokenLink(page)
  61 |   await press(page, 'Tab')
  62 |   await press(page, 'Tab')   // active [Fantôme](e999)
  63 |   await press(page, 'g')
  64 |   await expect(pane1(page).locator('.notification')).toBeVisible()
  65 |   await expect(pane1(page).locator('.notification')).toContainText(/supprimée|introuvable/i)
  66 | })
  67 | 
  68 | test("lien cassé : 'a' → notification sans ouvrir split", async ({ page }) => {
  69 |   await gotoItemWithBrokenLink(page)
  70 |   await press(page, 'Tab')
  71 |   await press(page, 'Tab')   // active [Fantôme](e999)
  72 |   await press(page, 'a')
  73 |   await expect(pane1(page).locator('.notification')).toBeVisible()
  74 |   await expect(pane1(page).locator('.notification')).toContainText(/supprimée|introuvable/i)
  75 | })
  76 | 
```