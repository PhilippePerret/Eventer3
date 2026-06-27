# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/perso-panel.spec.js >> les avatars déjà utilisés ne sont pas proposés lors du choix pour un autre perso
- Location: specs/e2e/_tdd/perso-panel.spec.js:247:1

# Error details

```
Error: expect(locator).toBeFocused() failed

Locator: locator('#pane-1').contentFrame().locator('.perso-item.selected input[name="title"]')
Expected: focused
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeFocused" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.perso-item.selected input[name="title"]')

```

```yaml
- text: Projet A --- roman Événement 1 — --- --- MON CY RO Événement 2 — --- --- ✓ Cyrano de Bergerac 🫥 CY --- ✓ Roxane Robin 🫥 RO --- Christian de Neuvillette 🎭 🎭 --- Valvert de Valvert 👑 👑 ---
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  150 | test("↓ sélectionne le perso suivant", async ({ page }) => {
  151 |   await openPersoPanel(page)
  152 |   await pane1(page).locator('.event-item.selected').press('ArrowDown')
  153 |   await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/selected/)
  154 | })
  155 | 
  156 | test("↑ sélectionne le perso précédent", async ({ page }) => {
  157 |   await openPersoPanel(page)
  158 |   await pane1(page).locator('.event-item.selected').press('ArrowDown')
  159 |   await pane1(page).locator('.event-item.selected').press('ArrowUp')
  160 |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
  161 | })
  162 | 
  163 | test("↓↑ dans le panneau ne modifient pas la sélection de l'ListerEvent", async ({ page }) => {
  164 |   await openPersoPanel(page)
  165 |   await pane1(page).locator('.event-item.selected').press('ArrowDown')
  166 |   await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  167 | })
  168 | 
  169 | // ─── Space (cocher/décocher perso direct) ────────────────────────────────────
  170 | 
  171 | test("Space coche un perso non-coché (c3)", async ({ page }) => {
  172 |   await openPersoPanel(page)
  173 |   await pane1(page).locator('.event-item.selected').press('ArrowDown')
  174 |   await pane1(page).locator('.event-item.selected').press('ArrowDown') // → c3
  175 |   await expect(pane1(page).locator('.perso-item').nth(2)).not.toHaveClass(/checked/)
  176 |   await pane1(page).locator('.event-item.selected').press(' ')
  177 |   await expect(pane1(page).locator('.perso-item').nth(2)).toHaveClass(/checked/)
  178 | })
  179 | 
  180 | test("Space décoche un perso direct coché (c1)", async ({ page }) => {
  181 |   await openPersoPanel(page)
  182 |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/checked/)
  183 |   await pane1(page).locator('.event-item.selected').press(' ')
  184 |   await expect(pane1(page).locator('.perso-item').nth(0)).not.toHaveClass(/checked/)
  185 | })
  186 | 
  187 | // ─── Badges persos sur la ligne de l'event ───────────────────────────────────
  188 | 
  189 | test("la ligne de e1 affiche le badge de c1 (direct) quand le panneau est ouvert", async ({ page }) => {
  190 |   await openPersoPanel(page)
  191 |   const eventEl = pane1(page).locator('.event-item').nth(0)
  192 |   await expect(eventEl.locator('.event-persos-marks')).toContainText('CY')
  193 | })
  194 | 
  195 | test("la ligne de e1 affiche le badge de c2 (hérité via brin b1) quand le panneau est ouvert", async ({ page }) => {
  196 |   await openPersoPanel(page)
  197 |   const eventEl = pane1(page).locator('.event-item').nth(0)
  198 |   await expect(eventEl.locator('.event-persos-marks')).toContainText('RO')
  199 | })
  200 | 
  201 | test("la ligne de e2 n'affiche aucun badge perso", async ({ page }) => {
  202 |   await goToListerEvent(page)
  203 |   const eventEl = pane1(page).locator('.event-item').nth(1)
  204 |   await expect(eventEl.locator('.event-persos-marks .perso-mark')).toHaveCount(0)
  205 | })
  206 | 
  207 | test("cocher c3 depuis le panneau perso de e1 ajoute son avatar sur la ligne de e1", async ({ page }) => {
  208 |   await openPersoPanel(page)
  209 |   await pane1(page).locator('.event-item.selected').press('ArrowDown')
  210 |   await pane1(page).locator('.event-item.selected').press('ArrowDown') // → c3
  211 |   await pane1(page).locator('.event-item.selected').press(' ')
  212 |   const eventEl = pane1(page).locator('.event-item').nth(0)
  213 |   await expect(eventEl.locator('.event-persos-marks')).toContainText('🎭')
  214 | })
  215 | 
  216 | // ─── Badge et avatar : avatar gagne sur badge ────────────────────────────────
  217 | 
  218 | test("la colonne badge affiche l'avatar si disponible, sinon le badge", async ({ page }) => {
  219 |   await openPersoPanel(page)
  220 |   // c3 a avatar 🎭 ET badge CH → badge circle doit montrer 🎭 (avatar gagne)
  221 |   await expect(pane1(page).locator('.perso-item').nth(2).locator('.perso-badge')).toHaveText('🎭')
  222 |   await expect(pane1(page).locator('.perso-item').nth(3).locator('.perso-badge')).toHaveText('👑')
  223 |   // c1, c2 sans avatar → badge text
  224 |   await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-badge')).not.toHaveText('🎭')
  225 | })
  226 | 
  227 | test("la colonne avatar affiche l'avatar si défini, sinon '🫥'", async ({ page }) => {
  228 |   await openPersoPanel(page)
  229 |   // c1, c2 sans avatar → '🫥'
  230 |   await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-avatar')).toHaveText('🫥')
  231 |   // c3 avatar 🎭
  232 |   await expect(pane1(page).locator('.perso-item').nth(2).locator('.perso-avatar')).toHaveText('🎭')
  233 |   await expect(pane1(page).locator('.perso-item').nth(3).locator('.perso-avatar')).toHaveText('👑')
  234 | })
  235 | 
  236 | test("si perso assigné à l'event a un avatar, la ligne event affiche l'avatar pas le badge", async ({ page }) => {
  237 |   await openPersoPanel(page)
  238 |   await pane1(page).locator('.event-item.selected').press('ArrowDown')
  239 |   await pane1(page).locator('.event-item.selected').press('ArrowDown') // → c3
  240 |   await pane1(page).locator('.event-item.selected').press(' ') // assigner c3 à e1
  241 |   const eventEl = pane1(page).locator('.event-item').nth(0)
  242 |   await expect(eventEl.locator('.event-persos-marks')).toContainText('🎭')
  243 | })
  244 | 
  245 | // ─── Unicité des avatars ─────────────────────────────────────────────────────
  246 | 
  247 | test("les avatars déjà utilisés ne sont pas proposés lors du choix pour un autre perso", async ({ page }) => {
  248 |   await openPersoPanel(page)
  249 |   await pane1(page).locator('.event-item.selected').press('Enter') // éditer c1
> 250 |   await expect(pane1(page).locator('.perso-item.selected input[name="title"]')).toBeFocused()
      |                                                                                 ^ Error: expect(locator).toBeFocused() failed
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
  348 |   await pane1(page).locator('.perso-item.selected input[name="title"]').fill('Nouveau perso')
  349 |   await pane1(page).locator('.event-item.selected').press('Enter')
  350 |   await expect(pane1(page).locator('.perso-item')).toHaveCount(5)
```