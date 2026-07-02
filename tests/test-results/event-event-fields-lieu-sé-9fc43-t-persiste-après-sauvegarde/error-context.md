# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: event/event-fields.spec.js >> lieu : sélection 'ext' persiste après sauvegarde
- Location: specs/e2e/event/event-fields.spec.js:137:1

# Error details

```
Test timeout of 15000ms exceeded.
```

```
Error: locator.click: Test timeout of 15000ms exceeded.
Call log:
  - waiting for locator('#pane-1').contentFrame().locator('.popup-select__option[data-value="ext"]')

```

# Page snapshot

```yaml
- iframe [active] [ref=e3]:
  - generic [ref=f1e1]:
    - generic [ref=f1e5]:
      - generic [ref=f1e8]:
        - generic [ref=f1e9]: Scène du bal
        - generic [ref=f1e10]:
          - generic [ref=f1e11]: ébauche
          - generic [ref=f1e12]: ☀️
          - generic [ref=f1e13]: Matin
      - generic [ref=f1e16]:
        - generic [ref=f1e17]: Arrivée à Paris
        - generic [ref=f1e18]:
          - generic [ref=f1e19]: développement
          - generic [ref=f1e20]: 🌨️
          - generic [ref=f1e21]: Nuit
      - generic [ref=f1e24]:
        - generic [ref=f1e25]: La trahison
        - generic [ref=f1e26]:
          - generic [ref=f1e27]: ébauche
          - generic [ref=f1e28]: ☀️
          - generic [ref=f1e29]: Jour
    - generic:
      - generic: DISP MODE NESTING
    - contentinfo "Raccourcis clavier" [ref=f1e30]
    - generic: AIDE ⇧⌘ ?
    - generic [ref=f1e31]:
      - textbox "Filtrer…" [active] [ref=f1e32]
      - list [ref=f1e33]:
        - listitem [ref=f1e34]: Aube
        - listitem [ref=f1e35]: Matin
        - listitem [ref=f1e36]: Midi
        - listitem [ref=f1e37]: Jour
        - listitem [ref=f1e38]: Soir
        - listitem [ref=f1e39]: Crépuscule
        - listitem [ref=f1e40]: Nuit
```

# Test source

