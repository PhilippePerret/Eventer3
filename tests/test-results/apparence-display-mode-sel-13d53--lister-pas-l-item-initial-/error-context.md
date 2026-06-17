# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparence/display-mode-selection.spec.js >> Bug 2 — NEST←LEVEL : item sélectionné en LEVEL détermine le lister (pas l'item initial)
- Location: specs/e2e/apparence/display-mode-selection.spec.js:75:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#pane-1').contentFrame().locator('#status-bar')
Expected substring: "DISP MODE LEVEL"
Received string:    "DISP MODE NESTING"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('#status-bar')
    14 × locator resolved to <div id="status-bar">…</div>
       - unexpected value "DISP MODE NESTING"

```

```yaml
- text: DISP MODE NESTING
```

# Test source

```ts
  1   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  2   | import { test, expect, pane1 } from '../__setup__.js'
  3   | 
  4   | // Fixture depth-move :
  5   | //   Liste#2 (depth=1) : [e14 "Acte 1", e23 "Acte 2"]
  6   | //   Liste#3 (depth=2, enfant e14) : [e31 "Séquence 1", e45 "Séquence 2"]
  7   | //   Liste#4 (depth=3, enfant e31) : [e57 "Scène 1", e68 "Scène 2"]
  8   | //   Liste#5 (depth=2, enfant e23) : [e88 "Séquence 3"]
  9   | 
  10  | test.beforeEach(() => {
  11  |   installFixtures('depth-move')
  12  | })
  13  | 
  14  | async function enterProject(page) {
  15  |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  16  |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  17  |   await page.keyboard.press('ArrowRight')
  18  |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  19  | }
  20  | 
  21  | // ─── Bug 1 : item sélectionné préservé au toggle LEVEL ───────────────────────
  22  | 
  23  | test("Bug 1 — LEVEL : item sélectionné initialement reste sélectionné", async ({ page }) => {
  24  |   await page.goto('/')
  25  |   await enterProject(page)
  26  |   await page.keyboard.press('ArrowRight')  // depth=2 (lister#3 : e31, e45)
  27  |   await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  28  | 
  29  |   // Sélectionner e45 (2e item, pas le premier)
  30  |   await page.keyboard.press('ArrowDown')
  31  |   await expect(pane1(page).locator('.event-item[data-id="e45"]')).toHaveClass(/selected/)
  32  | 
  33  |   // Toggle LEVEL
  34  |   await page.keyboard.press('Meta+m')
  35  |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
  36  |   await expect(pane1(page).locator('.event-item')).toHaveCount(3)  // attendre render async
  37  | 
  38  |   // e45 doit rester sélectionné (pas e31 qui est le premier)
  39  |   await expect(pane1(page).locator('.event-item[data-id="e45"]')).toHaveClass(/selected/)
  40  |   await expect(pane1(page).locator('.event-item[data-id="e31"]')).not.toHaveClass(/selected/)
  41  | })
  42  | 
  43  | // ─── Bug 2b : ← en LEVEL mode navigue vers le lister de l'item LEVEL sélectionné ──
  44  | 
  45  | test("Bug 2b — LEVEL + ← : navigue vers le lister de l'item sélectionné (pas leaveToParent du lister courant)", async ({ page }) => {
  46  |   await page.goto('/')
  47  |   await enterProject(page)
  48  |   await page.keyboard.press('ArrowRight')  // depth=2 (lister#3 : e31, e45)
  49  |   await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  50  | 
  51  |   await page.keyboard.press('Meta+m')  // LEVEL mode
  52  |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
  53  |   await expect(pane1(page).locator('.event-item')).toHaveCount(3)
  54  | 
  55  |   // Naviguer à e88 (dans lister#5, sous e23 — branche différente du lister courant lister#3)
  56  |   const e88 = pane1(page).locator('.event-item[data-id="e88"]')
  57  |   while (!(await e88.getAttribute('class')).includes('selected')) {
  58  |     await page.keyboard.press('ArrowDown')
  59  |   }
  60  |   await expect(e88).toHaveClass(/selected/)
  61  | 
  62  |   // ← doit naviguer vers le lister de e88 (lister#5, depth=2, sous e23), pas vers lister#2
  63  |   await page.keyboard.press('ArrowLeft')
  64  |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')
  65  | 
  66  |   // lister#5 affiché (depth=2, sous e23), e88 sélectionné
  67  |   await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  68  |   await expect(pane1(page).locator('.event-item[data-id="e88"]')).toHaveClass(/selected/)
  69  |   // Dans lister#5, e31 et e45 ne sont pas visibles (ils sont dans lister#3)
  70  |   await expect(pane1(page).locator('.event-item[data-id="e31"]')).not.toBeVisible()
  71  | })
  72  | 
  73  | // ─── Bug 2 : NESTING←LEVEL utilise l'item sélectionné en LEVEL ───────────────
  74  | 
  75  | test("Bug 2 — NEST←LEVEL : item sélectionné en LEVEL détermine le lister (pas l'item initial)", async ({ page }) => {
  76  |   await page.goto('/')
  77  |   await enterProject(page)
  78  |   await page.keyboard.press('ArrowRight')  // depth=2 (lister#3 : e31, e45)
  79  |   await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  80  | 
  81  |   // Sélectionner e45 (2e item = item "initial" pour ce test)
  82  |   await page.keyboard.press('ArrowDown')
  83  |   await expect(pane1(page).locator('.event-item[data-id="e45"]')).toHaveClass(/selected/)
  84  | 
  85  |   // Toggle LEVEL
  86  |   await page.keyboard.press('Meta+m')
> 87  |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
      |                                                    ^ Error: expect(locator).toContainText(expected) failed
  88  |   await expect(pane1(page).locator('.event-item')).toHaveCount(3)
  89  | 
  90  |   // Naviguer explicitement à e88 (dans un lister différent de e45)
  91  |   // En LEVEL : [e31, e45, e88] — sélectionner e88 quelle que soit la position de départ
  92  |   const e88 = pane1(page).locator('.event-item[data-id="e88"]')
  93  |   await expect(e88).toBeVisible()
  94  |   // ArrowDown jusqu'à e88
  95  |   while (!(await e88.getAttribute('class')).includes('selected')) {
  96  |     await page.keyboard.press('ArrowDown')
  97  |   }
  98  |   await expect(e88).toHaveClass(/selected/)
  99  | 
  100 |   // Toggle NESTING
  101 |   await page.keyboard.press('Meta+m')
  102 |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')
  103 | 
  104 |   // Doit être dans le lister de e88 (Liste#5, depth=2, sous e23)
  105 |   // e88 sélectionné — PAS e45 (qui est dans lister#3, sous e14)
  106 |   await expect(pane1(page).locator('.event-item[data-id="e88"]')).toHaveClass(/selected/)
  107 |   // Si on est dans lister#5, e45 n'est pas visible (il est dans lister#3)
  108 |   await expect(pane1(page).locator('.event-item[data-id="e45"]')).not.toBeVisible()
  109 | })
  110 | 
```