# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/brin-panel.spec.js >> Enter édite le brin sélectionné (input title focalisé avec valeur courante)
- Location: specs/e2e/_tdd/brin-panel.spec.js:170:1

# Error details

```
Error: expect(locator).toHaveValue(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.brin-item.selected [data-field="title"]')
Expected: "Mon brin"
Error: Not an input element

Call log:
  - Expect "toHaveValue" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.brin-item.selected [data-field="title"]')

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
          - generic [ref=f1e26]: AUT
        - generic [ref=f1e29]:
          - generic [ref=f1e30]: Événement 2
          - generic [ref=f1e31]:
            - generic [ref=f1e32]: —
            - generic [ref=f1e33]: "---"
            - generic [ref=f1e34]: "---"
      - generic [ref=f1e37]:
        - generic [ref=f1e40]:
          - generic [active] [ref=f1e41]: Mon brin
          - generic [ref=f1e42]:
            - generic [ref=f1e43]: "#d9c8a9"
            - generic [ref=f1e44]: MON
            - generic [ref=f1e45]: brin
        - generic [ref=f1e46]:
          - generic [ref=f1e48]: ✓
          - generic [ref=f1e49]:
            - generic [ref=f1e50]: Autre brin
            - generic [ref=f1e51]:
              - generic [ref=f1e52]: "#c8d9a9"
              - generic [ref=f1e53]: AUT
              - generic [ref=f1e54]: brin
    - contentinfo "Raccourcis clavier" [ref=f1e55]
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  75  |   await expect(pane1(page).locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  76  |   await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/checked/)
  77  | })
  78  | 
  79  | test("seuls les brins de l'event sélectionné sont cochés à l'ouverture", async ({ page }) => {
  80  |   // e1 sélectionné : seul b2 coché (e1 a bi=["b2"])
  81  |   await goToListerEvent(page)
  82  |   await pane1(page).locator('.event-item.selected').press('b')
  83  |   await expect(pane1(page).locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  84  |   await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/checked/)
  85  |   await pane1(page).locator('.brin-item.selected').press('b')
  86  |   // e2 sélectionné : aucun brin coché (e2 n'a pas de bi)
  87  |   await pane1(page).locator('.event-item.selected').press('ArrowDown')
  88  |   await pane1(page).locator('.event-item.selected').press('b')
  89  |   await expect(pane1(page).locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  90  |   await expect(pane1(page).locator('.brin-item').nth(1)).not.toHaveClass(/checked/)
  91  |   await pane1(page).locator('.brin-item.selected').press('b')
  92  |   // retour à e1 : b2 doit de nouveau être coché (pas de stale state)
  93  |   await pane1(page).locator('.event-item.selected').press('ArrowUp')
  94  |   await pane1(page).locator('.event-item.selected').press('b')
  95  |   await expect(pane1(page).locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  96  |   await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/checked/)
  97  | })
  98  | 
  99  | test("le premier brin est sélectionné à l'ouverture", async ({ page }) => {
  100 |   await openBrinPanel(page)
  101 |   await expect(pane1(page).locator('.brin-item').nth(0)).toHaveClass(/selected/)
  102 | })
  103 | 
  104 | // --- Navigation ---
  105 | 
  106 | test("↓ sélectionne le brin suivant", async ({ page }) => {
  107 |   await openBrinPanel(page)
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
> 175 |   await expect(titleInput).toHaveValue('Mon brin')
      |                            ^ Error: expect(locator).toHaveValue(expected) failed
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
  208 |   await expect(pane1(page).locator('.brin-item.selected [data-field="badge"]')).toBeFocused()
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