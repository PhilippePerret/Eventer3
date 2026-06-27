# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/perso-panel.spec.js >> persistance : perso créé survit au rechargement
- Location: specs/e2e/_tdd/perso-panel.spec.js:395:1

# Error details

```
Test timeout of 15000ms exceeded.
```

```
Error: locator.fill: Test timeout of 15000ms exceeded.
Call log:
  - waiting for locator('#pane-1').contentFrame().locator('.perso-item.selected input[name="title"]')

```

# Page snapshot

```yaml
- iframe [active] [ref=e3]:
  - generic [ref=f1e1]:
    - generic [ref=f1e2]:
      - generic [ref=f1e7]:
        - generic [ref=f1e8]: Projet A
        - generic [ref=f1e9]:
          - generic [ref=f1e10]: "---"
          - generic [ref=f1e11]: roman
      - generic [ref=f1e14]:
        - generic [ref=f1e17]:
          - generic [ref=f1e18]: Événement 1
          - generic [ref=f1e19]:
            - generic [ref=f1e20]: —
            - generic [ref=f1e21]: "---"
            - generic [ref=f1e22]: "---"
          - generic [ref=f1e23]:
            - generic [ref=f1e26]: MON
            - generic [ref=f1e28]:
              - generic [ref=f1e29]: CY
              - generic [ref=f1e30]: RO
        - generic [ref=f1e35]:
          - generic [ref=f1e36]: "---"
          - generic [ref=f1e37]: "---"
          - generic [ref=f1e38]: "---"
        - generic [ref=f1e41]:
          - generic [ref=f1e42]: Événement 2
          - generic [ref=f1e43]:
            - generic [ref=f1e44]: —
            - generic [ref=f1e45]: "---"
            - generic [ref=f1e46]: "---"
      - generic [ref=f1e49]:
        - generic [ref=f1e50]:
          - generic [ref=f1e52]: ✓
          - generic [ref=f1e53]:
            - generic [ref=f1e54]: Cyrano
            - generic [ref=f1e55]:
              - generic [ref=f1e56]: de Bergerac
              - generic [ref=f1e57]: 🫥
              - generic [ref=f1e58]: CY
              - generic [ref=f1e59]: "---"
        - generic [ref=f1e60]:
          - generic [ref=f1e62]: ✓
          - generic [ref=f1e63]:
            - generic [ref=f1e64]: Roxane
            - generic [ref=f1e65]:
              - generic [ref=f1e66]: Robin
              - generic [ref=f1e67]: 🫥
              - generic [ref=f1e68]: RO
              - generic [ref=f1e69]: "---"
        - generic [ref=f1e72]:
          - generic [ref=f1e73]: Christian
          - generic [ref=f1e74]:
            - generic [ref=f1e75]: de Neuvillette
            - generic [ref=f1e76]: 🎭
            - generic [ref=f1e77]: 🎭
            - generic [ref=f1e78]: "---"
        - generic [ref=f1e81]:
          - generic [ref=f1e82]: Valvert
          - generic [ref=f1e83]:
            - generic [ref=f1e84]: de Valvert
            - generic [ref=f1e85]: 👑
            - generic [ref=f1e86]: 👑
            - generic [ref=f1e87]: "---"
    - contentinfo "Raccourcis clavier" [ref=f1e88]
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  298 |   await pane1(page).locator('.perso-item.selected').press('Enter')
  299 |   const badgeEl = pane1(page).locator('.perso-item').nth(1).locator('.perso-badge')
  300 |   await expect(badgeEl).not.toHaveText('CY')
  301 |   const badge = await badgeEl.textContent()
  302 |   expect(badge.trim().length).toBe(2)
  303 | })
  304 | 
  305 | test("éditer un perso et vider le badge → recalculé depuis le patronyme", async ({ page }) => {
  306 |   await openPersoPanel(page)
  307 |   await pane1(page).locator('.perso-item.selected').press('Enter') // édite c1 (title='Cyrano', patronyme='de Bergerac')
  308 |   await pane1(page).locator('.perso-item.selected').press('Tab') // → patronyme
  309 |   await pane1(page).locator('.perso-item.selected').press('Tab') // → avatar
  310 |   await pane1(page).locator('.perso-item.selected').press('Tab') // → badge
  311 |   await pane1(page).locator('.perso-item.selected [data-field="badge"]').fill('') // vider
  312 |   await pane1(page).locator('.perso-item.selected').press('Enter')
  313 |   // patronyme 'de Bergerac' → 'debergerac'.toUpperCase() → 'DE'
  314 |   await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-badge')).toHaveText('DE')
  315 | })
  316 | 
  317 | test("modifier le badge d'un perso vers une valeur déjà prise → notification immédiate + badge non modifié", async ({ page }) => {
  318 |   await openPersoPanel(page)
  319 |   // c1 badge=CY, c2 badge=RO
  320 |   await pane1(page).locator('.perso-item.selected').press('Enter') // édite c1
  321 |   await pane1(page).locator('.perso-item.selected').press('Tab')   // title → patronyme
  322 |   await pane1(page).locator('.perso-item.selected').press('Tab')   // patronyme → avatar
  323 |   await pane1(page).locator('.perso-item.selected').press('Tab')   // avatar → badge
  324 |   // Taper RO (déjà pris par c2) → notification immédiate, sans Enter
  325 |   await pane1(page).locator('.perso-item.selected [data-field="badge"]').fill('RO')
  326 |   await expect(pane1(page).locator('.notification')).toBeVisible()
  327 |   await expect(pane1(page).locator('.notification')).toContainText(getErr(3010, 'RO'))
  328 |   // Valider → badge doit être resté CY
  329 |   await pane1(page).locator('.perso-item.selected').press('Enter')
  330 |   await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-badge')).toHaveText('CY')
  331 | })
  332 | 
  333 | test("remettre son propre badge après changement temporaire → pas de notification", async ({ page }) => {
  334 |   await openPersoPanel(page)
  335 |   // c1 badge=CY — on édite c1, change badge, on remet CY
  336 |   await pane1(page).locator('.perso-item.selected').press('Enter')
  337 |   await pane1(page).locator('.perso-item.selected').press('Tab')   // title → patronyme
  338 |   await pane1(page).locator('.perso-item.selected').press('Tab')   // patronyme → avatar
  339 |   await pane1(page).locator('.perso-item.selected').press('Tab')   // avatar → badge
  340 |   await pane1(page).locator('.perso-item.selected [data-field="badge"]').fill('XX')
  341 |   await pane1(page).locator('.perso-item.selected [data-field="badge"]').fill('CY')
  342 |   await expect(pane1(page).locator('.notification')).not.toBeVisible()
  343 | })
  344 | 
  345 | test("créer un perso : Enter valide et l'ajoute à la liste", async ({ page }) => {
  346 |   await openPersoPanel(page)
  347 |   await pane1(page).locator('.event-item.selected').press('n')
  348 |   await pane1(page).locator('.perso-item.selected input[name="title"]').fill('Nouveau perso')
  349 |   await pane1(page).locator('.event-item.selected').press('Enter')
  350 |   await expect(pane1(page).locator('.perso-item')).toHaveCount(5)
  351 |   await expect(pane1(page).locator('.perso-item').nth(1).locator('.perso-item__title')).toHaveText('Nouveau perso')
  352 | })
  353 | 
  354 | test("créer un perso : Escape annule, liste inchangée", async ({ page }) => {
  355 |   await openPersoPanel(page)
  356 |   await pane1(page).locator('.event-item.selected').press('n')
  357 |   await pane1(page).locator('.event-item.selected').press('Escape')
  358 |   await expect(pane1(page).locator('.perso-item')).toHaveCount(4)
  359 | })
  360 | 
  361 | // ─── Édition ─────────────────────────────────────────────────────────────────
  362 | 
  363 | test("Enter édite le perso sélectionné (input title avec valeur courante)", async ({ page }) => {
  364 |   await openPersoPanel(page)
  365 |   await pane1(page).locator('.event-item.selected').press('Enter')
  366 |   const titleInput = pane1(page).locator('.perso-item.selected input[name="title"]')
  367 |   await expect(titleInput).toBeFocused()
  368 |   await expect(titleInput).toHaveValue('Cyrano')
  369 | })
  370 | 
  371 | test("Tab en édition cycle : title → patronyme → badge → avatar → fonction", async ({ page }) => {
  372 |   await openPersoPanel(page)
  373 |   await pane1(page).locator('.event-item.selected').press('Enter')
  374 |   await expect(pane1(page).locator('.perso-item.selected input[name="title"]')).toBeFocused()
  375 |   await pane1(page).locator('.event-item.selected').press('Tab')
  376 |   await expect(pane1(page).locator('.perso-item.selected input[name="patronyme"]')).toBeFocused()
  377 |   await pane1(page).locator('.event-item.selected').press('Tab')
  378 |   await expect(pane1(page).locator('.perso-item.selected input[name="badge"]')).toBeFocused()
  379 |   await pane1(page).locator('.event-item.selected').press('Tab')
  380 |   await expect(pane1(page).locator('.perso-item.selected [data-property="avatar"]')).toBeFocused()
  381 |   await pane1(page).locator('.event-item.selected').press('Tab')
  382 |   await expect(pane1(page).locator('.perso-item.selected [data-property="fonction"]')).toBeFocused()
  383 | })
  384 | 
  385 | test("édition : modifier le titre puis Enter met à jour l'affichage", async ({ page }) => {
  386 |   await openPersoPanel(page)
  387 |   await pane1(page).locator('.event-item.selected').press('Enter')
  388 |   await pane1(page).locator('.perso-item.selected input[name="title"]').fill('Cyrano de Bergerac')
  389 |   await pane1(page).locator('.event-item.selected').press('Enter')
  390 |   await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-item__title')).toHaveText('Cyrano de Bergerac')
  391 | })
  392 | 
  393 | // ─── Persistance ─────────────────────────────────────────────────────────────
  394 | 
  395 | test("persistance : perso créé survit au rechargement", async ({ page }) => {
  396 |   await openPersoPanel(page)
  397 |   await pane1(page).locator('.event-item.selected').press('n')
> 398 |   await pane1(page).locator('.perso-item.selected input[name="title"]').fill('Perso persisté')
      |                                                                         ^ Error: locator.fill: Test timeout of 15000ms exceeded.
  399 |   await pane1(page).locator('.event-item.selected').press('Enter')
  400 |   await page.waitForLoadState('networkidle')
  401 |   await page.reload()
  402 |   await goToListerEvent(page)
  403 |   await pane1(page).locator('.event-item.selected').press('p')
  404 |   await expect(pane1(page).locator('.perso-item')).toHaveCount(5)
  405 |   await expect(pane1(page).locator('.perso-item').nth(1).locator('.perso-item__title')).toHaveText('Perso persisté')
  406 | })
  407 | 
  408 | test("persistance : cochage direct survit au rechargement", async ({ page }) => {
  409 |   await openPersoPanel(page)
  410 |   await pane1(page).locator('.event-item.selected').press('ArrowDown')
  411 |   await pane1(page).locator('.event-item.selected').press('ArrowDown') // → c3
  412 |   await pane1(page).locator('.event-item.selected').press(' ')
  413 |   await page.waitForLoadState('networkidle')
  414 |   await page.reload()
  415 |   await goToListerEvent(page)
  416 |   await pane1(page).locator('.event-item.selected').press('p')
  417 |   await expect(pane1(page).locator('.perso-item').nth(2)).toHaveClass(/checked/)
  418 | })
  419 | 
  420 | // ─── Sélection après création ─────────────────────────────────────────────────
  421 | 
  422 | test("après création (Enter), le nouveau perso est sélectionné", async ({ page }) => {
  423 |   await openPersoPanel(page)
  424 |   await pane1(page).locator('.event-item.selected').press('n')
  425 |   await pane1(page).locator('.perso-item.selected input[name="title"]').fill('Nouveau')
  426 |   await pane1(page).locator('.event-item.selected').press('Enter')
  427 |   await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/selected/)
  428 | })
  429 | 
  430 | // ─── Sélection après édition ──────────────────────────────────────────────────
  431 | 
  432 | test("après édition (Enter), le perso modifié reste sélectionné", async ({ page }) => {
  433 |   await openPersoPanel(page)
  434 |   await pane1(page).locator('.event-item.selected').press('Enter') // édite c1
  435 |   await pane1(page).locator('.perso-item.selected input[name="title"]').fill('Cyrano modifié')
  436 |   await pane1(page).locator('.event-item.selected').press('Enter')
  437 |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
  438 | })
  439 | 
  440 | // ─── Sélection à la réouverture ───────────────────────────────────────────────
  441 | 
  442 | test("réouverture : le premier perso est sélectionné", async ({ page }) => {
  443 |   await openPersoPanel(page)
  444 |   await pane1(page).locator('.event-item.selected').press('Escape')
  445 |   await expect(pane1(page).locator('#persos-panel')).not.toBeVisible()
  446 |   await pane1(page).locator('.event-item.selected').press('p')
  447 |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  448 |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
  449 | })
  450 | 
  451 | test("réouverture : ↓ change bien la sélection", async ({ page }) => {
  452 |   await openPersoPanel(page)
  453 |   await pane1(page).locator('.event-item.selected').press('Escape')
  454 |   await pane1(page).locator('.event-item.selected').press('p')
  455 |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  456 |   await pane1(page).locator('.event-item.selected').press('ArrowDown')
  457 |   await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/selected/)
  458 |   await expect(pane1(page).locator('.perso-item').nth(0)).not.toHaveClass(/selected/)
  459 | })
  460 | 
```