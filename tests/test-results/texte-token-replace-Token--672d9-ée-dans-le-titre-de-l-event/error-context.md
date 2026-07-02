# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: texte/token-replace.spec.js >> Token replacement dans les titres >> constante /VILLE/ remplacée dans le titre de l'event
- Location: specs/e2e/texte/token-replace.spec.js:19:3

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.event-text').first()
Expected: "Paris est belle"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveText" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.event-text').first()

```

```yaml
- text: /VILLE/ est belle — BV PP arrive à /VILLE/ — PPpat arrive à /VILLE/ — DISP MODE NESTING
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  2  | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3  | 
  4  | // Fixture with-tokens :
  5  | //   e1 "/VILLE/ est belle"         → "Paris est belle"              (brin_ids=[b1])
  6  | //   e2 "PP arrive à /VILLE/"       → "Phil arrive à Paris"
  7  | //   e3 "PPpat arrive à /VILLE/"    → "Philippe Perret arrive à Paris"
  8  | //   b1 "Le brin de /VILLE/"        → "Le brin de Paris"
  9  | //   c1 "Phil" badge=PP patronyme="Philippe Perret"
  10 | //   c2 "Héros de /VILLE/" badge=HR → "Héros de Paris"
  11 | //   constante VILLE=Paris
  12 | 
  13 | test.describe('Token replacement dans les titres', () => {
  14 | 
  15 |   test.beforeEach(() => installFixtures('with-tokens'))
  16 | 
  17 |   // ─── Events ────────────────────────────────────────────────────────────────
  18 | 
  19 |   test('constante /VILLE/ remplacée dans le titre de l\'event', async ({ page }) => {
  20 |     await page.goto('/')
  21 |     await press(page, 'ArrowRight')
> 22 |     await expect(pane1(page).locator('.event-text').first()).toHaveText('Paris est belle')
     |                                                              ^ Error: expect(locator).toHaveText(expected) failed
  23 |   })
  24 | 
  25 |   test('badge PP remplacé par le titre du personnage', async ({ page }) => {
  26 |     await page.goto('/')
  27 |     await press(page, 'ArrowRight')
  28 |     await expect(pane1(page).locator('.event-text').nth(1)).toHaveText('Phil arrive à Paris')
  29 |   })
  30 | 
  31 |   test('badge PPpat remplacé par le patronyme du personnage', async ({ page }) => {
  32 |     await page.goto('/')
  33 |     await press(page, 'ArrowRight')
  34 |     await expect(pane1(page).locator('.event-text').nth(2)).toHaveText('Philippe Perret arrive à Paris')
  35 |   })
  36 | 
  37 |   // ─── Brins ─────────────────────────────────────────────────────────────────
  38 | 
  39 |   test('constante /VILLE/ remplacée dans le titre du brin', async ({ page }) => {
  40 |     await page.goto('/')
  41 |     await press(page, 'ArrowRight')
  42 |     await expect(pane1(page).locator('.event-text').first()).toBeVisible()
  43 |     await press(page, 'b')
  44 |     await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  45 |     await expect(pane1(page).locator('.brin-item__title').first()).toHaveText('Le brin de Paris')
  46 |   })
  47 | 
  48 |   // ─── Persos ────────────────────────────────────────────────────────────────
  49 | 
  50 |   test('constante /VILLE/ remplacée dans le titre du perso', async ({ page }) => {
  51 |     await page.goto('/')
  52 |     await press(page, 'ArrowRight')
  53 |     await expect(pane1(page).locator('.event-text').first()).toBeVisible()
  54 |     await press(page, 'p')
  55 |     await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  56 |     await expect(pane1(page).locator('.perso-item__title').nth(1)).toHaveText('Héros de Paris')
  57 |   })
  58 | 
  59 |   // ─── Titre du panneau brins ─────────────────────────────────────────────────
  60 | 
  61 |   test('titre du panneau brins utilise le titre rendu (tokens remplacés)', async ({ page }) => {
  62 |     await page.goto('/')
  63 |     await press(page, 'ArrowRight')
  64 |     await expect(pane1(page).locator('.event-text').first()).toBeVisible()
  65 |     await press(page, 'b')
  66 |     await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  67 |     await expect(pane1(page).locator('#brins-panel .panel-title')).toContainText('Paris est belle')
  68 |   })
  69 | 
  70 |   // ─── Nouvel item après définition constante ─────────────────────────────────
  71 | 
  72 |   test('nouvel event créé après définition constante : remplacement immédiat', async ({ page }) => {
  73 |     await page.goto('/')
  74 |     await press(page, 'ArrowRight')
  75 |     await expect(pane1(page).locator('.event-text').first()).toBeVisible()
  76 |     // Définir PAYS=France
  77 |     await press(page, 'q')
  78 |     await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
  79 |     await press(page, 'ArrowDown')
  80 |     await press(page, 'Tab')
  81 |     await pane1(page).locator('.constants-row__name').nth(1).fill('PAYS')
  82 |     await press(page, 'Tab')
  83 |     await pane1(page).locator('.constants-row__value').nth(1).fill('France')
  84 |     await press(page, 'Meta+Enter')
  85 |     await expect(pane1(page).locator('#constants-panel')).not.toBeVisible()
  86 |     // Créer un nouvel event avec /PAYS/
  87 |     await press(page, 'n')
  88 |     const titleInput = pane1(page).locator('.event-item.editing input[name="title"]')
  89 |     await titleInput.fill('/PAYS/ est grand')
  90 |     await press(page, 'Enter')
  91 |     await expect(pane1(page).locator('.event-text').nth(1)).toHaveText('France est grand')
  92 |   })
  93 | 
  94 | })
  95 | 
```