# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/keyboard-alt-arrows-panels.spec.js >> brin panel : ⌥↓ met à jour le titre (nom de l'event en fond)
- Location: specs/e2e/_tdd/keyboard-alt-arrows-panels.spec.js:129:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#pane-1').contentFrame().locator('#brins-panel .panel-title')
Expected substring: "Événement 1"
Received string:    ""
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('#brins-panel .panel-title')
    14 × locator resolved to <div class="panel-title"></div>
       - unexpected value ""

```

```yaml
- text: "Mon brin MON brin #d9c8a9 ✓ Autre brin AUT brin #c8d9a9 Projet A Événement 1 — AUT Événement 2 — DISP MODE NESTING"
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  33  |   await press(page, 'Alt+ArrowDown')
  34  |   await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)
  35  |   await press(page, 'Alt+ArrowUp')
  36  |   await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  37  | })
  38  | 
  39  | test("brin panel : ⌥↓ ne change pas la sélection du brin actif", async ({ page }) => {
  40  |   installFixtures('with-brins')
  41  |   await goToListerEvent(page)
  42  |   await press(page, 'b')
  43  |   await expect(pane1(page).locator('.brin-item').nth(0)).toHaveClass(/selected/)
  44  |   await press(page, 'Alt+ArrowDown')
  45  |   await expect(pane1(page).locator('.brin-item').nth(0)).toHaveClass(/selected/)
  46  | })
  47  | 
  48  | // ─── Perso panel depuis ListerEvent : ⌥↓↑ navigue les events ───────────────
  49  | 
  50  | test("perso panel (depuis ListerEvent) : ⌥↓ sélectionne l'event suivant", async ({ page }) => {
  51  |   installFixtures('with-brins-and-persos')
  52  |   await goToListerEvent(page)
  53  |   await press(page, 'p')
  54  |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  55  |   await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  56  |   await press(page, 'Alt+ArrowDown')
  57  |   await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)
  58  | })
  59  | 
  60  | test("perso panel (depuis ListerEvent) : ⌥↑ sélectionne l'event précédent", async ({ page }) => {
  61  |   installFixtures('with-brins-and-persos')
  62  |   await goToListerEvent(page)
  63  |   await press(page, 'p')
  64  |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  65  |   await press(page, 'Alt+ArrowDown')
  66  |   await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)
  67  |   await press(page, 'Alt+ArrowUp')
  68  |   await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  69  | })
  70  | 
  71  | test("perso panel (depuis ListerEvent) : ⌥↓ ne change pas la sélection du perso", async ({ page }) => {
  72  |   installFixtures('with-brins-and-persos')
  73  |   await goToListerEvent(page)
  74  |   await press(page, 'p')
  75  |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
  76  |   await press(page, 'Alt+ArrowDown')
  77  |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
  78  | })
  79  | 
  80  | // ─── Perso panel depuis BrinPanel : ⌥↓↑ navigue les brins ──────────────────
  81  | 
  82  | test("perso panel (depuis BrinPanel) : ⌥↓ sélectionne le brin suivant", async ({ page }) => {
  83  |   installFixtures('with-brins-and-persos')
  84  |   await goToListerEvent(page)
  85  |   await press(page, 'b')
  86  |   await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  87  |   await expect(pane1(page).locator('.brin-item').nth(0)).toHaveClass(/selected/)
  88  |   await press(page, 'p')
  89  |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  90  |   await press(page, 'Alt+ArrowDown')
  91  |   await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/selected/)
  92  | })
  93  | 
  94  | test("perso panel (depuis BrinPanel) : ⌥↑ sélectionne le brin précédent", async ({ page }) => {
  95  |   installFixtures('with-brins-and-persos')
  96  |   await goToListerEvent(page)
  97  |   await press(page, 'b')
  98  |   await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  99  |   await press(page, 'p')
  100 |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  101 |   await press(page, 'Alt+ArrowDown')
  102 |   await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/selected/)
  103 |   await press(page, 'Alt+ArrowUp')
  104 |   await expect(pane1(page).locator('.brin-item').nth(0)).toHaveClass(/selected/)
  105 | })
  106 | 
  107 | test("perso panel (depuis BrinPanel) : ⌥↓ ne change pas la sélection du perso", async ({ page }) => {
  108 |   installFixtures('with-brins-and-persos')
  109 |   await goToListerEvent(page)
  110 |   await press(page, 'b')
  111 |   await press(page, 'p')
  112 |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
  113 |   await press(page, 'Alt+ArrowDown')
  114 |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
  115 | })
  116 | 
  117 | // ─── Refresh état coché après ⌥↓↑ ───────────────────────────────────────────
  118 | 
  119 | test("brin panel : ⌥↓ rafraîchit l'état coché des brins", async ({ page }) => {
  120 |   // with-brins : e1 a brin_ids=["b2"] → b2 coché ; e2 a [] → rien coché
  121 |   installFixtures('with-brins')
  122 |   await goToListerEvent(page)
  123 |   await press(page, 'b')
  124 |   await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/checked/)
  125 |   await press(page, 'Alt+ArrowDown')
  126 |   await expect(pane1(page).locator('.brin-item').nth(1)).not.toHaveClass(/checked/)
  127 | })
  128 | 
  129 | test("brin panel : ⌥↓ met à jour le titre (nom de l'event en fond)", async ({ page }) => {
  130 |   installFixtures('with-brins')
  131 |   await goToListerEvent(page)
  132 |   await press(page, 'b')
> 133 |   await expect(pane1(page).locator('#brins-panel .panel-title')).toContainText('Événement 1')
      |                                                                  ^ Error: expect(locator).toContainText(expected) failed
  134 |   await press(page, 'Alt+ArrowDown')
  135 |   await expect(pane1(page).locator('#brins-panel .panel-title')).toContainText('Événement 2')
  136 | })
  137 | 
  138 | test("brin panel : espace après ⌥↓ coche pour l'event sélectionné en fond", async ({ page }) => {
  139 |   // alt+↓ → e2 ; espace sur b1 → b1 coché pour e2
  140 |   installFixtures('with-brins')
  141 |   await goToListerEvent(page)
  142 |   await press(page, 'b')
  143 |   await press(page, 'Alt+ArrowDown')
  144 |   await expect(pane1(page).locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  145 |   await press(page, ' ')
  146 |   await expect(pane1(page).locator('.brin-item').nth(0)).toHaveClass(/checked/)
  147 |   // e1 ne doit pas avoir b1 coché
  148 |   await press(page, 'Alt+ArrowUp')
  149 |   await expect(pane1(page).locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  150 | })
  151 | 
  152 | test("perso panel (depuis ListerEvent) : ⌥↓ rafraîchit l'état coché des persos", async ({ page }) => {
  153 |   // with-brins-and-persos : e1 a perso_ids=["c1"] → c1 coché ; e2 a [] → rien
  154 |   installFixtures('with-brins-and-persos')
  155 |   await goToListerEvent(page)
  156 |   await press(page, 'p')
  157 |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/checked/)
  158 |   await press(page, 'Alt+ArrowDown')
  159 |   await expect(pane1(page).locator('.perso-item').nth(0)).not.toHaveClass(/checked/)
  160 | })
  161 | 
  162 | 
```