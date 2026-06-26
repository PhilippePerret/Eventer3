# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/brin-panel.spec.js >> Tab en édition cycle sur les 4 champs : title → badge → type → color
- Location: specs/e2e/_tdd/brin-panel.spec.js:203:1

# Error details

```
Error: expect(locator).toBeFocused() failed

Locator:  locator('#pane-1').contentFrame().locator('.brin-item.selected [data-field="badge"]')
Expected: focused
Received: inactive
Timeout:  5000ms

Call log:
  - Expect "toBeFocused" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.brin-item.selected [data-field="badge"]')
    14 × locator resolved to <span tabindex="0" class="brin-badge" data-field="badge" contenteditable="true">MON</span>
       - unexpected value "inactive"

```

```yaml
- text: MON
```

# Test source

```ts
  108 |   await pane1(page).locator('.brin-item.selected').press('ArrowDown')
  109 |   await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/selected/)
  110 | })
  111 | 
  112 | test("↑ sélectionne le brin précédent", async ({ page }) => {
  113 |   await openBrinPanel(page)
  114 |   await pane1(page).locator('.brin-item.selected').press('ArrowDown')
  115 |   await pane1(page).locator('.brin-item.selected').press('ArrowUp')
  116 |   await expect(pane1(page).locator('.brin-item').nth(0)).toHaveClass(/selected/)
  117 | })
  118 | 
  119 | test("↓↑ dans le panneau ne modifient pas la sélection de l'ListerEvent", async ({ page }) => {
  120 |   await openBrinPanel(page)
  121 |   await pane1(page).locator('.brin-item.selected').press('ArrowDown')
  122 |   await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  123 | })
  124 | 
  125 | // --- Space (cocher / décocher) ---
  126 | 
  127 | test("Space coche un brin non-coché", async ({ page }) => {
  128 |   await openBrinPanel(page)
  129 |   await expect(pane1(page).locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  130 |   await pane1(page).locator('.brin-item.selected').press(' ')
  131 |   await expect(pane1(page).locator('.brin-item').nth(0)).toHaveClass(/checked/)
  132 | })
  133 | 
  134 | test("Space décoche un brin déjà coché", async ({ page }) => {
  135 |   await openBrinPanel(page)
  136 |   await pane1(page).locator('.brin-item.selected').press('ArrowDown')
  137 |   await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/checked/)
  138 |   await pane1(page).locator('.brin-item.selected').press(' ')
  139 |   await expect(pane1(page).locator('.brin-item').nth(1)).not.toHaveClass(/checked/)
  140 | })
  141 | 
  142 | // --- Création ---
  143 | 
  144 | test("n ouvre l'éditeur pour un nouveau brin (input title focalisé)", async ({ page }) => {
  145 |   await openBrinPanel(page)
  146 |   await pane1(page).locator('.brin-item.selected').press('n')
  147 |   const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
  148 |   await expect(titleInput).toBeFocused()
  149 | })
  150 | 
  151 | test("créer un brin : Enter valide et l'ajoute à la liste", async ({ page }) => {
  152 |   await openBrinPanel(page)
  153 |   await pane1(page).locator('.brin-item.selected').press('n')
  154 |   const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
  155 |   await titleInput.fill('Nouveau brin')
  156 |   await pane1(page).locator('.brin-item.selected').press('Enter')
  157 |   await expect(pane1(page).locator('.brin-item')).toHaveCount(3)
  158 |   await expect(pane1(page).locator('.brin-item').nth(1).locator('.brin-title')).toHaveText('Nouveau brin')
  159 | })
  160 | 
  161 | test("créer un brin : Escape annule, liste inchangée", async ({ page }) => {
  162 |   await openBrinPanel(page)
  163 |   await pane1(page).locator('.brin-item.selected').press('n')
  164 |   await pane1(page).locator('.brin-item.selected').press('Escape')
  165 |   await expect(pane1(page).locator('.brin-item')).toHaveCount(2)
  166 | })
  167 | 
  168 | // --- Édition ---
  169 | 
  170 | test("Enter édite le brin sélectionné (input title focalisé avec valeur courante)", async ({ page }) => {
  171 |   await openBrinPanel(page)
  172 |   await pane1(page).locator('.brin-item.selected').press('Enter')
  173 |   const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
  174 |   await expect(titleInput).toBeFocused()
  175 |   await expect(titleInput).toHaveValue('Mon brin')
  176 | })
  177 | 
  178 | test("Tab en édition passe du titre au badge", async ({ page }) => {
  179 |   await openBrinPanel(page)
  180 |   await pane1(page).locator('.brin-item.selected').press('Enter')
  181 |   await expect(pane1(page).locator('.brin-item.selected [data-field="title"]')).toBeFocused()
  182 |   await pane1(page).locator('.brin-item.selected').press('Tab')
  183 |   const badgeInput = pane1(page).locator('.brin-item.selected [data-field="badge"]')
  184 |   await expect(badgeInput).toBeFocused()
  185 |   await expect(badgeInput).toHaveValue('MON')
  186 | })
  187 | 
  188 | test("Tab depuis la couleur revient au titre (cycle complet)", async ({ page }) => {
  189 |   await openBrinPanel(page)
  190 |   await pane1(page).locator('.brin-item.selected').press('Enter')
  191 |   await expect(pane1(page).locator('.brin-item.selected [data-field="title"]')).toBeFocused()
  192 |   await pane1(page).locator('.brin-item.selected').press('Tab')
  193 |   await expect(pane1(page).locator('.brin-item.selected [data-field="badge"]')).toBeFocused()
  194 |   await pane1(page).locator('.brin-item.selected').press('Tab')
  195 |   await expect(pane1(page).locator('.brin-item.selected [data-field="type"]')).toBeFocused()
  196 |   await pane1(page).locator('.brin-item.selected').press('Tab')
  197 |   await expect(pane1(page).locator('.brin-item.selected [data-field="color"]')).toBeFocused()
  198 |   // color → title (wrap-around)
  199 |   await pane1(page).locator('.brin-item.selected').press('Tab')
  200 |   await expect(pane1(page).locator('.brin-item.selected [data-field="title"]')).toBeFocused()
  201 | })
  202 | 
  203 | test("Tab en édition cycle sur les 4 champs : title → badge → type → color", async ({ page }) => {
  204 |   await openBrinPanel(page)
  205 |   await pane1(page).locator('.brin-item.selected').press('Enter')
  206 |   await expect(pane1(page).locator('.brin-item.selected [data-field="title"]')).toBeFocused()
  207 |   await pane1(page).locator('.brin-item.selected').press('Tab')
> 208 |   await expect(pane1(page).locator('.brin-item.selected [data-field="badge"]')).toBeFocused()
      |                                                                                 ^ Error: expect(locator).toBeFocused() failed
  209 |   await pane1(page).locator('.brin-item.selected').press('Tab')
  210 |   await expect(pane1(page).locator('.brin-item.selected [data-field="type"]')).toBeFocused()
  211 |   await pane1(page).locator('.brin-item.selected').press('Tab')
  212 |   await expect(pane1(page).locator('.brin-item.selected [data-field="color"]')).toBeFocused()
  213 | })
  214 | 
  215 | test("édition : modifier le titre puis Enter met à jour l'affichage", async ({ page }) => {
  216 |   await openBrinPanel(page)
  217 |   await pane1(page).locator('.brin-item.selected').press('Enter')
  218 |   const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
  219 |   await titleInput.fill('Brin renommé')
  220 |   await pane1(page).locator('.brin-item.selected').press('Enter')
  221 |   await expect(pane1(page).locator('.brin-item').nth(0).locator('.brin-title')).toHaveText('Brin renommé')
  222 | })
  223 | 
  224 | test("édition : Escape restaure le titre original", async ({ page }) => {
  225 |   await openBrinPanel(page)
  226 |   await pane1(page).locator('.brin-item.selected').press('Enter')
  227 |   const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
  228 |   await titleInput.fill('Titre temporaire')
  229 |   await pane1(page).locator('.brin-item.selected').press('Escape')
  230 |   await expect(pane1(page).locator('.brin-item').nth(0).locator('.brin-title')).toHaveText('Mon brin')
  231 | })
  232 | 
  233 | // --- Persistance ---
  234 | 
  235 | test("persistance : brin créé survit au rechargement", async ({ page }) => {
  236 |   await openBrinPanel(page)
  237 |   await pane1(page).locator('.brin-item.selected').press('n')
  238 |   const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
  239 |   await titleInput.fill('Brin persisté')
  240 |   await pane1(page).locator('.brin-item.selected').press('Enter')
  241 |   await page.waitForLoadState('networkidle')
  242 | 
  243 |   await page.reload()
  244 |   await goToListerEvent(page)
  245 |   await pane1(page).locator('.event-item.selected').press('b')
  246 |   await expect(pane1(page).locator('.brin-item')).toHaveCount(3)
  247 |   await expect(pane1(page).locator('.brin-item').nth(1).locator('.brin-title')).toHaveText('Brin persisté')
  248 | })
  249 | 
  250 | test("persistance : brin édité survit au rechargement", async ({ page }) => {
  251 |   await openBrinPanel(page)
  252 |   await pane1(page).locator('.brin-item.selected').press('Enter')
  253 |   const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
  254 |   await titleInput.fill('Brin modifié')
  255 |   await pane1(page).locator('.brin-item.selected').press('Enter')
  256 |   await page.waitForLoadState('networkidle')
  257 | 
  258 |   await page.reload()
  259 |   await goToListerEvent(page)
  260 |   await pane1(page).locator('.event-item.selected').press('b')
  261 |   await expect(pane1(page).locator('.brin-item').nth(0).locator('.brin-title')).toHaveText('Brin modifié')
  262 | })
  263 | 
  264 | test("persistance : cochage survit au rechargement", async ({ page }) => {
  265 |   await openBrinPanel(page)
  266 |   await pane1(page).locator('.brin-item.selected').press(' ')
  267 |   await page.waitForLoadState('networkidle')
  268 | 
  269 |   await page.reload()
  270 |   await goToListerEvent(page)
  271 |   await pane1(page).locator('.event-item.selected').press('b')
  272 |   await expect(pane1(page).locator('.brin-item').nth(0)).toHaveClass(/checked/)
  273 | })
  274 | 
```