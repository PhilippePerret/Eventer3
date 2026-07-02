# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: panels/tools-panel.spec.js >> Enter sur item sélectionné : consolide et ferme
- Location: specs/e2e/panels/tools-panel.spec.js:147:1

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.tools-panel .floating-panel__item').first()
Expected pattern: /selected/
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.tools-panel .floating-panel__item').first()

```

```yaml
- text: Scène 1 — Scène 2 — +1 Séquence 2 +1 Séquence 3 DISP MODE LEVEL
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  53  | 
  54  |   await press(page, 'Meta+t')
  55  |   await expect(pane1(page).locator('.tools-panel .floating-panel__title')).toBeVisible()
  56  | })
  57  | 
  58  | test('panneau outils : footer avec faux-boutons Fermer et Exécuter', async ({ page }) => {
  59  |   await page.goto('/')
  60  |   await enterLevelMode(page, 3)
  61  | 
  62  |   await press(page, 'Meta+t')
  63  |   const footer = pane1(page).locator('.tools-panel .floating-panel__footer')
  64  |   await expect(footer).toBeVisible()
  65  |   await expect(footer.locator('.panel-btn--cancel')).toContainText('Fermer')
  66  |   await expect(footer.locator('.panel-btn--primary')).toContainText('Exécuter')
  67  | })
  68  | 
  69  | test('panneau outils : item Consolider listé avec son raccourci ⌘⇧C', async ({ page }) => {
  70  |   await page.goto('/')
  71  |   await enterLevelMode(page, 3)
  72  | 
  73  |   await press(page, 'Meta+t')
  74  |   await expect(pane1(page).locator('.tools-panel .floating-panel__item').first()).toContainText('Consolider le niveau')
  75  |   await expect(pane1(page).locator('.tools-panel .floating-panel__item').first()).toContainText('⌘')
  76  | })
  77  | 
  78  | // ── TAB cycle ────────────────────────────────────────────────────────────────
  79  | 
  80  | test('TAB : items → Exécuter → Fermer → items', async ({ page }) => {
  81  |   await page.goto('/')
  82  |   await enterLevelMode(page, 3)
  83  |   await press(page, 'Meta+t')
  84  | 
  85  |   const panel = pane1(page).locator('.tools-panel')
  86  | 
  87  |   await expect(panel.locator('.panel-btn--focused')).toHaveCount(0)
  88  | 
  89  |   await press(page, 'Tab')
  90  |   await expect(panel.locator('.panel-btn--primary.panel-btn--focused')).toBeVisible()
  91  |   await expect(panel.locator('.panel-btn--cancel.panel-btn--focused')).toHaveCount(0)
  92  | 
  93  |   await press(page, 'Tab')
  94  |   await expect(panel.locator('.panel-btn--cancel.panel-btn--focused')).toBeVisible()
  95  |   await expect(panel.locator('.panel-btn--primary.panel-btn--focused')).toHaveCount(0)
  96  | 
  97  |   await press(page, 'Tab')
  98  |   await expect(panel.locator('.panel-btn--focused')).toHaveCount(0)
  99  |   await expect(panel.locator('.floating-panel__item.selected')).toBeVisible()
  100 | })
  101 | 
  102 | test('TAB + Enter sur Exécuter : consolide et ferme le panneau', async ({ page }) => {
  103 |   await page.goto('/')
  104 |   await enterLevelMode(page, 3)
  105 |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)
  106 | 
  107 |   await press(page, 'Meta+t')
  108 |   await press(page, 'Tab')
  109 |   await expect(pane1(page).locator('.tools-panel .panel-btn--primary.panel-btn--focused')).toBeVisible()
  110 | 
  111 |   await press(page, 'Enter')
  112 |   await expect(pane1(page).locator('.tools-panel')).not.toBeAttached()
  113 |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  114 | })
  115 | 
  116 | test('TAB + TAB + Enter sur Fermer : ferme sans consolider', async ({ page }) => {
  117 |   await page.goto('/')
  118 |   await enterLevelMode(page, 3)
  119 |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)
  120 | 
  121 |   await press(page, 'Meta+t')
  122 |   await press(page, 'Tab')
  123 |   await press(page, 'Tab')
  124 |   await expect(pane1(page).locator('.tools-panel .panel-btn--cancel.panel-btn--focused')).toBeVisible()
  125 | 
  126 |   await press(page, 'Enter')
  127 |   await expect(pane1(page).locator('.tools-panel')).not.toBeAttached()
  128 |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)
  129 | })
  130 | 
  131 | // ── Exécution par lettre ─────────────────────────────────────────────────────
  132 | 
  133 | test('lettre C dans le panneau : consolide et ferme', async ({ page }) => {
  134 |   await page.goto('/')
  135 |   await enterLevelMode(page, 3)
  136 |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)
  137 | 
  138 |   await press(page, 'Meta+t')
  139 |   await expect(pane1(page).locator('.tools-panel')).toBeVisible()
  140 |   await press(page, 'c')
  141 | 
  142 |   await expect(pane1(page).locator('.tools-panel')).not.toBeAttached()
  143 |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  144 |   await expect(pane1(page).locator('.event-item')).toHaveCount(4)
  145 | })
  146 | 
  147 | test('Enter sur item sélectionné : consolide et ferme', async ({ page }) => {
  148 |   await page.goto('/')
  149 |   await enterLevelMode(page, 3)
  150 |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)
  151 | 
  152 |   await press(page, 'Meta+t')
> 153 |   await expect(pane1(page).locator('.tools-panel .floating-panel__item').nth(0)).toHaveClass(/selected/)
      |                                                                                  ^ Error: expect(locator).toHaveClass(expected) failed
  154 |   await press(page, 'Enter')
  155 | 
  156 |   await expect(pane1(page).locator('.tools-panel')).not.toBeAttached()
  157 |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  158 | })
  159 | 
  160 | // ── Raccourci direct ─────────────────────────────────────────────────────────
  161 | 
  162 | test('⌘+⇧+C direct : consolide sans ouvrir le panneau', async ({ page }) => {
  163 |   await page.goto('/')
  164 |   await enterLevelMode(page, 3)
  165 |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)
  166 | 
  167 |   await press(page, 'Meta+Shift+c')
  168 | 
  169 |   await expect(pane1(page).locator('.tools-panel')).not.toBeAttached()
  170 |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  171 |   await expect(pane1(page).locator('.event-item')).toHaveCount(4)
  172 | })
  173 | 
  174 | test('⌘+⇧+C inactif hors mode LEVEL', async ({ page }) => {
  175 |   await page.goto('/')
  176 |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  177 |   await press(page, 'ArrowRight')
  178 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  179 | 
  180 |   await press(page, 'Meta+Shift+c')
  181 | 
  182 |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  183 |   await expect(pane1(page).locator('.tools-panel')).not.toBeAttached()
  184 | })
  185 | 
```