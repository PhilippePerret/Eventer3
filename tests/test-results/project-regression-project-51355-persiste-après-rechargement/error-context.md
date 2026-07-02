# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/regression-project-id.spec.js >> créer un perso → persiste après rechargement
- Location: specs/e2e/project/regression-project-id.spec.js:81:1

# Error details

```
Error: expect(locator).toBeFocused() failed

Locator: locator('#pane-1').contentFrame().locator('.perso-item input[name="title"]')
Expected: focused
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeFocused" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.perso-item input[name="title"]')

```

```yaml
- text: Évènement un — Évènement deux — Évènement trois — DISP MODE NESTING
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | /**
  2   |  * Tests de régression : project_id non propagé pour les sous-listers
  3   |  * Tous ces tests vérifient la PERSISTANCE (rechargement de page),
  4   |  * pas seulement le DOM immédiat.
  5   |  */
  6   | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  7   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  8   | 
  9   | test.beforeEach(() => {
  10  |   installFixtures('many-events')
  11  | })
  12  | 
  13  | // ── Helpers ────────────────────────────────────────────────────────────
  14  | 
  15  | async function enterProject(page) {
  16  |   await page.goto('/')
  17  |   await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  18  |   await press(page, 'ArrowRight')
  19  |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  20  |   await expect(pane1(page).locator('.event-item').first()).toBeVisible()
  21  | }
  22  | 
  23  | // ── Events imbriqués ───────────────────────────────────────────────────
  24  | 
  25  | test('créer un event imbriqué → persiste après rechargement', async ({ page }) => {
  26  |   await enterProject(page)
  27  | 
  28  |   // Entrer dans le premier event (lister virtuel)
  29  |   await press(page, 'ArrowRight')
  30  |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  31  | 
  32  |   // Créer un sous-event
  33  |   await press(page, 'n')
  34  |   const input = pane1(page).locator('.event-item input[name="title"]')
  35  |   await expect(input).toBeFocused()
  36  |   await input.fill('Sous-event persistant')
  37  |   await press(page, 'Enter')
  38  |   await expect(pane1(page).locator('.event-item').first()).toContainText('Sous-event persistant')
  39  |   await page.waitForLoadState('networkidle')
  40  | 
  41  |   // Rechargement
  42  |   await page.reload()
  43  |   await enterProject(page)
  44  |   await press(page, 'ArrowRight')
  45  |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  46  |   await expect(pane1(page).locator('.event-item').first()).toContainText('Sous-event persistant')
  47  | })
  48  | 
  49  | // ── Création brin ──────────────────────────────────────────────────────
  50  | 
  51  | test('créer un brin → persiste après rechargement', async ({ page }) => {
  52  |   await enterProject(page)
  53  | 
  54  |   // Ouvrir le panel brins
  55  |   await press(page, 'b')
  56  |   await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  57  | 
  58  |   // Créer un nouveau brin
  59  |   await press(page, 'n')
  60  |   const input = pane1(page).locator('.brin-item input[name="title"]')
  61  |   await expect(input).toBeFocused()
  62  |   await input.fill('Brin régression')
  63  |   await press(page, 'Enter')
  64  | 
  65  |   // Vérification immédiate
  66  |   await expect(pane1(page).locator('.brin-item').filter({ hasText: 'Brin régression' })).toBeVisible()
  67  | 
  68  |   // Fermer le panel + rechargement
  69  |   await press(page, 'Meta+Enter')
  70  |   await page.reload()
  71  |   await enterProject(page)
  72  |   await press(page, 'b')
  73  |   await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  74  | 
  75  |   // Le brin doit toujours être là
  76  |   await expect(pane1(page).locator('.brin-item').filter({ hasText: 'Brin régression' })).toBeVisible()
  77  | })
  78  | 
  79  | // ── Création perso ─────────────────────────────────────────────────────
  80  | 
  81  | test('créer un perso → persiste après rechargement', async ({ page }) => {
  82  |   await enterProject(page)
  83  | 
  84  |   // Ouvrir le panel persos
  85  |   await press(page, 'p')
  86  |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  87  | 
  88  |   // Créer un nouveau perso
  89  |   await press(page, 'n')
  90  |   const input = pane1(page).locator('.perso-item input[name="title"]')
> 91  |   await expect(input).toBeFocused()
      |                       ^ Error: expect(locator).toBeFocused() failed
  92  |   await input.fill('Perso régression')
  93  |   await press(page, 'Enter')
  94  | 
  95  |   // Vérification immédiate
  96  |   await expect(pane1(page).locator('.perso-item').filter({ hasText: 'Perso régression' })).toBeVisible()
  97  | 
  98  |   // Fermer le panel + rechargement
  99  |   await press(page, 'Meta+Enter')
  100 |   await page.reload()
  101 |   await enterProject(page)
  102 |   await press(page, 'p')
  103 |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  104 | 
  105 |   // Le perso doit toujours être là
  106 |   await expect(pane1(page).locator('.perso-item').filter({ hasText: 'Perso régression' })).toBeVisible()
  107 | })
  108 | 
  109 | // ── ListerEvent depth-2 : brins/persos sans 500 ────────────────────────
  110 | 
  111 | test('entrer ListerEvent depth-2 → aucun 500 sur brins/persos', async ({ page }) => {
  112 |   const errors = []
  113 |   page.on('response', r => { if (r.status() >= 500) errors.push(r.url()) })
  114 | 
  115 |   await enterProject(page)
  116 |   await page.waitForLoadState('networkidle')
  117 |   errors.length = 0  // reset : seuls les 500 de depth-2 nous intéressent
  118 | 
  119 |   // Entrer dans le premier event (depth 2, parentItem = event, pas projet)
  120 |   await press(page, 'ArrowRight')
  121 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  122 |   await page.waitForLoadState('networkidle')
  123 | 
  124 |   expect(errors).toHaveLength(0)
  125 | })
  126 | 
```