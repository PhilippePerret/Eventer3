# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/project-navigation.spec.js >> Régression : project_id propagé >> créer un event imbriqué → persiste après rechargement
- Location: specs/e2e/_tdd/project-navigation.spec.js:212:3

# Error details

```
Error: expect(locator).toBeFocused() failed

Locator: locator('#pane-1').contentFrame().locator('.event-item input[name="title"]')
Expected: focused
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeFocused" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.event-item input[name="title"]')

```

```yaml
- text: Évènement un DISP MODE NESTING
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  120 |     await page.reload()
  121 |     await expect(pane1(page).locator('.project-item')).toHaveCount(countAfterFirst + 1)
  122 |   })
  123 | 
  124 |   test("entrer dans un projet cache le panneau des projets", async ({ page }) => {
  125 |     installFixtures('with-brins-and-persos')
  126 |     await page.goto('/')
  127 |     await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  128 |     await press(page, 'ArrowRight')
  129 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  130 |     await expect(pane1(page).locator('#projects-panel')).not.toBeVisible()
  131 |   })
  132 | 
  133 |   test("→ ouvre directement le PREMIER projet à l'ouverture de l'app", async ({ page }) => {
  134 |     installFixtures('with-brins-and-persos')
  135 |     await page.goto('/')
  136 |     await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  137 |     await press(page, 'ArrowRight')
  138 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  139 |     await expect(pane1(page).locator('.event-item')).toHaveCount(2)
  140 |   })
  141 | 
  142 |   test("→ ← ↓ → : navigation entre projets et leurs évènemenciers", async ({ page }) => {
  143 |     installFixtures('two-projects-events')
  144 |     await page.goto('/')
  145 |     await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  146 | 
  147 |     await press(page, 'ArrowRight')
  148 |     await expect(pane1(page).locator('#projects-panel')).not.toBeVisible()
  149 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  150 |     await expect(pane1(page).locator('.event-item')).toHaveCount(3)
  151 | 
  152 |     await press(page, 'ArrowLeft')
  153 |     await expect(pane1(page).locator('#events-panel')).not.toBeVisible()
  154 |     await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  155 | 
  156 |     await press(page, 'ArrowDown')
  157 |     await expect(pane1(page).locator('.project-item').nth(1)).toHaveClass(/selected/)
  158 | 
  159 |     await press(page, 'ArrowRight')
  160 |     await expect(pane1(page).locator('#projects-panel')).not.toBeVisible()
  161 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  162 |     await expect(pane1(page).locator('.event-item')).toHaveCount(2)
  163 |   })
  164 | 
  165 | })
  166 | 
  167 | // ─── Projet seed (données initiales à la première ouverture) ──────────────────
  168 | 
  169 | test.describe('Projet seed', () => {
  170 | 
  171 |   const appRoot = path.resolve(process.cwd(), '..')
  172 |   const dataDir = path.join(appRoot, 'data')
  173 | 
  174 |   test.beforeEach(async ({ page }) => {
  175 |     await fs.rm(dataDir, { recursive: true, force: true })
  176 |     await page.goto('/')
  177 |     await expect(pane1(page).locator('.project-item')).toHaveCount(1)
  178 |   })
  179 | 
  180 |   test('projet seed → "Intrigue principale" dans le panneau brins', async ({ page }) => {
  181 |     await press(page, 'ArrowRight')
  182 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  183 |     await press(page, 'b')
  184 |     await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  185 |     await expect(pane1(page).locator('.brin-item').first()).toContainText('Intrigue principale')
  186 |   })
  187 | 
  188 |   test('projet seed → "Votre protagoniste" dans le panneau persos', async ({ page }) => {
  189 |     await press(page, 'ArrowRight')
  190 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  191 |     await press(page, 'p')
  192 |     await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  193 |     await expect(pane1(page).locator('.perso-item__title').first()).toContainText('Votre protagoniste')
  194 |   })
  195 | 
  196 | })
  197 | 
  198 | // ─── Régression : project_id propagé aux sous-listers ─────────────────────────
  199 | 
  200 | test.describe('Régression : project_id propagé', () => {
  201 | 
  202 |   test.beforeEach(() => installFixtures('many-events'))
  203 | 
  204 |   async function enterProject(page) {
  205 |     await page.goto('/')
  206 |     await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  207 |     await press(page, 'ArrowRight')
  208 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  209 |     await expect(pane1(page).locator('.event-item').first()).toBeVisible()
  210 |   }
  211 | 
  212 |   test('créer un event imbriqué → persiste après rechargement', async ({ page }) => {
  213 |     await enterProject(page)
  214 | 
  215 |     await press(page, 'ArrowRight')
  216 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  217 | 
  218 |     await press(page, 'n')
  219 |     const input = pane1(page).locator('.event-item input[name="title"]')
> 220 |     await expect(input).toBeFocused()
      |                         ^ Error: expect(locator).toBeFocused() failed
  221 |     await input.fill('Sous-event persistant')
  222 |     await press(page, 'Enter')
  223 |     await expect(pane1(page).locator('.event-item').first()).toContainText('Sous-event persistant')
  224 |     await page.waitForLoadState('networkidle')
  225 | 
  226 |     await page.reload()
  227 |     await enterProject(page)
  228 |     await press(page, 'ArrowRight')
  229 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  230 |     await expect(pane1(page).locator('.event-item').first()).toContainText('Sous-event persistant')
  231 |   })
  232 | 
  233 |   test('créer un brin → persiste après rechargement', async ({ page }) => {
  234 |     await enterProject(page)
  235 | 
  236 |     await press(page, 'b')
  237 |     await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  238 | 
  239 |     await press(page, 'n')
  240 |     const input = pane1(page).locator('.brin-item input[name="title"]')
  241 |     await expect(input).toBeFocused()
  242 |     await input.fill('Brin régression')
  243 |     await press(page, 'Enter')
  244 | 
  245 |     await expect(pane1(page).locator('.brin-item').filter({ hasText: 'Brin régression' })).toBeVisible()
  246 | 
  247 |     await press(page, 'Meta+Enter')
  248 |     await page.reload()
  249 |     await enterProject(page)
  250 |     await press(page, 'b')
  251 |     await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  252 |     await expect(pane1(page).locator('.brin-item').filter({ hasText: 'Brin régression' })).toBeVisible()
  253 |   })
  254 | 
  255 |   test('créer un perso → persiste après rechargement', async ({ page }) => {
  256 |     await enterProject(page)
  257 | 
  258 |     await press(page, 'p')
  259 |     await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  260 | 
  261 |     await press(page, 'n')
  262 |     const input = pane1(page).locator('.perso-item input[name="title"]')
  263 |     await expect(input).toBeFocused()
  264 |     await input.fill('Perso régression')
  265 |     await press(page, 'Enter')
  266 | 
  267 |     await expect(pane1(page).locator('.perso-item').filter({ hasText: 'Perso régression' })).toBeVisible()
  268 | 
  269 |     await press(page, 'Meta+Enter')
  270 |     await page.reload()
  271 |     await enterProject(page)
  272 |     await press(page, 'p')
  273 |     await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  274 |     await expect(pane1(page).locator('.perso-item').filter({ hasText: 'Perso régression' })).toBeVisible()
  275 |   })
  276 | 
  277 |   test('entrer ListerEvent depth-2 → aucun 500 sur brins/persos', async ({ page }) => {
  278 |     const errors = []
  279 |     page.on('response', r => { if (r.status() >= 500) errors.push(r.url()) })
  280 | 
  281 |     await enterProject(page)
  282 |     await page.waitForLoadState('networkidle')
  283 |     errors.length = 0
  284 | 
  285 |     await press(page, 'ArrowRight')
  286 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  287 |     await page.waitForLoadState('networkidle')
  288 | 
  289 |     expect(errors).toHaveLength(0)
  290 |   })
  291 | 
  292 | })
  293 | 
```