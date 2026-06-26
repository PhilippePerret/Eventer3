# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app/contextual-help.spec.js >> Cmd+? ouvre le panneau d'aide contextuelle
- Location: specs/e2e/app/contextual-help.spec.js:16:1

# Error details

```
Error: locator.press: Test ended.
Call log:
  - waiting for locator('#pane-1').contentFrame().locator('.event-item.selected')

```

# Test source

```ts
  1   | import { test, expect, pane1 } from '../__setup__.js'
  2   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  3   | 
  4   | test.beforeEach(() => {
  5   |   installFixtures('many-events')
  6   | })
  7   | 
  8   | // Sur Mac AZERTY, Cmd+? = Meta+Shift+,
  9   | // Sur QWERTY,       Cmd+? = Meta+Shift+/
  10  | // Dans les deux cas event.key === '?' avec metaKey=true
  11  | // Playwright accepte Meta+? directement
  12  | const OPEN_KEY = 'Meta+?'
  13  | 
  14  | // ── Ouverture / fermeture ──────────────────────────────────────────
  15  | 
  16  | test('Cmd+? ouvre le panneau d\'aide contextuelle', async ({ page }) => {
  17  |   await page.goto('/')
> 18  |   await pane1(page).locator('.event-item.selected').press(OPEN_KEY)
      |                                                     ^ Error: locator.press: Test ended.
  19  |   await expect(pane1(page).locator('.contextual-help')).toBeVisible()
  20  | })
  21  | 
  22  | test('Escape ferme le panneau d\'aide contextuelle', async ({ page }) => {
  23  |   await page.goto('/')
  24  |   await pane1(page).locator('.event-item.selected').press(OPEN_KEY)
  25  |   await expect(pane1(page).locator('.contextual-help')).toBeVisible()
  26  |   await pane1(page).locator('.event-item.selected').press('Escape')
  27  |   await expect(pane1(page).locator('.contextual-help')).not.toBeVisible()
  28  | })
  29  | 
  30  | test('⌘+Enter ferme le panneau d\'aide contextuelle', async ({ page }) => {
  31  |   await page.goto('/')
  32  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  33  |   await pane1(page).locator('.event-item.selected').press(OPEN_KEY)
  34  |   await expect(pane1(page).locator('.contextual-help')).toBeVisible()
  35  |   await pane1(page).locator('.event-item.selected').press('Meta+Enter')
  36  |   await expect(pane1(page).locator('.contextual-help')).not.toBeVisible()
  37  | })
  38  | 
  39  | test('le panneau fonctionne depuis n\'importe quel contexte (édition en cours)', async ({ page }) => {
  40  |   await page.goto('/')
  41  |   await expect(pane1(page).locator('.project-item').first()).toBeVisible()
  42  |   await pane1(page).locator('.event-item.selected').press('Enter') // démarre l'édition du premier projet
  43  |   await expect(pane1(page).locator('.project-item input[name="title"]')).toBeFocused()
  44  |   // Cmd+? doit quand même ouvrir le panneau
  45  |   await pane1(page).locator('.event-item.selected').press(OPEN_KEY)
  46  |   await expect(pane1(page).locator('.contextual-help')).toBeVisible()
  47  |   // Escape ferme l'aide, l'édition est toujours active
  48  |   await pane1(page).locator('.event-item.selected').press('Escape')
  49  |   await expect(pane1(page).locator('.contextual-help')).not.toBeVisible()
  50  | })
  51  | 
  52  | // ── Contenu ────────────────────────────────────────────────────────
  53  | 
  54  | test('le panneau affiche le titre du contexte courant (liste de projets)', async ({ page }) => {
  55  |   await page.goto('/')
  56  |   await expect(pane1(page).locator('.project-item').first()).toBeVisible()
  57  |   await pane1(page).locator('.event-item.selected').press(OPEN_KEY)
  58  |   await expect(pane1(page).locator('.contextual-help__title')).toContainText('Liste des projets')
  59  | })
  60  | 
  61  | test('le panneau liste les raccourcis du contexte courant', async ({ page }) => {
  62  |   await page.goto('/')
  63  |   await expect(pane1(page).locator('.project-item').first()).toBeVisible()
  64  |   await pane1(page).locator('.event-item.selected').press(OPEN_KEY)
  65  |   // 'n' doit apparaître dans les raccourcis de project-list
  66  |   const rows = pane1(page).locator('.contextual-help__row')
  67  |   await expect(rows).not.toHaveCount(0)
  68  |   const keys = await pane1(page).locator('.contextual-help__key').allTextContents()
  69  |   expect(keys.some(k => k.includes('n'))).toBeTruthy()
  70  | })
  71  | 
  72  | test('les raccourcis other_contexts apparaissent avant les raccourcis propres', async ({ page }) => {
  73  |   await page.goto('/')
  74  |   await expect(pane1(page).locator('.project-item').first()).toBeVisible()
  75  |   await pane1(page).locator('.event-item.selected').press(OPEN_KEY)
  76  |   // 'navigate-items' est other_context de 'project-list' → ↑↓ doivent apparaître
  77  |   const keys = await pane1(page).locator('.contextual-help__key').allTextContents()
  78  |   const arrowIdx = keys.findIndex(k => k.includes('↑') || k.includes('↓'))
  79  |   const nIdx     = keys.findIndex(k => k === 'n')
  80  |   expect(arrowIdx).toBeGreaterThanOrEqual(0)
  81  |   expect(nIdx).toBeGreaterThan(arrowIdx)
  82  | })
  83  | 
  84  | // ── Navigation dans le panneau ─────────────────────────────────────
  85  | 
  86  | test('flèche bas sélectionne le raccourci suivant', async ({ page }) => {
  87  |   await page.goto('/')
  88  |   await expect(pane1(page).locator('.project-item').first()).toBeVisible()
  89  |   await pane1(page).locator('.event-item.selected').press(OPEN_KEY)
  90  |   const first  = pane1(page).locator('.contextual-help__row.selected')
  91  |   const firstKey = await first.locator('.contextual-help__key').textContent()
  92  |   await pane1(page).locator('.event-item.selected').press('ArrowDown')
  93  |   const second = pane1(page).locator('.contextual-help__row.selected')
  94  |   const secondKey = await second.locator('.contextual-help__key').textContent()
  95  |   expect(secondKey).not.toBe(firstKey)
  96  | })
  97  | 
  98  | test('Enter sur un raccourci l\'exécute (↓ → item suivant sélectionné)', async ({ page }) => {
  99  |   await page.goto('/')
  100 |   // Le premier projet est sélectionné par défaut (index 0)
  101 |   const firstProject = pane1(page).locator('.project-item').nth(0)
  102 |   await expect(firstProject).toHaveClass(/selected/)
  103 | 
  104 |   await pane1(page).locator('.event-item.selected').press(OPEN_KEY)
  105 |   // Naviguer jusqu'au raccourci '↓'
  106 |   const rows = pane1(page).locator('.contextual-help__row')
  107 |   const count = await rows.count()
  108 |   let found = false
  109 |   for (let i = 0; i < count; i++) {
  110 |     const keyText = await rows.nth(i).locator('.contextual-help__key').textContent()
  111 |     if (keyText?.includes('↓') && !keyText?.includes('⌘')) {
  112 |       // Amener la sélection sur cet item
  113 |       const selectedIdx = await pane1(page).locator('.contextual-help__row.selected').evaluateAll(
  114 |         (els, rows) => rows.indexOf(els[0]),
  115 |         await rows.all()
  116 |       ).catch(() => 0)
  117 |       // Naviguer jusqu'à i depuis 0
  118 |       for (let j = 0; j < i; j++) await pane1(page).locator('.event-item.selected').press('ArrowDown')
```