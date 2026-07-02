# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: keyboard/keyboard-copy-cut-paste.spec.js >> ⌘+v colle dans un autre ListerEvent (même type) >> ⌘+c dans project-a puis ⌘+v dans project-b colle l'item
- Location: specs/e2e/keyboard/keyboard-copy-cut-paste.spec.js:280:3

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('#pane-1').contentFrame().locator('.event-item')
Expected: 3
Received: 2
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.event-item')
    14 × locator resolved to 2 elements
       - unexpected value "2"

```

# Page snapshot

```yaml
- iframe [active] [ref=e3]:
  - generic [ref=f1e1]:
    - generic [ref=f1e5]:
      - generic [ref=f1e8]:
        - generic [ref=f1e9]: Évènement 4
        - generic [ref=f1e11]: —
      - generic [ref=f1e14]:
        - generic [ref=f1e15]: Évènement 5
        - generic [ref=f1e17]: —
    - generic:
      - generic: DISP MODE NESTING
    - contentinfo "Raccourcis clavier" [ref=f1e18]
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  195 |     const items = pane1(page).locator('.project-item')
  196 |     const countBefore = await items.count()
  197 |     const selectedTitle = await pane1(page).locator('.project-item.selected .project-title').textContent()
  198 |     await press(page, 'Meta+c')
  199 |     await press(page, 'Meta+v')
  200 |     await press(page, 'Enter')
  201 |     await expect(items).toHaveCount(countBefore + 1)
  202 |     await expect(items.nth(0).locator('.project-title')).toHaveText(selectedTitle.trim())
  203 |   })
  204 | 
  205 |   test('⌘+c + ⌘+v : l\'item collé est sélectionné', async ({ page }) => {
  206 |     await page.goto('/')
  207 |     await pane1(page).locator('#projects-panel').waitFor()
  208 |     await press(page, 'Meta+c')
  209 |     await press(page, 'Meta+v')
  210 |     await press(page, 'Enter')
  211 |     await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  212 |   })
  213 | 
  214 |   test('⌘+c + ⌘+v : l\'identifiant du projet collé est un UUID valide (pas vide)', async ({ page }) => {
  215 |     await page.goto('/')
  216 |     await pane1(page).locator('#projects-panel').waitFor()
  217 |     await press(page, 'Meta+c')
  218 |     await press(page, 'Meta+v')
  219 |     await press(page, 'Enter')
  220 |     await page.waitForLoadState('networkidle')
  221 |     const copiedId = await pane1(page).locator('.project-item').nth(0).getAttribute('data-id')
  222 |     expect(copiedId).toBeTruthy()
  223 |   })
  224 | 
  225 |   test('⌘+c + ⌘+v : l\'id collé est différent de l\'original', async ({ page }) => {
  226 |     await page.goto('/')
  227 |     await pane1(page).locator('#projects-panel').waitFor()
  228 |     const originalId = await pane1(page).locator('.project-item').nth(0).getAttribute('data-id')
  229 |     await press(page, 'Meta+c')
  230 |     await press(page, 'Meta+v')
  231 |     await press(page, 'Enter')
  232 |     await page.waitForLoadState('networkidle')
  233 |     const copiedId = await pane1(page).locator('.project-item').nth(0).getAttribute('data-id')
  234 |     expect(copiedId).not.toBe(originalId)
  235 |   })
  236 | 
  237 |   test('après ⌘+c + ⌘+v, le projet collé est persistant', async ({ page }) => {
  238 |     await page.goto('/')
  239 |     await pane1(page).locator('#projects-panel').waitFor()
  240 |     const items = pane1(page).locator('.project-item')
  241 |     const countBefore = await items.count()
  242 |     await press(page, 'Meta+c')
  243 |     await press(page, 'Meta+v')
  244 |     await press(page, 'Enter')
  245 |     await page.waitForLoadState('networkidle')
  246 |     await page.reload()
  247 |     await pane1(page).locator('#projects-panel').waitFor()
  248 |     await expect(items).toHaveCount(countBefore + 1)
  249 |   })
  250 | 
  251 | })
  252 | 
  253 | // ─── CUT + PASTE DANS PROJECTLISTER ─────────────────────────────────────────
  254 | 
  255 | test.describe('⌘+x + ⌘+v dans ListerProject', () => {
  256 | 
  257 |   test.beforeEach(() => installFixtures('many-projects'))
  258 | 
  259 |   test('⌘+x + ⌘+v coupe et colle un projet au-dessus de la sélection', async ({ page }) => {
  260 |     await page.goto('/')
  261 |     await pane1(page).locator('#projects-panel').waitFor()
  262 |     const items = pane1(page).locator('.project-item')
  263 |     const countBefore = await items.count()
  264 |     const cutTitle = await items.nth(0).textContent()
  265 |     await press(page, 'Meta+x')
  266 |     await expect(items).toHaveCount(countBefore - 1)
  267 |     await press(page, 'Meta+v')
  268 |     await expect(items).toHaveCount(countBefore)
  269 |     await expect(items.nth(0)).toContainText(cutTitle.trim())
  270 |   })
  271 | 
  272 | })
  273 | 
  274 | // ─── PASTE CROSS-PANEL MÊME TYPE ────────────────────────────────────────────
  275 | 
  276 | test.describe('⌘+v colle dans un autre ListerEvent (même type)', () => {
  277 | 
  278 |   test.beforeEach(() => installFixtures('two-projects-events'))
  279 | 
  280 |   test('⌘+c dans project-a puis ⌘+v dans project-b colle l\'item', async ({ page }) => {
  281 |     await page.goto('/')
  282 |     await pane1(page).locator('#projects-panel').waitFor()
  283 |     await press(page, 'ArrowRight')
  284 |     await pane1(page).locator('#events-panel').waitFor()
  285 |     const copiedTitle = await pane1(page).locator('.event-item.selected').textContent()
  286 |     await press(page, 'Meta+c')
  287 |     await press(page, 'ArrowLeft')
  288 |     await pane1(page).locator('#projects-panel').waitFor()
  289 |     await press(page, 'ArrowDown')
  290 |     await press(page, 'ArrowRight')
  291 |     await pane1(page).locator('#events-panel').waitFor()
  292 |     const items = pane1(page).locator('.event-item')
  293 |     const countBefore = await items.count()
  294 |     await press(page, 'Meta+v')
> 295 |     await expect(items).toHaveCount(countBefore + 1)
      |                         ^ Error: expect(locator).toHaveCount(expected) failed
  296 |     await expect(items.nth(0)).toContainText(copiedTitle.trim())
  297 |   })
  298 | 
  299 |   test('⌘+x dans project-a puis ⌘+v dans project-b déplace l\'item', async ({ page }) => {
  300 |     await page.goto('/')
  301 |     await pane1(page).locator('#projects-panel').waitFor()
  302 |     await press(page, 'ArrowRight')
  303 |     await pane1(page).locator('#events-panel').waitFor()
  304 |     const itemsA = pane1(page).locator('.event-item')
  305 |     const countABefore = await itemsA.count()
  306 |     const cutTitle = await pane1(page).locator('.event-item.selected').textContent()
  307 |     await press(page, 'Meta+x')
  308 |     await expect(itemsA).toHaveCount(countABefore - 1)
  309 |     await press(page, 'ArrowLeft')
  310 |     await pane1(page).locator('#projects-panel').waitFor()
  311 |     await press(page, 'ArrowDown')
  312 |     await press(page, 'ArrowRight')
  313 |     await pane1(page).locator('#events-panel').waitFor()
  314 |     const itemsB = pane1(page).locator('.event-item')
  315 |     const countBBefore = await itemsB.count()
  316 |     await press(page, 'Meta+v')
  317 |     await expect(itemsB).toHaveCount(countBBefore + 1)
  318 |     await expect(itemsB.nth(0)).toContainText(cutTitle.trim())
  319 |   })
  320 | 
  321 | })
  322 | 
  323 | // ─── PASTE CROSS-TYPE BLOQUÉ ─────────────────────────────────────────────────
  324 | 
  325 | test.describe('⌘+v bloqué entre types différents', () => {
  326 | 
  327 |   test.beforeEach(() => installFixtures('with-brins'))
  328 | 
  329 |   test('ne peut pas coller un event dans le panneau des brins', async ({ page }) => {
  330 |     await page.goto('/')
  331 |     await pane1(page).locator('#projects-panel').waitFor()
  332 |     await press(page, 'ArrowRight')
  333 |     await pane1(page).locator('#events-panel').waitFor()
  334 |     await press(page, 'Meta+c')
  335 |     await press(page, 'b')
  336 |     await pane1(page).locator('#brins-panel').waitFor()
  337 |     const brins = pane1(page).locator('.brin-item')
  338 |     const countBefore = await brins.count()
  339 |     await press(page, 'Meta+v')
  340 |     await expect(brins).toHaveCount(countBefore)
  341 |   })
  342 | 
  343 |   test('ne peut pas coller un event dans le panneau des projets', async ({ page }) => {
  344 |     await page.goto('/')
  345 |     await pane1(page).locator('#projects-panel').waitFor()
  346 |     await press(page, 'ArrowRight')
  347 |     await pane1(page).locator('#events-panel').waitFor()
  348 |     await press(page, 'Meta+c')
  349 |     await press(page, 'ArrowLeft')
  350 |     await pane1(page).locator('#projects-panel').waitFor()
  351 |     const projects = pane1(page).locator('.project-item')
  352 |     const countBefore = await projects.count()
  353 |     await press(page, 'Meta+v')
  354 |     await expect(projects).toHaveCount(countBefore)
  355 |   })
  356 | 
  357 | })
  358 | 
```