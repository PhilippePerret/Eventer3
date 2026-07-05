# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/perso-panel.spec.js >> persistance : cochage direct survit au rechargement
- Location: specs/e2e/_tdd/perso-panel.spec.js:403:6

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.perso-item').nth(2)
Expected pattern: /checked/
Received string:  "perso-item"
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.perso-item').nth(2)
    14 × locator resolved to <div data-id="c3" tabindex="-1" class="perso-item">…</div>
       - unexpected value "perso-item"

```

```yaml
- text: Christian de Neuvillette 🎭 🎭
```

# Test source

```ts
  312 |   // c1 badge=CY, c2 badge=RO
  313 |   await press(page, 'Enter') // édite c1
  314 |   await press(page, 'Tab')   // title → patronyme
  315 |   await press(page, 'Tab')   // patronyme → avatar
  316 |   await press(page, 'Tab')   // avatar → badge
  317 |   // Taper RO (déjà pris par c2) → notification immédiate, sans Enter
  318 |   await pane1(page).locator('.perso-item.selected [data-field="badge"]').fill('RO')
  319 |   await expect(pane1(page).locator('.notification')).toBeVisible()
  320 |   await expect(pane1(page).locator('.notification')).toContainText(getErr(3010, 'RO'))
  321 |   // Valider → badge doit être resté CY
  322 |   await press(page, 'Enter')
  323 |   await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-badge')).toHaveText('CY')
  324 | })
  325 | 
  326 | test("remettre son propre badge après changement temporaire → pas de notification", async ({ page }) => {
  327 |   await openPersoPanel(page)
  328 |   // c1 badge=CY — on édite c1, change badge, on remet CY
  329 |   await press(page, 'Enter')
  330 |   await press(page, 'Tab')   // title → patronyme
  331 |   await press(page, 'Tab')   // patronyme → avatar
  332 |   await press(page, 'Tab')   // avatar → badge
  333 |   await pane1(page).locator('.perso-item.selected [data-field="badge"]').fill('XX')
  334 |   await pane1(page).locator('.perso-item.selected [data-field="badge"]').fill('CY')
  335 |   await expect(pane1(page).locator('.notification')).not.toBeVisible()
  336 | })
  337 | 
  338 | test("créer un perso : Enter valide et l'ajoute à la liste", async ({ page }) => {
  339 |   await openPersoPanel(page)
  340 |   await press(page, 'n')
  341 |   await pane1(page).locator('.perso-item.selected [data-field="title"]').fill('Nouveau perso')
  342 |   await press(page, 'Enter')
  343 |   await expect(pane1(page).locator('.perso-item')).toHaveCount(5)
  344 |   await expect(pane1(page).locator('.perso-item').nth(1).locator('.perso-title')).toHaveText('Nouveau perso')
  345 | })
  346 | 
  347 | test("créer un perso : Escape annule, liste inchangée", async ({ page }) => {
  348 |   await openPersoPanel(page)
  349 |   await press(page, 'n')
  350 |   await press(page, 'Escape')
  351 |   await expect(pane1(page).locator('.perso-item')).toHaveCount(4)
  352 | })
  353 | 
  354 | // ─── Édition ─────────────────────────────────────────────────────────────────
  355 | 
  356 | test("Enter édite le perso sélectionné (input title avec valeur courante)", async ({ page }) => {
  357 |   await openPersoPanel(page)
  358 |   await press(page, 'Enter')
  359 |   const titleInput = pane1(page).locator('.perso-item.selected [data-field="title"]')
  360 |   await expect(titleInput).toBeFocused()
  361 |   await expect(titleInput).toHaveText('Cyrano')
  362 | })
  363 | 
  364 | test("Tab en édition cycle : title → patronyme → avatar → badge → type → fonction", async ({ page }) => {
  365 |   await openPersoPanel(page)
  366 |   await press(page, 'Enter')
  367 |   await expect(pane1(page).locator('.perso-item.selected [data-field="title"]')).toBeFocused()
  368 |   await press(page, 'Tab')
  369 |   await expect(pane1(page).locator('.perso-item.selected [data-field="patronyme"]')).toBeFocused()
  370 |   await press(page, 'Tab')
  371 |   await expect(pane1(page).locator('.perso-item.selected [data-field="avatar"]')).toBeFocused()
  372 |   await press(page, 'Tab')
  373 |   await expect(pane1(page).locator('.perso-item.selected [data-field="badge"]')).toBeFocused()
  374 |   await press(page, 'Tab')
  375 |   await expect(pane1(page).locator('.perso-item.selected [data-field="type"]')).toBeFocused()
  376 |   await press(page, 'Tab')
  377 |   await expect(pane1(page).locator('.perso-item.selected [data-field="fonction"]')).toBeFocused()
  378 | })
  379 | 
  380 | test("édition : modifier le titre puis Enter met à jour l'affichage", async ({ page }) => {
  381 |   await openPersoPanel(page)
  382 |   await press(page, 'Enter')
  383 |   await pane1(page).locator('.perso-item.selected [data-field="title"]').fill('Cyrano de Bergerac')
  384 |   await press(page, 'Enter')
  385 |   await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-title')).toHaveText('Cyrano de Bergerac')
  386 | })
  387 | 
  388 | // ─── Persistance ─────────────────────────────────────────────────────────────
  389 | 
  390 | test.only("persistance : perso créé survit au rechargement", async ({ page }) => {
  391 |   await openPersoPanel(page)
  392 |   await press(page, 'n')
  393 |   await pane1(page).locator('.perso-item.selected [data-field="title"]').fill('Perso persisté')
  394 |   await press(page, 'Enter')
  395 |   await page.waitForLoadState('networkidle')
  396 |   await page.reload()
  397 |   await goToListerEvent(page)
  398 |   await press(page, 'p')
  399 |   await expect(pane1(page).locator('.perso-item')).toHaveCount(5)
  400 |   await expect(pane1(page).locator('.perso-item').nth(1).locator('.perso-title')).toHaveText('Perso persisté')
  401 | })
  402 | 
  403 | test.only("persistance : cochage direct survit au rechargement", async ({ page }) => {
  404 |   await openPersoPanel(page)
  405 |   await press(page, 'ArrowDown')
  406 |   await press(page, 'ArrowDown') // → c3
  407 |   await press(page, ' ')
  408 |   await page.waitForLoadState('networkidle')
  409 |   await page.reload()
  410 |   await goToListerEvent(page)
  411 |   await press(page, 'p')
> 412 |   await expect(pane1(page).locator('.perso-item').nth(2)).toHaveClass(/checked/)
      |                                                           ^ Error: expect(locator).toHaveClass(expected) failed
  413 | })
  414 | 
  415 | // ─── Sélection après création ─────────────────────────────────────────────────
  416 | 
  417 | test("après création (Enter), le nouveau perso est sélectionné", async ({ page }) => {
  418 |   await openPersoPanel(page)
  419 |   await press(page, 'n')
  420 |   await pane1(page).locator('.perso-item.selected [data-field="title"]').fill('Nouveau')
  421 |   await press(page, 'Enter')
  422 |   await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/selected/)
  423 | })
  424 | 
  425 | // ─── Sélection après édition ──────────────────────────────────────────────────
  426 | 
  427 | test("après édition (Enter), le perso modifié reste sélectionné", async ({ page }) => {
  428 |   await openPersoPanel(page)
  429 |   await press(page, 'Enter') // édite c1
  430 |   await pane1(page).locator('.perso-item.selected [data-field="title"]').fill('Cyrano modifié')
  431 |   await press(page, 'Enter')
  432 |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
  433 | })
  434 | 
  435 | // ─── Sélection à la réouverture ───────────────────────────────────────────────
  436 | 
  437 | test("réouverture : le premier perso est sélectionné", async ({ page }) => {
  438 |   await openPersoPanel(page)
  439 |   await press(page, 'Meta+Enter')
  440 |   await expect(pane1(page).locator('#persos-panel')).not.toBeVisible()
  441 |   await press(page, 'p')
  442 |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  443 |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
  444 | })
  445 | 
  446 | test("réouverture : ↓ change bien la sélection", async ({ page }) => {
  447 |   await openPersoPanel(page)
  448 |   await press(page, 'Meta+Enter')
  449 |   await press(page, 'p')
  450 |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  451 |   await press(page, 'ArrowDown')
  452 |   await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/selected/)
  453 |   await expect(pane1(page).locator('.perso-item').nth(0)).not.toHaveClass(/selected/)
  454 | })
  455 | 
```