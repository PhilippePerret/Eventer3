# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lister/lister-nature.spec.js >> depth = man_depth → appliquer ferme sans confirmation
- Location: specs/e2e/lister/lister-nature.spec.js:237:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#pane-1').contentFrame().locator('.confirm-dialog')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.confirm-dialog')

```

```yaml
- text: Séquence 1 — Séquence 2 — DISP MODE NESTING
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  155 |   await press(page, 'ArrowUp')   // scénario (index 0 depuis évènemencier)
  156 |   await press(page, 'Enter')
  157 |   await applyNaturePanel(page)
  158 |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  159 |   await press(page, 'Escape')    // refuser man_depth
  160 |   await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  161 |   await expect(pane1(page).locator('#events-panel')).toHaveClass(/film-man/)
  162 | })
  163 | 
  164 | // ─── Confirmation man_depth ───────────────────────────────────────────────────
  165 | 
  166 | test("nature man et depth ≠ man_depth → ConfirmDialog s'ouvre avec 'niveau par défaut'", async ({ page }) => {
  167 |   await goToListerEvent(page)
  168 |   await press(page, 't')
  169 |   await press(page, 'Enter')
  170 |   await press(page, 'ArrowUp')   // film/BD
  171 |   await press(page, 'ArrowUp')   // roman
  172 |   await press(page, 'Enter')
  173 |   await press(page, 'ArrowDown')
  174 |   await press(page, 'Enter')
  175 |   await press(page, 'ArrowUp')   // manuscrit
  176 |   await press(page, 'Enter')
  177 |   await applyNaturePanel(page)
  178 |   // nature-panel fermé, confirm-dialog ouvert
  179 |   await expect(pane1(page).locator('.nature-panel')).not.toBeVisible()
  180 |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  181 |   await expect(pane1(page).locator('.confirm-dialog')).toContainText('niveau par défaut')
  182 | })
  183 | 
  184 | test("confirmer 'n' → man_depth non sauvegardé, panneau ferme", async ({ page }) => {
  185 |   installFixtures('depth-move')
  186 |   await page.goto('/')
  187 |   await press(page, 'ArrowRight')
  188 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  189 |   await press(page, 'ArrowRight')
  190 |   await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '2')
  191 |   await press(page, 't')
  192 |   await press(page, 'Enter')
  193 |   await press(page, 'ArrowUp')   // film/BD
  194 |   await press(page, 'ArrowUp')   // roman
  195 |   await press(page, 'Enter')
  196 |   await press(page, 'ArrowDown')
  197 |   await press(page, 'Enter')
  198 |   await press(page, 'ArrowUp')   // manuscrit
  199 |   await press(page, 'Enter')
  200 |   await applyNaturePanel(page)
  201 |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  202 |   await press(page, 'Escape') // refuser man_depth
  203 |   await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  204 |   // sibling lister à même depth NE doit PAS être roman-man automatiquement
  205 |   await press(page, 'ArrowLeft')
  206 |   await press(page, 'ArrowDown')
  207 |   await press(page, 'ArrowRight')
  208 |   await expect(pane1(page).locator('#events-panel')).not.toHaveClass(/roman-man/)
  209 | })
  210 | 
  211 | test("confirmer 'o' → man_depth sauvegardé, sibling lister devient roman-man", async ({ page }) => {
  212 |   installFixtures('depth-move')
  213 |   await page.goto('/')
  214 |   await press(page, 'ArrowRight')
  215 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  216 |   await press(page, 'ArrowRight')
  217 |   await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '2')
  218 |   await press(page, 't')
  219 |   await press(page, 'Enter')
  220 |   await press(page, 'ArrowUp')   // film/BD
  221 |   await press(page, 'ArrowUp')   // roman
  222 |   await press(page, 'Enter')
  223 |   await press(page, 'ArrowDown')
  224 |   await press(page, 'Enter')
  225 |   await press(page, 'ArrowUp')   // manuscrit
  226 |   await press(page, 'Enter')
  227 |   await applyNaturePanel(page)
  228 |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  229 |   await press(page, 'Enter') // confirmer man_depth (oui)
  230 |   await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  231 |   await press(page, 'ArrowLeft')
  232 |   await press(page, 'ArrowDown')
  233 |   await press(page, 'ArrowRight')
  234 |   await expect(pane1(page).locator('#events-panel')).toHaveClass(/roman-man/)
  235 | })
  236 | 
  237 | test("depth = man_depth → appliquer ferme sans confirmation", async ({ page }) => {
  238 |   installFixtures('depth-move')
  239 |   await page.goto('/')
  240 |   await press(page, 'ArrowRight')
  241 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  242 |   await press(page, 'ArrowRight')
  243 |   await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '2')
  244 |   // définir man_depth = 2 d'abord
  245 |   await press(page, 't')
  246 |   await press(page, 'Enter')
  247 |   await press(page, 'ArrowUp')    // film/BD
  248 |   await press(page, 'ArrowUp')    // roman
  249 |   await press(page, 'Enter')
  250 |   await press(page, 'ArrowDown')
  251 |   await press(page, 'Enter')
  252 |   await press(page, 'ArrowUp')    // manuscrit
  253 |   await press(page, 'Enter')
  254 |   await applyNaturePanel(page)
> 255 |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
      |                                                        ^ Error: expect(locator).toBeVisible() failed
  256 |   await press(page, 'Enter') // man_depth = 2 (oui)
  257 |   await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  258 |   // rouvrir 't' : depth 2 = man_depth → pas de confirmation
  259 |   await press(page, 't')
  260 |   await applyNaturePanel(page) // appliquer sans rien changer
  261 |   await expect(pane1(page).locator('.nature-panel')).not.toBeVisible()
  262 | })
  263 | 
  264 | // ─── Nature null à man_depth ─────────────────────────────────────────────────
  265 | 
  266 | test("nature null à man_depth → panneau affiche 'manuscrit', popup focused sur 'défaut'", async ({ page }) => {
  267 |   installFixtures('depth-move')
  268 |   await page.goto('/')
  269 |   await press(page, 'ArrowRight')
  270 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  271 |   await press(page, 'ArrowRight')
  272 |   await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '2')
  273 |   // Définir roman + man_depth=2 sur ce lister
  274 |   await press(page, 't')
  275 |   await press(page, 'Enter')
  276 |   await press(page, 'ArrowUp')   // film/BD
  277 |   await press(page, 'ArrowUp')   // roman
  278 |   await press(page, 'Enter')
  279 |   await press(page, 'ArrowDown')
  280 |   await press(page, 'Enter')
  281 |   await press(page, 'ArrowUp')   // manuscrit
  282 |   await press(page, 'Enter')
  283 |   await applyNaturePanel(page)
  284 |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  285 |   await press(page, 'Enter')     // oui → man_depth=2
  286 |   await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  287 |   // Naviguer vers un sibling (nature=null, depth=2=man_depth)
  288 |   await press(page, 'ArrowLeft')
  289 |   await press(page, 'ArrowDown')
  290 |   await press(page, 'ArrowRight')
  291 |   await expect(pane1(page).locator('#events-panel')).toHaveClass(/roman-man/)
  292 |   // Ouvrir panneau → ligne évènemencier affiche 'manuscrit' (effectif, même si null en DB)
  293 |   await press(page, 't')
  294 |   await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  295 |   await expect(pane1(page).locator('.nature-panel__fields')).toContainText('manuscrit')
  296 |   // Ouvrir popup évènemencier → 'défaut' doit être focused (valeur stockée = null)
  297 |   await press(page, 'ArrowDown')
  298 |   await press(page, 'Enter')
  299 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  300 |   const focused = pane1(page).locator('.popup-select__option.focused')
  301 |   await expect(focused).toContainText('défaut')
  302 | })
  303 | 
  304 | // ─── CSS roman-man ────────────────────────────────────────────────────────────
  305 | 
  306 | test("roman-man → event-text sans white-space nowrap", async ({ page }) => {
  307 |   await goToListerEvent(page)
  308 |   await setRomanMan(page)
  309 |   const ws = await pane1(page).locator('.event-text').first().evaluate(el =>
  310 |     getComputedStyle(el).whiteSpace
  311 |   )
  312 |   expect(ws).not.toBe('nowrap')
  313 | })
  314 | 
  315 | test(`roman-man → event-text max-width = MANUSCRIT_WIDTH`, async ({ page }) => {
  316 |   await goToListerEvent(page)
  317 |   await setRomanMan(page)
  318 |   const mw = await pane1(page).locator('.event-text').first().evaluate(el =>
  319 |     getComputedStyle(el).maxWidth
  320 |   )
  321 |   expect(mw).toBe(`${MANUSCRIT_WIDTH}px`)
  322 | })
  323 | 
  324 | // ─── Persistance ──────────────────────────────────────────────────────────────
  325 | 
  326 | test("roman-man persiste → page.goto('/') puis ArrowRight → #main-panel roman-man", async ({ page }) => {
  327 |   await goToListerEvent(page)
  328 |   await setRomanMan(page)
  329 |   await page.goto('/')
  330 |   await press(page, 'ArrowRight')
  331 |   await expect(pane1(page).locator('#events-panel')).toHaveClass(/roman-man/)
  332 | })
  333 | 
  334 | // ─── Tab cycle avec retour à "aucun bouton" ───────────────────────────────────
  335 | 
  336 | test("Tab×3 ramène à aucun footer sélectionné → Enter ouvre le popup", async ({ page }) => {
  337 |   await goToListerEvent(page)
  338 |   await press(page, 't')
  339 |   await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  340 |   // Cycler à travers tous les boutons footer
  341 |   await press(page, 'Tab')   // → Annuler
  342 |   await press(page, 'Tab')   // → Appliquer
  343 |   await press(page, 'Tab')   // → aucun (retour à -1)
  344 |   // Enter doit ouvrir le popup du champ sélectionné, pas activer un bouton footer
  345 |   await press(page, 'Enter')
  346 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  347 |   await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  348 | })
  349 | 
```