# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/contextual-help.spec.js >> le panneau affiche le titre du contexte courant (liste de projets)
- Location: specs/e2e/_tdd/contextual-help.spec.js:57:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.contextual-help__title')
Expected substring: "Liste des projets"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.contextual-help__title')

```

```yaml
- text: Projet A --- roman Projet B --- roman
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ? Liste des projets ↑ Projet précédent ↓ Projet suivant ⌘ + ↑ Monter le projet ⌘ + ↓ Descendre le projet → Entrer dans le projet Projet sélectionné n Nouveau projet ⌥ + n Nouveau projet avant ↩︎ L’éditer ⌦ Le Supprimer ⌘ + c Le Copier ⌘ + x Le Couper ⇥ Fermer ⇥ ↩︎ Jouer
```

# Test source

```ts
  1   | // Origine: tests/specs/e2e/app/contextual-help.spec.js
  2   | import { test, expect, pane1 } from '../__setup__.js'
  3   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  4   | 
  5   | test.beforeEach(() => {
  6   |   installFixtures('many-events')
  7   | })
  8   | 
  9   | // Sur Mac AZERTY, Cmd+? = Meta+Shift+,
  10  | // Sur QWERTY,       Cmd+? = Meta+Shift+/
  11  | // Dans les deux cas event.key === '?' avec metaKey=true
  12  | // Playwright accepte Meta+? directement
  13  | const OPEN_KEY = 'Meta+?'
  14  | 
  15  | // ── Ouverture / fermeture ──────────────────────────────────────────
  16  | 
  17  | test('Cmd+? ouvre le panneau d\'aide contextuelle', async ({ page }) => {
  18  |   await page.goto('/')
  19  |   await pane1(page).locator('.project-item.selected').press(OPEN_KEY)
  20  |   await expect(pane1(page).locator('.contextual-help')).toBeVisible()
  21  | })
  22  | 
  23  | test('⌘+Enter ferme le panneau d\'aide contextuelle', async ({ page }) => {
  24  |   await page.goto('/')
  25  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  26  |   await pane1(page).locator('.project-item.selected').press(OPEN_KEY)
  27  |   await expect(pane1(page).locator('.contextual-help')).toBeVisible()
  28  |   await pane1(page).locator('.contextual-help').press('Meta+Enter')
  29  |   await expect(pane1(page).locator('.contextual-help')).not.toBeVisible()
  30  | })
  31  | 
  32  | test('Tab+Tab+Enter ferme le panneau d\'aide contextuelle', async ({ page }) => {
  33  |   await page.goto('/')
  34  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  35  |   await pane1(page).locator('.project-item.selected').press(OPEN_KEY)
  36  |   await expect(pane1(page).locator('.contextual-help')).toBeVisible()
  37  |   await pane1(page).locator('.contextual-help').press('Tab')
  38  |   await pane1(page).locator('.contextual-help').press('Tab')
  39  |   await pane1(page).locator('.contextual-help').press('Enter')
  40  |   await expect(pane1(page).locator('.contextual-help')).not.toBeVisible()
  41  | })
  42  | 
  43  | test('le panneau fonctionne depuis n\'importe quel contexte (édition en cours)', async ({ page }) => {
  44  |   await page.goto('/')
  45  |   await expect(pane1(page).locator('.project-item').first()).toBeVisible()
  46  |   await pane1(page).locator('.project-item.selected').press('Enter')
  47  |   await expect(pane1(page).locator('.project-item.editing')).toBeVisible()
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
> 61  |   await expect(pane1(page).locator('.contextual-help__title')).toContainText('Liste des projets')
      |                                                                ^ Error: expect(locator).toContainText(expected) failed
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
  142 | test('⌘+v apparaît dans l\'aide si clipboard compatible (après ⌘+c)', async ({ page }) => {
  143 |   await page.goto('/')
  144 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  145 |   await pane1(page).locator('.project-item.selected').press('Meta+c')
  146 |   await pane1(page).locator('.project-item.selected').press(OPEN_KEY)
  147 |   const keys = await pane1(page).locator('.contextual-help__key').allTextContents()
  148 |   expect(keys.some(k => k.includes('v'))).toBeTruthy()
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
```