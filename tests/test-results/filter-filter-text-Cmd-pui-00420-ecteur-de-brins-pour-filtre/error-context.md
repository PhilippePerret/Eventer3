# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: filter/filter-text.spec.js >> Cmd+: puis b ouvre le sélecteur de brins pour filtre
- Location: specs/e2e/filter/filter-text.spec.js:178:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('#filter-selector-panel')
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#filter-selector-panel')
    14 × locator resolved to <div class="hidden" id="filter-selector-panel"></div>
       - unexpected value "hidden"

```

```yaml
- main:
  - navigation:
    - button
    - text: ‹
  - text: Scène du bal — AMO Arrivée à Paris — INT La trahison — AMO INT Retour au bal —
- text: DISP MODE NESTING
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  84  |   await expect(page.locator('.event-item').nth(0)).not.toHaveClass(/hidden/)
  85  |   await expect(page.locator('.event-item').nth(3)).not.toHaveClass(/hidden/)
  86  |   await expect(page.locator('.event-item').nth(1)).toHaveClass(/hidden/)
  87  | })
  88  | 
  89  | // ── Enter ferme l'input, filtre reste actif ────────────────────────
  90  | 
  91  | test("Enter ferme l'input sans annuler le filtre", async ({ page }) => {
  92  |   await enterEventLister(page)
  93  | 
  94  |   await page.keyboard.press('Meta+:')
  95  |   await page.keyboard.press('t')
  96  |   await page.keyboard.type('bal')
  97  |   await page.keyboard.press('Enter')
  98  | 
  99  |   await expect(page.locator('#filter-input')).not.toBeVisible()
  100 |   await expect(page.locator('.event-item').nth(1)).toHaveClass(/hidden/)
  101 |   await expect(page.locator('.event-item').nth(2)).toHaveClass(/hidden/)
  102 | })
  103 | 
  104 | // ── navigation saute les items cachés ─────────────────────────────
  105 | 
  106 | test('navigation ↓ saute les items cachés par le filtre', async ({ page }) => {
  107 |   await enterEventLister(page)
  108 | 
  109 |   await page.keyboard.press('Meta+:')
  110 |   await page.keyboard.press('t')
  111 |   await page.keyboard.type('bal')
  112 |   await page.keyboard.press('Enter')
  113 | 
  114 |   await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)
  115 |   await page.keyboard.press('ArrowDown')
  116 | 
  117 |   await expect(page.locator('.event-item').nth(3)).toHaveClass(/selected/)
  118 |   await expect(page.locator('.event-item').nth(1)).not.toHaveClass(/selected/)
  119 | })
  120 | 
  121 | // ── FilterBar affiche le filtre actif ─────────────────────────────
  122 | 
  123 | test('FilterBar affiche le terme de filtre texte actif', async ({ page }) => {
  124 |   await enterEventLister(page)
  125 | 
  126 |   await page.keyboard.press('Meta+:')
  127 |   await page.keyboard.press('t')
  128 |   await page.keyboard.type('bal')
  129 |   await page.keyboard.press('Enter')
  130 | 
  131 |   await expect(page.locator('#filter-bar')).toBeVisible()
  132 |   await expect(page.locator('#filter-bar')).toContainText('bal')
  133 | })
  134 | 
  135 | // ── Cmd+: puis : efface le filtre ─────────────────────────────────
  136 | 
  137 | test('Cmd+: puis : efface le filtre texte', async ({ page }) => {
  138 |   await enterEventLister(page)
  139 | 
  140 |   await page.keyboard.press('Meta+:')
  141 |   await page.keyboard.press('t')
  142 |   await page.keyboard.type('bal')
  143 |   await page.keyboard.press('Enter')
  144 | 
  145 |   await expect(page.locator('.event-item').nth(1)).toHaveClass(/hidden/)
  146 | 
  147 |   await page.keyboard.press('Meta+:')
  148 |   await page.keyboard.press(':')
  149 | 
  150 |   const items = page.locator('.event-item')
  151 |   await expect(items.nth(0)).not.toHaveClass(/hidden/)
  152 |   await expect(items.nth(1)).not.toHaveClass(/hidden/)
  153 |   await expect(items.nth(2)).not.toHaveClass(/hidden/)
  154 |   await expect(items.nth(3)).not.toHaveClass(/hidden/)
  155 | })
  156 | 
  157 | // ── Escape annule le filtre texte ─────────────────────────────────
  158 | 
  159 | test("Escape dans l'input annule le filtre texte", async ({ page }) => {
  160 |   await enterEventLister(page)
  161 | 
  162 |   await page.keyboard.press('Meta+:')
  163 |   await page.keyboard.press('t')
  164 |   await page.keyboard.type('bal')
  165 |   await page.keyboard.press('Escape')
  166 | 
  167 |   await expect(page.locator('#filter-input')).not.toBeVisible()
  168 | 
  169 |   const items = page.locator('.event-item')
  170 |   await expect(items.nth(0)).not.toHaveClass(/hidden/)
  171 |   await expect(items.nth(1)).not.toHaveClass(/hidden/)
  172 |   await expect(items.nth(2)).not.toHaveClass(/hidden/)
  173 |   await expect(items.nth(3)).not.toHaveClass(/hidden/)
  174 | })
  175 | 
  176 | // ── Cmd+: + b/p : sélecteur brins / persos ────────────────────────
  177 | 
  178 | test('Cmd+: puis b ouvre le sélecteur de brins pour filtre', async ({ page }) => {
  179 |   await enterEventLister(page)
  180 | 
  181 |   await page.keyboard.press('Meta+:')
  182 |   await page.keyboard.press('b')
  183 | 
> 184 |   await expect(page.locator('#filter-selector-panel')).toBeVisible()
      |                                                        ^ Error: expect(locator).toBeVisible() failed
  185 | })
  186 | 
  187 | test('Cmd+: puis p ouvre le sélecteur de persos pour filtre', async ({ page }) => {
  188 |   await enterEventLister(page)
  189 | 
  190 |   await page.keyboard.press('Meta+:')
  191 |   await page.keyboard.press('p')
  192 | 
  193 |   await expect(page.locator('#filter-selector-panel')).toBeVisible()
  194 | })
  195 | 
  196 | 
```