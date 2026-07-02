# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: filter/filter-text.spec.js >> Cmd+: puis p ouvre le sélecteur de persos pour filtre
- Location: specs/e2e/filter/filter-text.spec.js:187:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('#pane-1').contentFrame().locator('#filter-selector-panel')
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('#filter-selector-panel')
    14 × locator resolved to <div class="hidden" id="filter-selector-panel"></div>
       - unexpected value "hidden"

```

```yaml
- text: Marie Dupont 🫥 MAR perso Jean Martin 🫥 JEA perso Scène du bal — AMO Arrivée à Paris — INT La trahison — AMO INT Retour au bal — DISP MODE NESTING
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  93  | 
  94  |   await press(page, 'Meta+:')
  95  |   await press(page, 't')
  96  |   await pane1(page).locator('#filter-input').fill('bal')
  97  |   await press(page, 'Enter')
  98  | 
  99  |   await expect(pane1(page).locator('#filter-input')).not.toBeVisible()
  100 |   await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/hidden/)
  101 |   await expect(pane1(page).locator('.event-item').nth(2)).toHaveClass(/hidden/)
  102 | })
  103 | 
  104 | // ── navigation saute les items cachés ─────────────────────────────
  105 | 
  106 | test('navigation ↓ saute les items cachés par le filtre', async ({ page }) => {
  107 |   await enterListerEvent(page)
  108 | 
  109 |   await press(page, 'Meta+:')
  110 |   await press(page, 't')
  111 |   await pane1(page).locator('#filter-input').fill('bal')
  112 |   await press(page, 'Enter')
  113 | 
  114 |   await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  115 |   await press(page, 'ArrowDown')
  116 | 
  117 |   await expect(pane1(page).locator('.event-item').nth(3)).toHaveClass(/selected/)
  118 |   await expect(pane1(page).locator('.event-item').nth(1)).not.toHaveClass(/selected/)
  119 | })
  120 | 
  121 | // ── FilterBar affiche le filtre actif ─────────────────────────────
  122 | 
  123 | test('FilterBar affiche le terme de filtre texte actif', async ({ page }) => {
  124 |   await enterListerEvent(page)
  125 | 
  126 |   await press(page, 'Meta+:')
  127 |   await press(page, 't')
  128 |   await pane1(page).locator('#filter-input').fill('bal')
  129 |   await press(page, 'Enter')
  130 | 
  131 |   await expect(pane1(page).locator('#filter-bar')).toBeVisible()
  132 |   await expect(pane1(page).locator('#filter-bar')).toContainText('bal')
  133 | })
  134 | 
  135 | // ── Cmd+: puis : efface le filtre ─────────────────────────────────
  136 | 
  137 | test('Cmd+: puis : efface le filtre texte', async ({ page }) => {
  138 |   await enterListerEvent(page)
  139 | 
  140 |   await press(page, 'Meta+:')
  141 |   await press(page, 't')
  142 |   await pane1(page).locator('#filter-input').fill('bal')
  143 |   await press(page, 'Enter')
  144 | 
  145 |   await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/hidden/)
  146 | 
  147 |   await press(page, 'Meta+:')
  148 |   await press(page, ':')
  149 | 
  150 |   const items = pane1(page).locator('.event-item')
  151 |   await expect(items.nth(0)).not.toHaveClass(/hidden/)
  152 |   await expect(items.nth(1)).not.toHaveClass(/hidden/)
  153 |   await expect(items.nth(2)).not.toHaveClass(/hidden/)
  154 |   await expect(items.nth(3)).not.toHaveClass(/hidden/)
  155 | })
  156 | 
  157 | // ── Escape annule le filtre texte ─────────────────────────────────
  158 | 
  159 | test("Escape dans l'input annule le filtre texte", async ({ page }) => {
  160 |   await enterListerEvent(page)
  161 | 
  162 |   await press(page, 'Meta+:')
  163 |   await press(page, 't')
  164 |   await pane1(page).locator('#filter-input').fill('bal')
  165 |   await press(page, 'Escape')
  166 | 
  167 |   await expect(pane1(page).locator('#filter-input')).not.toBeVisible()
  168 | 
  169 |   const items = pane1(page).locator('.event-item')
  170 |   await expect(items.nth(0)).not.toHaveClass(/hidden/)
  171 |   await expect(items.nth(1)).not.toHaveClass(/hidden/)
  172 |   await expect(items.nth(2)).not.toHaveClass(/hidden/)
  173 |   await expect(items.nth(3)).not.toHaveClass(/hidden/)
  174 | })
  175 | 
  176 | // ── Cmd+: + b/p : sélecteur brins / persos ────────────────────────
  177 | 
  178 | test('Cmd+: puis b ouvre le sélecteur de brins pour filtre', async ({ page }) => {
  179 |   await enterListerEvent(page)
  180 | 
  181 |   await press(page, 'Meta+:')
  182 |   await press(page, 'b')
  183 | 
  184 |   await expect(pane1(page).locator('#filter-selector-panel')).toBeVisible()
  185 | })
  186 | 
  187 | test('Cmd+: puis p ouvre le sélecteur de persos pour filtre', async ({ page }) => {
  188 |   await enterListerEvent(page)
  189 | 
  190 |   await press(page, 'Meta+:')
  191 |   await press(page, 'p')
  192 | 
> 193 |   await expect(pane1(page).locator('#filter-selector-panel')).toBeVisible()
      |                                                               ^ Error: expect(locator).toBeVisible() failed
  194 | })
  195 | 
  196 | 
```