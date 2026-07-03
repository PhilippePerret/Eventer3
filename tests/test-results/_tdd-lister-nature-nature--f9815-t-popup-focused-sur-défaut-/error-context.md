# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/lister-nature.spec.js >> nature null à man_depth → panneau affiche 'manuscrit', popup focused sur 'défaut'
- Location: specs/e2e/_tdd/lister-nature.spec.js:280:6

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.nature-panel')
Expected substring: "manuscrit"
Received string:    "Type de « l'évènemencier » (niv. 1)Nature projet—Nature évènemencierévènemencierAppliquerAnnuler"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.nature-panel')
    14 × locator resolved to <div tabindex="-1" class="ftpanel kpanel nature-panel">…</div>
       - unexpected value "Type de « l'évènemencier » (niv. 1)Nature projet—Nature évènemencierévènemencierAppliquerAnnuler"

```

```yaml
- text: Type de « l'évènemencier » (niv. 1) Nature projet — Nature évènemencier évènemencier ⇥ Appliquer ⇥ Annuler
```

# Test source

```ts
  211 |   await applyNaturePanel(page)
  212 |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  213 |   await press(page, 'Enter')     // Non (déjà focalisé) → refuser man_depth
  214 |   await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  215 |   await press(page, 'ArrowLeft')
  216 |   await press(page, 'ArrowDown')
  217 |   await press(page, 'ArrowRight')
  218 |   await expect(pane1(page).locator('#events-panel')).not.toHaveClass(/roman-man/)
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
  280 | test.only("nature null à man_depth → panneau affiche 'manuscrit', popup focused sur 'défaut'", async ({ page }) => {
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
> 311 |   await expect(pane1(page).locator('.nature-panel')).toContainText('manuscrit')
      |                                                      ^ Error: expect(locator).toContainText(expected) failed
  312 |   await press(page, 'ArrowDown')
  313 |   await press(page, 'Enter')
  314 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  315 |   const focused = pane1(page).locator('.popup-select__option.focused')
  316 |   await expect(focused).toContainText('défaut')
  317 | })
  318 | 
  319 | // ─── CSS roman-man ────────────────────────────────────────────────────────────
  320 | 
  321 | test("roman-man → event-text sans white-space nowrap", async ({ page }) => {
  322 |   await goToListerEvent(page)
  323 |   await setRomanMan(page)
  324 |   const ws = await pane1(page).locator('.event-title').first().evaluate(el =>
  325 |     getComputedStyle(el).whiteSpace
  326 |   )
  327 |   expect(ws).not.toBe('nowrap')
  328 | })
  329 | 
  330 | test(`roman-man → event-text max-width = MANUSCRIT_WIDTH`, async ({ page }) => {
  331 |   await goToListerEvent(page)
  332 |   await setRomanMan(page)
  333 |   const mw = await pane1(page).locator('.event-title').first().evaluate(el =>
  334 |     getComputedStyle(el).maxWidth
  335 |   )
  336 |   expect(mw).toBe(`${MANUSCRIT_WIDTH}px`)
  337 | })
  338 | 
  339 | // ─── Persistance ──────────────────────────────────────────────────────────────
  340 | 
  341 | test("roman-man persiste → page.goto('/') puis ArrowRight → #main-panel roman-man", async ({ page }) => {
  342 |   await goToListerEvent(page)
  343 |   await setRomanMan(page)
  344 |   await page.goto('/')
  345 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  346 |   await press(page, 'ArrowRight')
  347 |   await expect(pane1(page).locator('#events-panel')).toHaveClass(/roman-man/)
  348 | })
  349 | 
  350 | // ─── Tab cycle avec retour à "aucun bouton" ───────────────────────────────────
  351 | 
  352 | test("Tab×3 ramène à aucun footer sélectionné → Enter ouvre le popup", async ({ page }) => {
  353 |   await goToListerEvent(page)
  354 |   await press(page, 't')
  355 |   await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  356 |   await press(page, 'Tab')   // → Annuler
  357 |   await press(page, 'Tab')   // → Appliquer
  358 |   await press(page, 'Tab')   // → aucun (retour à -1)
  359 |   await press(page, 'Enter')
  360 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  361 |   await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  362 | })
  363 | 
  364 | // ─── PopupSelect : currentValue ───────────────────────────────────────────────
  365 | 
  366 | test("popup nature projet : option '—' focused quand currentValue est null", async ({ page }) => {
  367 |   await goToListerEvent(page)
  368 |   await press(page, 't')
  369 |   await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  370 |   await press(page, 'Enter')
  371 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  372 |   const focused = pane1(page).locator('.popup-select__option.focused')
  373 |   await expect(focused).toContainText('—')
  374 | })
  375 | 
  376 | test("popup nature évènemencier : option 'défaut' focused quand currentValue est null", async ({ page }) => {
  377 |   await goToListerEvent(page)
  378 |   await press(page, 't')
  379 |   await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  380 |   await press(page, 'Enter')
  381 |   await press(page, 'ArrowUp')   // film/BD
  382 |   await press(page, 'ArrowUp')   // roman
  383 |   await press(page, 'Enter')
  384 |   await press(page, 'ArrowDown')
  385 |   await press(page, 'Enter')
  386 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  387 |   const focused = pane1(page).locator('.popup-select__option.focused')
  388 |   await expect(focused).toContainText('défaut')
  389 | })
  390 | 
  391 | test("popup nature projet : option 'roman' focused après avoir choisi roman", async ({ page }) => {
  392 |   await goToListerEvent(page)
  393 |   await press(page, 't')
  394 |   await press(page, 'Enter')
  395 |   await press(page, 'ArrowUp')   // pièce radio
  396 |   await press(page, 'ArrowUp')   // théâtre
  397 |   await press(page, 'ArrowUp')   // BD
  398 |   await press(page, 'ArrowUp')   // film
  399 |   await press(page, 'ArrowUp')   // roman
  400 |   await press(page, 'Enter')     // select roman
  401 |   await press(page, 'Enter')     // rouvrir
  402 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  403 |   const focused = pane1(page).locator('.popup-select__option.focused')
  404 |   await expect(focused).toContainText('roman')
  405 | })
  406 | 
```