# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/contextual-help.spec.js >> ⌘+v apparaît dans l'aide si clipboard compatible (après ⌘+c)
- Location: specs/e2e/_tdd/contextual-help.spec.js:142:6

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
- iframe [active] [ref=e3]:
  - generic [ref=f1e1]:
    - generic [ref=f1e5]:
      - generic [ref=f1e7]:
        - generic [ref=f1e8]: Projet A
        - generic [ref=f1e9]:
          - generic [ref=f1e10]: "---"
          - generic [ref=f1e11]: roman
      - generic [ref=f1e13]:
        - generic [ref=f1e14]: Projet B
        - generic [ref=f1e15]:
          - generic [ref=f1e16]: "---"
          - generic [ref=f1e17]: roman
    - contentinfo "Raccourcis clavier" [ref=f1e18]
    - generic: AIDE ⇧⌘ ?
    - generic [active] [ref=f1e19]:
      - generic [ref=f1e20]: Liste des projets
      - generic [ref=f1e21]:
        - generic [ref=f1e22]:
          - generic [ref=f1e23]: ↑
          - generic [ref=f1e24]: Projet précédent
        - generic [ref=f1e25]:
          - generic [ref=f1e26]: ↓
          - generic [ref=f1e27]: Projet suivant
        - generic [ref=f1e28]:
          - generic [ref=f1e29]: ⌘ + ↑
          - generic [ref=f1e30]: Monter le projet
        - generic [ref=f1e31]:
          - generic [ref=f1e32]: ⌘ + ↓
          - generic [ref=f1e33]: Descendre le projet
        - generic [ref=f1e34]:
          - generic [ref=f1e35]: →
          - generic [ref=f1e36]: Entrer dans le projet
        - generic [ref=f1e37]:
          - generic [ref=f1e38]: Projet sélectionné
          - generic [ref=f1e39]:
            - generic [ref=f1e40]: "n"
            - generic [ref=f1e41]: Nouveau projet
          - generic [ref=f1e42]:
            - generic [ref=f1e43]: ⌥ + n
            - generic [ref=f1e44]: Nouveau projet avant
          - generic [ref=f1e45]:
            - generic [ref=f1e46]: ↩︎
            - generic [ref=f1e47]: L’éditer
          - generic [ref=f1e48]:
            - generic [ref=f1e49]: ⌦
            - generic [ref=f1e50]: Le Supprimer
          - generic [ref=f1e51]:
            - generic [ref=f1e52]: ⌘ + c
            - generic [ref=f1e53]: Le Copier
          - generic [ref=f1e54]:
            - generic [ref=f1e55]: ⌘ + x
            - generic [ref=f1e56]: Le Couper
      - generic [ref=f1e57]:
        - generic [ref=f1e58]: ⇥ Fermer
        - generic [ref=f1e59]: ⇥ ↩︎ Jouer
