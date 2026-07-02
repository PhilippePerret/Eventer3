# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lister/lister-nature.spec.js >> nature man et depth ≠ man_depth → ConfirmDialog s'ouvre avec 'niveau par défaut'
- Location: specs/e2e/lister/lister-nature.spec.js:166:1

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
- text: Événement 1 — AUT Événement 2 — DISP MODE NESTING
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  80  |   await goToListerEvent(page)
  81  |   await press(page, 't')
  82  |   const footer = pane1(page).locator('.nature-panel .floating-panel__footer')
  83  |   await expect(footer).toBeVisible()
  84  |   const btns = footer.locator('.panel-btn')
  85  |   await expect(btns).toHaveCount(2)
  86  |   await expect(btns.first()).toContainText('Annuler')
  87  |   await expect(btns.last()).toContainText('Appliquer')
  88  | })
  89  | 
  90  | // ─── Navigation et menus ──────────────────────────────────────────────────────
  91  | 
  92  | test("Enter sur champ projet → popup avec 'roman' et 'film'", async ({ page }) => {
  93  |   await goToListerEvent(page)
  94  |   await press(page, 't')
  95  |   await press(page, 'Enter')
  96  |   const popup = pane1(page).locator('.popup-select')
  97  |   await expect(popup).toBeVisible()
  98  |   await expect(popup).toContainText('roman')
  99  |   await expect(popup).toContainText('film')
  100 | })
  101 | 
  102 | test("choix 'roman' → champ évènemencier activé par ArrowDown, Enter ouvre popup 'manuscrit'", async ({ page }) => {
  103 |   await goToListerEvent(page)
  104 |   await press(page, 't')
  105 |   await press(page, 'Enter')
  106 |   await press(page, 'ArrowUp')   // film/BD
  107 |   await press(page, 'ArrowUp')   // roman
  108 |   await press(page, 'Enter')     // roman
  109 |   await press(page, 'ArrowDown')
  110 |   await press(page, 'Enter')
  111 |   const popup = pane1(page).locator('.popup-select')
  112 |   await expect(popup).toBeVisible()
  113 |   await expect(popup).toContainText('manuscrit')
  114 |   await expect(popup).toContainText('défaut')
  115 | })
  116 | 
  117 | test("projet 'film' → popup évènemencier propose 'scénario'", async ({ page }) => {
  118 |   await goToListerEvent(page)
  119 |   await press(page, 't')
  120 |   await press(page, 'Enter')
  121 |   await press(page, 'ArrowUp')    // film/BD (index 1 depuis —)
  122 |   await press(page, 'Enter')
  123 |   await press(page, 'ArrowDown')  // champ évènemencier
  124 |   await press(page, 'Enter')
  125 |   await expect(pane1(page).locator('.popup-select')).toContainText('scénario')
  126 | })
  127 | 
  128 | // ─── Escape / Annuler ─────────────────────────────────────────────────────────
  129 | 
  130 | test("Escape ferme le panneau sans appliquer", async ({ page }) => {
  131 |   await goToListerEvent(page)
  132 |   await press(page, 't')
  133 |   await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  134 |   await press(page, 'Escape')
  135 |   await expect(pane1(page).locator('.nature-panel')).not.toBeVisible()
  136 |   await expect(pane1(page).locator('#events-panel')).not.toHaveClass(/roman/)
  137 | })
  138 | 
  139 | // ─── Appliquer ────────────────────────────────────────────────────────────────
  140 | 
  141 | test("roman+manuscrit → #main-panel a la classe 'roman-man'", async ({ page }) => {
  142 |   await goToListerEvent(page)
  143 |   await setRomanMan(page)
  144 |   await expect(pane1(page).locator('#events-panel')).toHaveClass(/roman-man/)
  145 | })
  146 | 
  147 | test("film+scénario → #main-panel a la classe 'film-man'", async ({ page }) => {
  148 |   await goToListerEvent(page)
  149 |   await press(page, 't')
  150 |   await press(page, 'Enter')
  151 |   await press(page, 'ArrowUp')   // film/BD (index 1 depuis —)
  152 |   await press(page, 'Enter')
  153 |   await press(page, 'ArrowDown') // champ évènemencier
  154 |   await press(page, 'Enter')
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
> 180 |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
      |                                                        ^ Error: expect(locator).toBeVisible() failed
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
  255 |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
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
```