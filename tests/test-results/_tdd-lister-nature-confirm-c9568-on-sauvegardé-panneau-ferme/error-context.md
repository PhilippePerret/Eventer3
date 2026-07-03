# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/lister-nature.spec.js >> confirmer 'n' → man_depth non sauvegardé, panneau ferme
- Location: specs/e2e/_tdd/lister-nature.spec.js:191:1

# Error details

```
Error: expect(locator).not.toHaveClass(expected) failed

Locator: locator('#pane-1').contentFrame().locator('#events-panel')
Expected pattern: not /roman-man/
Received string: "event-list roman-man"
Timeout: 5000ms

Call log:
  - Expect "not toHaveClass" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('#events-panel')
    14 × locator resolved to <div data-depth="2" id="events-panel" class="event-list roman-man">…</div>
       - unexpected value "event-list roman-man"

```

```yaml
- text: Acte 1 Séquence 1 — Séquence 2 —
```

# Test source

```ts
  118 | test("projet 'film' → popup évènemencier propose 'scénario'", async ({ page }) => {
  119 |   await goToListerEvent(page)
  120 |   await press(page, 't')
  121 |   await press(page, 'Enter')
  122 |   await press(page, 'ArrowUp')   // pièce radio
  123 |   await press(page, 'ArrowUp')   // theatre
  124 |   await press(page, 'ArrowUp')   // bd
  125 |   await press(page, 'ArrowUp')   // film/BD
  126 |   await press(page, 'Enter')
  127 |   await press(page, 'ArrowDown')  // champ évènemencier
  128 |   await press(page, 'Enter')
  129 |   await expect(pane1(page).locator('.popup-select')).toContainText('scénario')
  130 | })
  131 | 
  132 | // ─── Annuler ──────────────────────────────────────────────────────────────────
  133 | 
  134 | test("Annuler ferme le panneau sans appliquer", async ({ page }) => {
  135 |   await goToListerEvent(page)
  136 |   await press(page, 't')
  137 |   await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  138 |   await press(page, 'Tab')   // → Annuler (index 0, DOM en reverse = dernier)
  139 |   await press(page, 'Enter') // fermer
  140 |   await expect(pane1(page).locator('.nature-panel')).not.toBeVisible()
  141 |   await expect(pane1(page).locator('#events-panel')).not.toHaveClass(/roman/)
  142 | })
  143 | 
  144 | // ─── Appliquer ────────────────────────────────────────────────────────────────
  145 | 
  146 | test("roman+manuscrit → #main-panel a la classe 'roman-man'", async ({ page }) => {
  147 |   await goToListerEvent(page)
  148 |   await setRomanMan(page)
  149 |   await expect(pane1(page).locator('#events-panel')).toHaveClass(/roman-man/)
  150 | })
  151 | 
  152 | test("film+scénario → #main-panel a la classe 'film-man'", async ({ page }) => {
  153 |   await goToListerEvent(page)
  154 |   await press(page, 't')
  155 |   await press(page, 'Enter')
  156 |   await press(page, 'ArrowUp')   // pièce radio
  157 |   await press(page, 'ArrowUp')   // theatre
  158 |   await press(page, 'ArrowUp')   // bd
  159 |   await press(page, 'ArrowUp')   // film/BD
  160 |   await press(page, 'Enter')
  161 |   await press(page, 'ArrowDown') // champ évènemencier
  162 |   await press(page, 'Enter')
  163 |   await press(page, 'ArrowUp')   // scénario (index 0)
  164 |   await press(page, 'Enter')
  165 |   await applyNaturePanel(page)
  166 |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  167 |   await press(page, 'Enter')     // Non (déjà focalisé) → refuser man_depth
  168 |   await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  169 |   await expect(pane1(page).locator('#events-panel')).toHaveClass(/film-man/)
  170 | })
  171 | 
  172 | // ─── Confirmation man_depth ───────────────────────────────────────────────────
  173 | 
  174 | test("nature man et depth ≠ man_depth → ConfirmDialog s'ouvre avec 'niveau par défaut'", async ({ page }) => {
  175 |   await goToListerEvent(page)
  176 |   await press(page, 't')
  177 |   await press(page, 'Enter')
  178 |   await press(page, 'ArrowUp')   // film/BD
  179 |   await press(page, 'ArrowUp')   // roman
  180 |   await press(page, 'Enter')
  181 |   await press(page, 'ArrowDown')
  182 |   await press(page, 'Enter')
  183 |   await press(page, 'ArrowUp')   // manuscrit
  184 |   await press(page, 'Enter')
  185 |   await applyNaturePanel(page)
  186 |   await expect(pane1(page).locator('.nature-panel')).not.toBeVisible()
  187 |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  188 |   await expect(pane1(page).locator('.confirm-dialog')).toContainText('niveau par défaut')
  189 | })
  190 | 
  191 | test("confirmer 'n' → man_depth non sauvegardé, panneau ferme", async ({ page }) => {
  192 |   installFixtures('depth-move')
  193 |   await page.goto('/')
  194 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  195 |   await press(page, 'ArrowRight')
  196 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  197 |   await press(page, 'ArrowRight')
  198 |   await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '2')
  199 |   await press(page, 't')
  200 |   await press(page, 'Enter')
  201 |   await press(page, 'ArrowUp')   // pièce radio
  202 |   await press(page, 'ArrowUp')   // theatre
  203 |   await press(page, 'ArrowUp')   // bd
  204 |   await press(page, 'ArrowUp')   // film/BD
  205 |   await press(page, 'ArrowUp')   // roman
  206 |   await press(page, 'Enter')
  207 |   await press(page, 'ArrowDown')
  208 |   await press(page, 'Enter')
  209 |   await press(page, 'ArrowUp')   // manuscrit
  210 |   await press(page, 'Enter')
  211 |   await applyNaturePanel(page)
  212 |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  213 |   await press(page, 'Enter')     // Non (déjà focalisé) → refuser man_depth
  214 |   await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  215 |   await press(page, 'ArrowLeft')
  216 |   await press(page, 'ArrowDown')
  217 |   await press(page, 'ArrowRight')
> 218 |   await expect(pane1(page).locator('#events-panel')).not.toHaveClass(/roman-man/)
      |                                                          ^ Error: expect(locator).not.toHaveClass(expected) failed
  219 | })
  220 | 
  221 | test("confirmer 'o' → man_depth sauvegardé, sibling lister devient roman-man", async ({ page }) => {
  222 |   installFixtures('depth-move')
  223 |   await page.goto('/')
  224 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  225 |   await press(page, 'ArrowRight')
  226 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  227 |   await press(page, 'ArrowRight')
  228 |   await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '2')
  229 |   await press(page, 't')
  230 |   await press(page, 'Enter')
  231 |   await press(page, 'ArrowUp')   // pièce radio
  232 |   await press(page, 'ArrowUp')   // theatre
  233 |   await press(page, 'ArrowUp')   // bd
  234 |   await press(page, 'ArrowUp')   // film
  235 |   await press(page, 'ArrowUp')   // roman
  236 |   await press(page, 'Enter')
  237 |   await press(page, 'ArrowDown')
  238 |   await press(page, 'Enter')
  239 |   await press(page, 'ArrowUp')   // manuscrit
  240 |   await press(page, 'Enter')
  241 |   await applyNaturePanel(page)
  242 |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  243 |   await press(page, 'Tab')   // focus Oui
  244 |   await press(page, 'Enter') // confirmer man_depth (oui)
  245 |   await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  246 |   await press(page, 'ArrowLeft')
  247 |   await press(page, 'ArrowDown')
  248 |   await press(page, 'ArrowRight')
  249 |   await expect(pane1(page).locator('#events-panel')).toHaveClass(/roman-man/)
  250 | })
  251 | 
  252 | test("depth = man_depth → appliquer ferme sans confirmation", async ({ page }) => {
  253 |   installFixtures('depth-move')
  254 |   await page.goto('/')
  255 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  256 |   await press(page, 'ArrowRight')
  257 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  258 |   await press(page, 'ArrowRight')
  259 |   await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '2')
  260 |   await press(page, 't')
  261 |   await press(page, 'Enter')
  262 |   await press(page, 'ArrowUp')    // film/BD
  263 |   await press(page, 'ArrowUp')    // roman
  264 |   await press(page, 'Enter')
  265 |   await press(page, 'ArrowDown')
  266 |   await press(page, 'Enter')
  267 |   await press(page, 'ArrowUp')    // manuscrit
  268 |   await press(page, 'Enter')
  269 |   await applyNaturePanel(page)
  270 |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  271 |   await press(page, 'Enter') // man_depth = 2 (oui)
  272 |   await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  273 |   await press(page, 't')
  274 |   await applyNaturePanel(page)
  275 |   await expect(pane1(page).locator('.nature-panel')).not.toBeVisible()
  276 | })
  277 | 
  278 | // ─── Nature null à man_depth ─────────────────────────────────────────────────
  279 | 
  280 | test.skip("nature null à man_depth → panneau affiche 'manuscrit', popup focused sur 'défaut'", async ({ page }) => {
  281 |   installFixtures('depth-move')
  282 |   await page.goto('/')
  283 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  284 |   await press(page, 'ArrowRight')
  285 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  286 |   await press(page, 'ArrowRight')
  287 |   await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '2')
  288 |   await press(page, 't')
  289 |   await press(page, 'Enter')
  290 |   await press(page, 'ArrowUp')   // pièce radio
  291 |   await press(page, 'ArrowUp')   // theatre
  292 |   await press(page, 'ArrowUp')   // bd
  293 |   await press(page, 'ArrowUp')   // film
  294 |   await press(page, 'ArrowUp')   // roman
  295 |   await press(page, 'Enter')
  296 |   await press(page, 'ArrowDown')
  297 |   await press(page, 'Enter')
  298 |   await press(page, 'ArrowUp')   // manuscrit
  299 |   await press(page, 'Enter')
  300 |   await applyNaturePanel(page)
  301 |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  302 |   await press(page, 'Tab')       // focus Oui
  303 |   await press(page, 'Enter')     // oui → man_depth=2
  304 |   await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  305 |   await press(page, 'ArrowLeft')
  306 |   await press(page, 'ArrowDown')
  307 |   await press(page, 'ArrowRight')
  308 |   await expect(pane1(page).locator('#events-panel')).toHaveClass(/roman-man/)
  309 |   await press(page, 't')
  310 |   await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  311 |   await expect(pane1(page).locator('.nature-panel')).toContainText('manuscrit')
  312 |   await press(page, 'ArrowDown')
  313 |   await press(page, 'Enter')
  314 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  315 |   const focused = pane1(page).locator('.popup-select__option.focused')
  316 |   await expect(focused).toContainText('défaut')
  317 | })
  318 | 
```