```

# Test source

```ts
  48  |   await pane1(page).locator('.project-item.editing').press(OPEN_KEY)
  49  |   await expect(pane1(page).locator('.contextual-help')).toBeVisible()
  50  |   await pane1(page).locator('.contextual-help').press('Meta+Enter')
  51  |   await expect(pane1(page).locator('.contextual-help')).not.toBeVisible()
  52  |   await expect(pane1(page).locator('.project-item.editing')).toBeVisible()
  53  | })
  54  | 
  55  | // ── Contenu ────────────────────────────────────────────────────────
  56  | 
  57  | test('le panneau affiche le titre du contexte courant (liste de projets)', async ({ page }) => {
  58  |   await page.goto('/')
  59  |   await expect(pane1(page).locator('.project-item').first()).toBeVisible()
  60  |   await pane1(page).locator('.project-item.selected').press(OPEN_KEY)
  61  |   await expect(pane1(page).locator('.ftpanel__title')).toContainText('Liste des projets')
  62  | })
  63  | 
  64  | test('le panneau liste les raccourcis du contexte courant', async ({ page }) => {
  65  |   await page.goto('/')
  66  |   await expect(pane1(page).locator('.project-item').first()).toBeVisible()
  67  |   await pane1(page).locator('.project-item.selected').press(OPEN_KEY)
  68  |   const rows = pane1(page).locator('.contextual-help__row')
  69  |   await expect(rows).not.toHaveCount(0)
  70  |   const keys = await pane1(page).locator('.contextual-help__key').allTextContents()
  71  |   expect(keys.some(k => k.includes('n'))).toBeTruthy()
  72  | })
  73  | 
  74  | test('les raccourcis other_contexts apparaissent avant les raccourcis propres', async ({ page }) => {
  75  |   await page.goto('/')
  76  |   await expect(pane1(page).locator('.project-item').first()).toBeVisible()
  77  |   await pane1(page).locator('.project-item.selected').press(OPEN_KEY)
  78  |   const keys = await pane1(page).locator('.contextual-help__key').allTextContents()
  79  |   const arrowIdx = keys.findIndex(k => k.includes('↑') || k.includes('↓'))
  80  |   const nIdx     = keys.findIndex(k => k === 'n')
  81  |   expect(arrowIdx).toBeGreaterThanOrEqual(0)
  82  |   expect(nIdx).toBeGreaterThan(arrowIdx)
  83  | })
  84  | 
  85  | // ── Navigation dans le panneau ─────────────────────────────────────
  86  | 
  87  | test('flèche bas sélectionne le raccourci suivant', async ({ page }) => {
  88  |   await page.goto('/')
  89  |   await expect(pane1(page).locator('.project-item').first()).toBeVisible()
  90  |   await pane1(page).locator('.project-item.selected').press(OPEN_KEY)
  91  |   const first    = pane1(page).locator('.contextual-help__row.selected')
  92  |   const firstKey = await first.locator('.contextual-help__key').textContent()
  93  |   await pane1(page).locator('.contextual-help').press('ArrowDown')
  94  |   const second    = pane1(page).locator('.contextual-help__row.selected')
  95  |   const secondKey = await second.locator('.contextual-help__key').textContent()
  96  |   expect(secondKey).not.toBe(firstKey)
  97  | })
  98  | 
  99  | test('Enter sur un raccourci l\'exécute (↓ → item suivant sélectionné)', async ({ page }) => {
  100 |   await page.goto('/')
  101 |   const firstProject = pane1(page).locator('.project-item').nth(0)
  102 |   await expect(firstProject).toHaveClass(/selected/)
  103 | 
  104 |   await pane1(page).locator('.project-item.selected').press(OPEN_KEY)
  105 |   const rows = pane1(page).locator('.contextual-help__row')
  106 |   const count = await rows.count()
  107 |   for (let i = 0; i < count; i++) {
  108 |     const keyText = await rows.nth(i).locator('.contextual-help__key').textContent()
  109 |     if (keyText?.includes('↓') && !keyText?.includes('⌘')) {
  110 |       for (let j = 0; j < i; j++) await pane1(page).locator('.contextual-help').press('ArrowDown')
  111 |       break
  112 |     }
  113 |   }
  114 | 
  115 |   await pane1(page).locator('.contextual-help').press('Enter')
  116 |   await expect(pane1(page).locator('.contextual-help')).not.toBeVisible()
  117 | 
  118 |   const secondProject = pane1(page).locator('.project-item').nth(1)
  119 |   await expect(secondProject).toHaveClass(/selected/)
  120 | })
  121 | 
  122 | // ── Footer vide ────────────────────────────────────────────────────
  123 | 
  124 | test('le footer d\'aide (ancien shortcuts-footer) est vide', async ({ page }) => {
  125 |   await page.goto('/')
  126 |   const footer = pane1(page).locator('#shortcuts-footer')
  127 |   await expect(footer).toHaveText('')
  128 | })
  129 | 
  130 | // ── except ────────────────────────────────────────────────────────
  131 | 
  132 | test('project-list : ␣ absent (except depuis with-selected)', async ({ page }) => {
  133 |   await page.goto('/')
  134 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  135 |   await pane1(page).locator('.project-item.selected').press(OPEN_KEY)
  136 |   const keys = await pane1(page).locator('.contextual-help__key').allTextContents()
  137 |   expect(keys.some(k => k === '␣')).toBeFalsy()
  138 | })
  139 | 
  140 | // ── Clipboard paste ───────────────────────────────────────────────
  141 | 
  142 | test.only('⌘+v apparaît dans l\'aide si clipboard compatible (après ⌘+c)', async ({ page }) => {
  143 |   await page.goto('/')
  144 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  145 |   await pane1(page).locator('.project-item.selected').press('Meta+c')
  146 |   await pane1(page).locator('.project-item.selected').press(OPEN_KEY)
  147 |   const keys = await pane1(page).locator('.contextual-help__key').allTextContents()
> 148 |   expect(keys.some(k => k.includes('v'))).toBeTruthy()
      |                                           ^ Error: expect(received).toBeTruthy()
  149 | })
  150 | 
  151 | test('⌘+v absent de l\'aide si clipboard vide', async ({ page }) => {
  152 |   await page.goto('/')
  153 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  154 |   await pane1(page).locator('.project-item.selected').press(OPEN_KEY)
  155 |   const keys = await pane1(page).locator('.contextual-help__key').allTextContents()
  156 |   expect(keys.some(k => k === '⌘ + v')).toBeFalsy()
  157 | })
  158 | 
  159 | test('⌘+v absent si clipboard incompatible (brin copié, panneau persos)', async ({ page }) => {
  160 |   installFixtures('with-brins-and-persos')
  161 |   await page.goto('/')
  162 |   await expect(pane1(page).locator('.project-item').first()).toBeVisible()
  163 |   await pane1(page).locator('.project-item.selected').press('ArrowRight')
  164 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  165 |   await pane1(page).locator('.event-item.selected').press('b')
  166 |   await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  167 |   await pane1(page).locator('.brin-item.selected').press('Meta+c')
  168 |   await pane1(page).locator('.brin-item.selected').press('p')
  169 |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  170 |   await pane1(page).locator('.perso-item.selected').press(OPEN_KEY)
  171 |   const keys = await pane1(page).locator('.contextual-help__key').allTextContents()
  172 |   expect(keys.some(k => k === '⌘ + v')).toBeFalsy()
  173 | })
  174 | 
  175 | // ── Templates wf ───────────────────────────────────────────────────
  176 | 
  177 | test('project-list : "{wf.Thing} précédent" résolu en "Projet précédent"', async ({ page }) => {
  178 |   await page.goto('/')
  179 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  180 |   await pane1(page).locator('.project-item.selected').press(OPEN_KEY)
  181 |   const effects = await pane1(page).locator('.contextual-help__effect').allTextContents()
  182 |   expect(effects.some(e => e === 'Projet précédent')).toBeTruthy()
  183 | })
  184 | 
  185 | test('project-list : "{wf.Thing} suivant" résolu en "Projet suivant"', async ({ page }) => {
  186 |   await page.goto('/')
  187 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  188 |   await pane1(page).locator('.project-item.selected').press(OPEN_KEY)
  189 |   const effects = await pane1(page).locator('.contextual-help__effect').allTextContents()
  190 |   expect(effects.some(e => e === 'Projet suivant')).toBeTruthy()
  191 | })
  192 | 
  193 | test('project-list : with-selected résolu avec "projet" (wf.mot fallback)', async ({ page }) => {
  194 |   await page.goto('/')
  195 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  196 |   await pane1(page).locator('.project-item.selected').press(OPEN_KEY)
  197 |   const effects = await pane1(page).locator('.contextual-help__effect').allTextContents()
  198 |   expect(effects.some(e => e.includes('projet'))).toBeTruthy()
  199 | })
  200 | 
  201 | test('event-list : "{wf.Thing} précédent" résolu en "Évènement précédent"', async ({ page }) => {
  202 |   await page.goto('/')
  203 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  204 |   await pane1(page).locator('.project-item.selected').press('ArrowRight')
  205 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  206 |   await pane1(page).locator('.event-item.selected').press(OPEN_KEY)
  207 |   const effects = await pane1(page).locator('.contextual-help__effect').allTextContents()
  208 |   expect(effects.some(e => e === 'Évènement précédent')).toBeTruthy()
  209 | })
  210 | 
  211 | test('aucun placeholder {wf.*} ne reste dans le rendu', async ({ page }) => {
  212 |   await page.goto('/')
  213 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  214 |   await pane1(page).locator('.project-item.selected').press(OPEN_KEY)
  215 |   const fullText = await pane1(page).locator('.contextual-help').textContent()
  216 |   expect(fullText).not.toMatch(/\{wf\.\w+\}/)
  217 | })
  218 | 
```