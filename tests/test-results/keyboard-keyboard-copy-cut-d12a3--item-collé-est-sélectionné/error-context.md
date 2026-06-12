# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: keyboard/keyboard-copy-cut-paste.spec.js >> ⌘+c + ⌘+v dans ProjectLister >> ⌘+c + ⌘+v : l'item collé est sélectionné
- Location: specs/e2e/keyboard/keyboard-copy-cut-paste.spec.js:217:3

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('.project-item').first()
Expected pattern: /selected/
Received string:  "item project-item"
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('.project-item').first()
    - locator resolved to <div class="item project-item">…</div>
    13 × unexpected value "item project-item"
       - locator resolved to <div class="item project-item" data-id="f803f9ab-9b0c-46d1-bb5f-fbbbe885f967">…</div>
    - unexpected value "item project-item"

```

```yaml
- text: f803f9ab-9b0c-46d1-bb5f-fbbbe885f967
```

# Test source

```ts
  122 |     await page.reload()
  123 |     await goToEventLister(page)
  124 |     await expect(items).toHaveCount(countBefore)
  125 |   })
  126 | 
  127 | })
  128 | 
  129 | // ─── CUT : INTERDICTION SUR DERNIER ITEM ────────────────────────────────────
  130 | // with-brins : project-a (2 events, 2 brins b1/b2)
  131 | // many-projects : Projet A (idx 0), Projet B (idx 1), Projet C (idx 2)
  132 | // TODO perso : ajouter quand Perso.js + fixture avec 2 persos existeront
  133 | 
  134 | test.describe('⌘+x interdit sur le dernier item', () => {
  135 | 
  136 |   test.beforeEach(() => installFixtures('with-brins'))
  137 | 
  138 |   test('⌘+x du dernier event affiche une notification et ne supprime pas', async ({ page }) => {
  139 |     await page.goto('/')
  140 |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  141 |     await page.keyboard.press('ArrowRight')
  142 |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  143 |     const items = page.locator('.event-item')
  144 |     // Couper jusqu'à 1 item restant
  145 |     await page.keyboard.press('Meta+x')
  146 |     await expect(items).toHaveCount(1)
  147 |     // Tenter de couper le dernier
  148 |     await page.keyboard.press('Meta+x')
  149 |     await expect(items).toHaveCount(1)
  150 |     await expect(page.locator('#notification')).toBeVisible()
  151 |     await expect(page.locator('#notification')).toContainText('évènement')
  152 |   })
  153 | 
  154 |   test('⌘+x du dernier brin affiche une notification mentionnant "brin"', async ({ page }) => {
  155 |     await page.goto('/')
  156 |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  157 |     await page.keyboard.press('ArrowRight')
  158 |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  159 |     await page.keyboard.press('b')
  160 |     await expect(page.locator('#brin-panel')).toBeVisible()
  161 |     const items = page.locator('.brin-item')
  162 |     // Couper jusqu'à 1 brin restant
  163 |     await page.keyboard.press('Meta+x')
  164 |     await expect(items).toHaveCount(1)
  165 |     // Tenter de couper le dernier
  166 |     await page.keyboard.press('Meta+x')
  167 |     await expect(items).toHaveCount(1)
  168 |     await expect(page.locator('#notification')).toBeVisible()
  169 |     await expect(page.locator('#notification')).toContainText('brin')
  170 |   })
  171 | 
  172 | })
  173 | 
  174 | test.describe('⌘+x interdit sur le dernier projet (ProjectLister)', () => {
  175 | 
  176 |   test.beforeEach(() => installFixtures('many-projects'))
  177 | 
  178 |   test('⌘+x du dernier projet affiche une notification et ne supprime pas', async ({ page }) => {
  179 |     await page.goto('/')
  180 |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  181 |     const items = page.locator('.project-item')
  182 |     const initialCount = await items.count()
  183 |     // Couper jusqu'à 1 projet restant
  184 |     for (let i = 0; i < initialCount - 1; i++) {
  185 |       await page.keyboard.press('Meta+x')
  186 |       await expect(items).toHaveCount(initialCount - i - 1)
  187 |     }
  188 |     await expect(items).toHaveCount(1)
  189 |     // Tenter de couper le dernier
  190 |     await page.keyboard.press('Meta+x')
  191 |     await expect(items).toHaveCount(1)
  192 |     await expect(page.locator('#notification')).toBeVisible()
  193 |     await expect(page.locator('#notification')).toContainText('projet')
  194 |   })
  195 | 
  196 | })
  197 | 
  198 | // ─── COPY + PASTE DANS PROJECTLISTER ────────────────────────────────────────
  199 | // many-projects : Projet A, Projet B, Projet C
  200 | 
  201 | test.describe('⌘+c + ⌘+v dans ProjectLister', () => {
  202 | 
  203 |   test.beforeEach(() => installFixtures('many-projects'))
  204 | 
  205 |   test('⌘+c + ⌘+v ajoute un projet au-dessus de la sélection', async ({ page }) => {
  206 |     await page.goto('/')
  207 |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  208 |     const items = page.locator('.project-item')
  209 |     const countBefore = await items.count()
  210 |     const selectedTitle = await page.locator('.project-item.selected .project-item__title').textContent()
  211 |     await page.keyboard.press('Meta+c')
  212 |     await page.keyboard.press('Meta+v')
  213 |     await expect(items).toHaveCount(countBefore + 1)
  214 |     await expect(items.nth(0).locator('.project-item__title')).toHaveText(selectedTitle.trim())
  215 |   })
  216 | 
  217 |   test('⌘+c + ⌘+v : l\'item collé est sélectionné', async ({ page }) => {
  218 |     await page.goto('/')
  219 |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  220 |     await page.keyboard.press('Meta+c')
  221 |     await page.keyboard.press('Meta+v')
> 222 |     await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)
      |                                                        ^ Error: expect(locator).toHaveClass(expected) failed
  223 |   })
  224 | 
  225 |   test('⌘+c + ⌘+v : l\'identifiant du projet collé est pX (pas null)', async ({ page }) => {
  226 |     await page.goto('/')
  227 |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  228 |     await page.keyboard.press('Meta+c')
  229 |     await page.keyboard.press('Meta+v')
  230 |     await page.waitForLoadState('networkidle')
  231 |     const idText = await page.locator('.project-item').nth(0).locator('.project-item__id').textContent()
  232 |     expect(idText.trim()).toMatch(/^p\d+$/)
  233 |   })
  234 | 
  235 |   test('⌘+c + ⌘+v : l\'id collé est différent de l\'original', async ({ page }) => {
  236 |     await page.goto('/')
  237 |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  238 |     const originalId = await page.locator('.project-item').nth(0).getAttribute('data-id')
  239 |     await page.keyboard.press('Meta+c')
  240 |     await page.keyboard.press('Meta+v')
  241 |     await page.waitForLoadState('networkidle')
  242 |     const copiedId = await page.locator('.project-item').nth(0).getAttribute('data-id')
  243 |     expect(copiedId).not.toBe(originalId)
  244 |   })
  245 | 
  246 |   test('après ⌘+c + ⌘+v, le projet collé est persistant', async ({ page }) => {
  247 |     await page.goto('/')
  248 |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  249 |     const items = page.locator('.project-item')
  250 |     const countBefore = await items.count()
  251 |     await page.keyboard.press('Meta+c')
  252 |     await page.keyboard.press('Meta+v')
  253 |     await page.waitForLoadState('networkidle')
  254 |     await page.reload()
  255 |     await expect(items).toHaveCount(countBefore + 1)
  256 |   })
  257 | 
  258 | })
  259 | 
  260 | // ─── CUT + PASTE DANS PROJECTLISTER ─────────────────────────────────────────
  261 | // many-projects : Projet A, Projet B, Projet C
  262 | 
  263 | test.describe('⌘+x + ⌘+v dans ProjectLister', () => {
  264 | 
  265 |   test.beforeEach(() => installFixtures('many-projects'))
  266 | 
  267 |   test('⌘+x + ⌘+v coupe et colle un projet au-dessus de la sélection', async ({ page }) => {
  268 |     await page.goto('/')
  269 |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  270 |     const items = page.locator('.project-item')
  271 |     const countBefore = await items.count()
  272 |     const cutTitle = await items.nth(0).textContent()
  273 |     await page.keyboard.press('Meta+x')
  274 |     await expect(items).toHaveCount(countBefore - 1)
  275 |     await page.keyboard.press('Meta+v')
  276 |     await expect(items).toHaveCount(countBefore)
  277 |     await expect(items.nth(0)).toContainText(cutTitle.trim())
  278 |   })
  279 | 
  280 | })
  281 | 
  282 | // ─── PASTE CROSS-PANEL MÊME TYPE ────────────────────────────────────────────
  283 | // two-projects-events : project-a (e1/e2/e3), project-b (e4/e5)
  284 | 
  285 | test.describe('⌘+v colle dans un autre EventLister (même type)', () => {
  286 | 
  287 |   test.beforeEach(() => installFixtures('two-projects-events'))
  288 | 
  289 |   test('⌘+c dans project-a puis ⌘+v dans project-b colle l\'item', async ({ page }) => {
  290 |     await page.goto('/')
  291 |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  292 | 
  293 |     // Entrer dans project-a → copier e1
  294 |     await page.keyboard.press('ArrowRight')
  295 |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  296 |     const copiedTitle = await page.locator('.event-item.selected').textContent()
  297 |     await page.keyboard.press('Meta+c')
  298 | 
  299 |     // Revenir à la liste des projets
  300 |     await page.keyboard.press('ArrowLeft')
  301 |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  302 | 
  303 |     // Naviguer sur project-b puis entrer dedans
  304 |     await page.keyboard.press('ArrowDown')
  305 |     await page.keyboard.press('ArrowRight')
  306 |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  307 | 
  308 |     const items = page.locator('.event-item')
  309 |     const countBefore = await items.count()
  310 | 
  311 |     // Coller
  312 |     await page.keyboard.press('Meta+v')
  313 |     await expect(items).toHaveCount(countBefore + 1)
  314 |     await expect(items.nth(0)).toContainText(copiedTitle.trim())
  315 |   })
  316 | 
  317 |   test('⌘+x dans project-a puis ⌘+v dans project-b déplace l\'item', async ({ page }) => {
  318 |     await page.goto('/')
  319 |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  320 | 
  321 |     // Entrer dans project-a → couper e1
  322 |     await page.keyboard.press('ArrowRight')
```