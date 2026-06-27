# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/perso-panel.spec.js >> créer un perso : Enter valide et l'ajoute à la liste
- Location: specs/e2e/_tdd/perso-panel.spec.js:345:1

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
  248 |   await openPersoPanel(page)
  249 |   await pane1(page).locator('.event-item.selected').press('Enter') // éditer c1
  250 |   await expect(pane1(page).locator('.perso-item.selected input[name="title"]')).toBeFocused()
  251 |   await pane1(page).locator('.event-item.selected').press('Tab') // → patronyme
  252 |   await pane1(page).locator('.event-item.selected').press('Tab') // → badge
  253 |   await pane1(page).locator('.event-item.selected').press('Tab') // → avatar trigger
  254 |   await pane1(page).locator('.event-item.selected').press('ArrowDown') // → ouvre popup avatar
  255 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  256 |   // 🎭 (c3) et 👑 (c4) ne doivent pas apparaître parmi les options régulières
  257 |   const options = pane1(page).locator('.popup-select__option:not(.popup-select__option--custom)')
  258 |   await expect(options.filter({ hasText: '🎭' })).toHaveCount(0)
  259 |   await expect(options.filter({ hasText: '👑' })).toHaveCount(0)
  260 | })
  261 | 
  262 | // ─── Création ────────────────────────────────────────────────────────────────
  263 | 
  264 | test("n ouvre l'éditeur pour un nouveau perso (input title focalisé)", async ({ page }) => {
  265 |   await openPersoPanel(page)
  266 |   await pane1(page).locator('.event-item.selected').press('n')
  267 |   await expect(pane1(page).locator('.perso-item.selected input[name="title"]')).toBeFocused()
  268 | })
  269 | 
  270 | // ─── Badge auto-calcul ───────────────────────────────────────────────────────
  271 | 
  272 | test("créer un perso avec patronyme → badge calculé depuis le patronyme", async ({ page }) => {
  273 |   await openPersoPanel(page)
  274 |   await pane1(page).locator('.perso-item.selected').press('n')
  275 |   await pane1(page).locator('.perso-item.selected [data-field="title"]').fill('Jean')
  276 |   await pane1(page).locator('.perso-item.selected').press('Tab') // → patronyme
  277 |   await pane1(page).locator('.perso-item.selected [data-field="patronyme"]').fill('Valjean')
  278 |   // badge vide : laisser auto-calc
  279 |   await pane1(page).locator('.perso-item.selected').press('Enter')
  280 |   // 'Valjean' sans espaces → 'VA'
  281 |   await expect(pane1(page).locator('.perso-item').nth(1).locator('.perso-badge')).toHaveText('VA')
  282 | })
  283 | 
  284 | test("créer un perso sans patronyme → badge calculé depuis le titre", async ({ page }) => {
  285 |   await openPersoPanel(page)
  286 |   await pane1(page).locator('.perso-item.selected').press('n')
  287 |   await pane1(page).locator('.perso-item.selected [data-field="title"]').fill('Cosette')
  288 |   // pas de patronyme, badge vide
  289 |   await pane1(page).locator('.perso-item.selected').press('Enter')
  290 |   await expect(pane1(page).locator('.perso-item').nth(1).locator('.perso-badge')).toHaveText('CO')
  291 | })
  292 | 
  293 | test("badge unique si collision avec un badge existant", async ({ page }) => {
  294 |   await openPersoPanel(page)
  295 |   await pane1(page).locator('.perso-item.selected').press('n')
  296 |   // 'Cyrus' → 'CY' → collision avec c1 → doit être différent
  297 |   await pane1(page).locator('.perso-item.selected [data-field="title"]').fill('Cyrus')
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
> 348 |   await pane1(page).locator('.perso-item.selected input[name="title"]').fill('Nouveau perso')
      |                                                                         ^ Error: locator.fill: Test timeout of 15000ms exceeded.
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
  398 |   await pane1(page).locator('.perso-item.selected input[name="title"]').fill('Perso persisté')
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
```