```ts
  46  |   await press(page, 'Tab')
  47  |   await expect(pane1(page).locator('.event-item.editing [data-field="state"]')).toBeFocused()
  48  | })
  49  | 
  50  | test("édition : TAB depuis état focus trigger météo", async ({ page }) => {
  51  |   await goToListerEvent(page)
  52  |   await enterEditionOnFirst(page)
  53  |   await press(page, 'Tab') // → state
  54  |   await press(page, 'Tab') // → meteo
  55  |   await expect(pane1(page).locator('.event-item.editing [data-field="meteo"]')).toBeFocused()
  56  | })
  57  | 
  58  | test("édition : TAB depuis météo focus trigger effet", async ({ page }) => {
  59  |   await goToListerEvent(page)
  60  |   await enterEditionOnFirst(page)
  61  |   await press(page, 'Tab') // → state
  62  |   await press(page, 'Tab') // → meteo
  63  |   await press(page, 'Tab') // → effet
  64  |   await expect(pane1(page).locator('.event-item.editing [data-field="effet"]')).toBeFocused()
  65  | })
  66  | 
  67  | test("édition : TAB depuis effet focus trigger lieu", async ({ page }) => {
  68  |   await goToListerEvent(page)
  69  |   await enterEditionOnFirst(page)
  70  |   await press(page, 'Tab') // → state
  71  |   await press(page, 'Tab') // → meteo
  72  |   await press(page, 'Tab') // → effet
  73  |   await press(page, 'Tab') // → lieu
  74  |   await expect(pane1(page).locator('.event-item.editing [data-field="lieu"]')).toBeFocused()
  75  | })
  76  | 
  77  | test("édition : TAB depuis lieu revient au titre", async ({ page }) => {
  78  |   await goToListerEvent(page)
  79  |   await enterEditionOnFirst(page)
  80  |   for (let i = 0; i < 5; i++) await press(page, 'Tab') // titre→state→meteo→effet→lieu→titre
  81  |   await expect(pane1(page).locator('.event-item.editing [data-field="title"]')).toBeFocused()
  82  | })
  83  | 
  84  | // ─── Ouverture popup ─────────────────────────────────────────────────────────
  85  | 
  86  | test("édition : ArrowDown sur trigger météo ouvre popup", async ({ page }) => {
  87  |   await goToListerEvent(page)
  88  |   await enterEditionOnFirst(page)
  89  |   await press(page, 'Tab') // → state
  90  |   await press(page, 'Tab') // → meteo
  91  |   await press(page, 'ArrowDown')
  92  |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  93  | })
  94  | 
  95  | test("édition : ArrowDown sur trigger effet ouvre popup", async ({ page }) => {
  96  |   await goToListerEvent(page)
  97  |   await enterEditionOnFirst(page)
  98  |   await press(page, 'Tab') // → state
  99  |   await press(page, 'Tab') // → meteo
  100 |   await press(page, 'Tab') // → effet
  101 |   await press(page, 'ArrowDown')
  102 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  103 | })
  104 | 
  105 | test("édition : ArrowDown sur trigger lieu ouvre popup", async ({ page }) => {
  106 |   await goToListerEvent(page)
  107 |   await enterEditionOnFirst(page)
  108 |   await press(page, 'Tab') // → state
  109 |   await press(page, 'Tab') // → meteo
  110 |   await press(page, 'Tab') // → effet
  111 |   await press(page, 'Tab') // → lieu
  112 |   await press(page, 'ArrowDown')
  113 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  114 | })
  115 | 
  116 | // ─── Persistance ─────────────────────────────────────────────────────────────
  117 | 
  118 | test("météo : sélection 'pl' persiste après sauvegarde", async ({ page }) => {
  119 |   await goToListerEvent(page)
  120 |   await enterEditionOnFirst(page)
  121 |   await press(page, 'Tab') // → state
  122 |   await press(page, 'Tab') // → meteo
  123 |   await press(page, 'ArrowDown') // ouvre popup
  124 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  125 |   await pane1(page).locator('.popup-select__option[data-value="pl"]').click()
  126 |   await press(page, 'Enter') // confirme edition
  127 |   await expect(pane1(page).locator('.event-item').first().locator('.event-meteo')).toHaveText('🌨️')
  128 |   // Reload et vérifier persistance
  129 |   await page.waitForLoadState('networkidle')
  130 |   await page.reload()
  131 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  132 |   await press(page, 'ArrowRight')
  133 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  134 |   await expect(pane1(page).locator('.event-item').first().locator('.event-meteo')).toHaveText('🌨️')
  135 | })
  136 | 
  137 | test("lieu : sélection 'ext' persiste après sauvegarde", async ({ page }) => {
  138 |   await goToListerEvent(page)
  139 |   await enterEditionOnFirst(page)
  140 |   await press(page, 'Tab') // → state
  141 |   await press(page, 'Tab') // → meteo
  142 |   await press(page, 'Tab') // → effet
  143 |   await press(page, 'Tab') // → lieu
  144 |   await press(page, 'ArrowDown') // ouvre popup
  145 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
> 146 |   await pane1(page).locator('.popup-select__option[data-value="ext"]').click()
      |                                                                        ^ Error: locator.click: Test timeout of 15000ms exceeded.
  147 |   await press(page, 'Enter') // confirme edition
  148 |   await expect(pane1(page).locator('.event-item').first().locator('.event-lieu')).toHaveText('Extérieur')
  149 |   // Reload et vérifier persistance
  150 |   await page.waitForLoadState('networkidle')
  151 |   await page.reload()
  152 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  153 |   await press(page, 'ArrowRight')
  154 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  155 |   await expect(pane1(page).locator('.event-item').first().locator('.event-lieu')).toHaveText('Extérieur')
  156 | })
  157 | 
  158 | // ─── Incompatibilités ────────────────────────────────────────────────────────
  159 | 
  160 | // e1 a meteo='ps' → effets incompatibles : au, cr, nu
  161 | test("incompatibilité : meteo=ps → effet popup grise au/cr/nu", async ({ page }) => {
  162 |   await goToListerEvent(page)
  163 |   await enterEditionOnFirst(page) // e1 : meteo='ps'
  164 |   await press(page, 'Tab') // → state
  165 |   await press(page, 'Tab') // → meteo
  166 |   await press(page, 'Tab') // → effet
  167 |   await press(page, 'ArrowDown') // ouvre popup effet
  168 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  169 |   await expect(pane1(page).locator('.popup-select__option[data-value="au"]')).toHaveClass(/disabled/)
  170 |   await expect(pane1(page).locator('.popup-select__option[data-value="cr"]')).toHaveClass(/disabled/)
  171 |   await expect(pane1(page).locator('.popup-select__option[data-value="nu"]')).toHaveClass(/disabled/)
  172 |   await expect(pane1(page).locator('.popup-select__option[data-value="ma"]')).not.toHaveClass(/disabled/)
  173 |   await press(page, 'Escape')
  174 | })
  175 | 
  176 | // e2 a effet='nu' → météos incompatibles : ps, vo, di
  177 | test("incompatibilité : effet=nu → météo popup grise ps/vo/di", async ({ page }) => {
  178 |   await goToListerEvent(page)
  179 |   // sélectionner e2
  180 |   await press(page, 'ArrowDown')
  181 |   await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)
  182 |   await press(page, 'Enter') // ouvre édition sur e2
  183 |   await expect(pane1(page).locator('.event-item.editing')).toBeVisible()
  184 |   await expect(pane1(page).locator('.event-item.editing [data-field="title"]')).toBeFocused()
  185 |   await press(page, 'Tab') // → state
  186 |   await press(page, 'Tab') // → meteo
  187 |   await press(page, 'ArrowDown') // ouvre popup meteo
  188 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  189 |   await expect(pane1(page).locator('.popup-select__option[data-value="ps"]')).toHaveClass(/disabled/)
  190 |   await expect(pane1(page).locator('.popup-select__option[data-value="vo"]')).toHaveClass(/disabled/)
  191 |   await expect(pane1(page).locator('.popup-select__option[data-value="di"]')).toHaveClass(/disabled/)
  192 |   await expect(pane1(page).locator('.popup-select__option[data-value="pl"]')).not.toHaveClass(/disabled/)
  193 |   await press(page, 'Escape')
  194 | })
  195 | 
  196 | test("incompatibilité : option grisée non sélectionnable (Space ignoré)", async ({ page }) => {
  197 |   await goToListerEvent(page)
  198 |   await enterEditionOnFirst(page) // e1 : meteo='ps', effet='ma'
  199 |   await press(page, 'Tab') // → state
  200 |   await press(page, 'Tab') // → meteo
  201 |   await press(page, 'Tab') // → effet
  202 |   await press(page, 'ArrowDown') // ouvre popup effet
  203 |   // Navigate to 'nu' (nuit) which is disabled
  204 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  205 |   // trouver index de 'nu' dans la liste et naviguer
  206 |   const nuOption = pane1(page).locator('.popup-select__option[data-value="nu"]')
  207 |   await expect(nuOption).toHaveClass(/disabled/)
  208 |   await nuOption.click() // clic sur option désactivée
  209 |   // le popup doit rester ouvert
  210 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  211 |   await press(page, 'Escape')
  212 |   // l'effet n'a pas changé
  213 |   await press(page, 'Escape') // annule édition
  214 |   await expect(pane1(page).locator('.event-item').first().locator('.event-effet')).toHaveText('Matin')
  215 | })
  216 | 
```