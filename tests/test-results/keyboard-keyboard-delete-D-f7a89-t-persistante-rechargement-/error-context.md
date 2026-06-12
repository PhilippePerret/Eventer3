# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: keyboard/keyboard-delete.spec.js >> Delete dans EventLister >> la suppression de l'event est persistante (rechargement)
- Location: specs/e2e/keyboard/keyboard-delete.spec.js:88:3

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.event-item')
Expected: 2
Received: 3
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('.event-item')
    14 × locator resolved to 3 elements
       - unexpected value "3"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - navigation [ref=e3]:
      - button [ref=e4] [cursor=pointer]
      - generic [ref=e5]: ‹
    - generic [ref=e8]:
      - generic [ref=e10]: Évènement un
      - generic [ref=e12]: —
    - generic [ref=e15]:
      - generic [ref=e17]: Évènement deux
      - generic [ref=e19]: —
    - generic [ref=e22]:
      - generic [ref=e24]: Évènement trois
      - generic [ref=e26]: —
  - generic:
    - generic: DISP MODE NESTING
  - contentinfo "Raccourcis clavier" [ref=e27]
  - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  2   | import { test, expect } from '../__setup__.js'
  3   | 
  4   | // ─── PROJETS ───────────────────────────────────────────────────────────────
  5   | // many-projects : Projet A (index 0), Projet B (index 1), Projet C (index 2)
  6   | 
  7   | test.describe('Delete dans ProjectLister', () => {
  8   | 
  9   |   test.beforeEach(() => installFixtures('many-projects'))
  10  | 
  11  |   test('Delete supprime le projet sélectionné', async ({ page }) => {
  12  |     await page.goto('/')
  13  |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  14  |     const items = page.locator('.project-item')
  15  |     const initialCount = await items.count()
  16  |     await page.keyboard.press('Delete')
  17  |     await expect(items).toHaveCount(initialCount - 1)
  18  |   })
  19  | 
  20  |   test('la suppression du projet est persistante (rechargement)', async ({ page }) => {
  21  |     await page.goto('/')
  22  |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  23  |     const items = page.locator('.project-item')
  24  |     const initialCount = await items.count()
  25  |     await page.keyboard.press('Delete')
  26  |     await expect(items).toHaveCount(initialCount - 1)
  27  |     await page.waitForLoadState('networkidle')
  28  |     await page.reload()
  29  |     await expect(items).toHaveCount(initialCount - 1)
  30  |   })
  31  | 
  32  |   test('l\'aide contextuelle mentionne ⌦ dans le ProjectLister avec plusieurs projets', async ({ page }) => {
  33  |     await page.goto('/')
  34  |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  35  |     await page.keyboard.press('Meta+?')
  36  |     await expect(page.locator('.contextual-help')).toContainText('⌦')
  37  |     await page.keyboard.press('Escape')
  38  |   })
  39  | 
  40  |   test('quand un seul projet reste, le footer ne mentionne plus ⌦', async ({ page }) => {
  41  |     await page.goto('/')
  42  |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  43  |     const items = page.locator('.project-item')
  44  |     const initialCount = await items.count()
  45  |     for (let i = 0; i < initialCount - 1; i++) {
  46  |       await page.keyboard.press('Delete')
  47  |       await expect(items).toHaveCount(initialCount - i - 1)
  48  |     }
  49  |     await expect(items).toHaveCount(1)
  50  |     await expect(page.locator('#shortcuts-footer')).not.toContainText('⌦')
  51  |   })
  52  | 
  53  |   test('quand un seul projet reste, Delete ne le supprime pas et affiche un message', async ({ page }) => {
  54  |     await page.goto('/')
  55  |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  56  |     const items = page.locator('.project-item')
  57  |     const initialCount = await items.count()
  58  |     for (let i = 0; i < initialCount - 1; i++) {
  59  |       await page.keyboard.press('Delete')
  60  |       await expect(items).toHaveCount(initialCount - i - 1)
  61  |     }
  62  |     await expect(items).toHaveCount(1)
  63  |     await page.keyboard.press('Delete')
  64  |     await expect(items).toHaveCount(1)
  65  |     await expect(page.locator('#notification')).toBeVisible()
  66  |   })
  67  | 
  68  | })
  69  | 
  70  | // ─── EVENTS ────────────────────────────────────────────────────────────────
  71  | // many-events : project-a (hl:true, events e1/e2/e3), project-b
  72  | 
  73  | test.describe('Delete dans EventLister', () => {
  74  | 
  75  |   test.beforeEach(() => installFixtures('many-events'))
  76  | 
  77  |   test('Delete supprime l\'event sélectionné dans un EventLister', async ({ page }) => {
  78  |     await page.goto('/')
  79  |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  80  |     await page.keyboard.press('ArrowRight')
  81  |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  82  |     const items = page.locator('.event-item')
  83  |     const initialCount = await items.count()
  84  |     await page.keyboard.press('Delete')
  85  |     await expect(items).toHaveCount(initialCount - 1)
  86  |   })
  87  | 
  88  |   test('la suppression de l\'event est persistante (rechargement)', async ({ page }) => {
  89  |     await page.goto('/')
  90  |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  91  |     await page.keyboard.press('ArrowRight')
  92  |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  93  |     const items = page.locator('.event-item')
  94  |     const initialCount = await items.count()
  95  |     await page.keyboard.press('Delete')
  96  |     await expect(items).toHaveCount(initialCount - 1)
  97  |     await page.waitForLoadState('networkidle')
  98  |     await page.reload()
  99  |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  100 |     await page.keyboard.press('ArrowRight')
  101 |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
> 102 |     await expect(items).toHaveCount(initialCount - 1)
      |                         ^ Error: expect(locator).toHaveCount(expected) failed
  103 |   })
  104 | 
  105 |   test('l\'aide contextuelle mentionne ⌦ dans un EventLister avec plusieurs events', async ({ page }) => {
  106 |     await page.goto('/')
  107 |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  108 |     await page.keyboard.press('ArrowRight')
  109 |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  110 |     await page.keyboard.press('Meta+?')
  111 |     await expect(page.locator('.contextual-help')).toContainText('⌦')
  112 |     await page.keyboard.press('Escape')
  113 |   })
  114 | 
  115 | 
  116 | })
  117 | 
  118 | // ─── BRINS ─────────────────────────────────────────────────────────────────
  119 | // with-brins : project-a (hl:true), events e1/e2, brins b1 (MON, non-coché) / b2 (AUT, coché)
  120 | // e1 a le brin b2 (AUT) assigné → badge AUT visible dans la ligne de e1
  121 | 
  122 | test.describe('Delete dans le panneau des brins', () => {
  123 | 
  124 |   test.beforeEach(() => installFixtures('with-brins'))
  125 | 
  126 |   async function goToEventLister(page) {
  127 |     await page.goto('/')
  128 |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  129 |     await page.keyboard.press('ArrowRight')
  130 |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  131 |   }
  132 | 
  133 |   async function openBrinPanel(page) {
  134 |     await goToEventLister(page)
  135 |     await page.keyboard.press('b')
  136 |     await expect(page.locator('#brin-panel')).toBeVisible()
  137 |   }
  138 | 
  139 |   test('Delete supprime le brin sélectionné dans le panneau des brins', async ({ page }) => {
  140 |     await openBrinPanel(page)
  141 |     const items = page.locator('.brin-item')
  142 |     const initialCount = await items.count()
  143 |     // Naviguer sur b2 (AUT, index 1)
  144 |     await page.keyboard.press('ArrowDown')
  145 |     await expect(items.nth(1)).toHaveClass(/selected/)
  146 |     await page.keyboard.press('Delete')
  147 |     await expect(items).toHaveCount(initialCount - 1)
  148 |     // Le brin b2 (AUT) ne doit plus être dans la liste
  149 |     const titles = page.locator('.brin-item .brin-item__title')
  150 |     await expect(titles).not.toContainText('Autre brin')
  151 |   })
  152 | 
  153 |   test('après suppression du brin coché, le badge disparaît de la ligne de l\'event', async ({ page }) => {
  154 |     await openBrinPanel(page)
  155 |     // Vérifier que le badge AUT est présent dans la ligne de e1 (event sélectionné)
  156 |     const eventRow = page.locator('.event-item.selected')
  157 |     await expect(eventRow.locator('.event-brins-badges .badge.brin')).toContainText('AUT')
  158 |     // Naviguer sur b2 (AUT) et le supprimer
  159 |     await page.keyboard.press('ArrowDown')
  160 |     await page.keyboard.press('Delete')
  161 |     // Le badge AUT doit avoir disparu de la ligne de e1
  162 |     await expect(eventRow.locator('.event-brins-badges')).not.toContainText('AUT')
  163 |   })
  164 | 
  165 |   test('la suppression du brin est persistante : liste des brins du projet', async ({ page }) => {
  166 |     await openBrinPanel(page)
  167 |     await page.keyboard.press('ArrowDown')
  168 |     await page.keyboard.press('Delete')
  169 |     await expect(page.locator('.brin-item')).toHaveCount(1)
  170 |     await page.waitForLoadState('networkidle')
  171 |     // Rechargement
  172 |     await page.reload()
  173 |     await goToEventLister(page)
  174 |     await page.keyboard.press('b')
  175 |     await expect(page.locator('#brin-panel')).toBeVisible()
  176 |     await expect(page.locator('.brin-item')).toHaveCount(1)
  177 |     await expect(page.locator('.brin-item .brin-item__title')).not.toContainText('Autre brin')
  178 |   })
  179 | 
  180 |   test('la suppression du brin est persistante : badge absent de l\'event après rechargement', async ({ page }) => {
  181 |     await openBrinPanel(page)
  182 |     await page.keyboard.press('ArrowDown')
  183 |     await page.keyboard.press('Delete')
  184 |     // Rechargement
  185 |     await page.reload()
  186 |     await goToEventLister(page)
  187 |     // Le badge AUT ne doit pas apparaître dans e1 même après rechargement
  188 |     const eventRow = page.locator('.event-item.selected')
  189 |     await expect(eventRow.locator('.event-brins-badges')).not.toContainText('AUT')
  190 |   })
  191 | 
  192 | })
  193 | 
```