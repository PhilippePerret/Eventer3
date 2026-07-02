# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: keyboard/keyboard-delete.spec.js >> Delete dans le panneau des brins >> la suppression du brin est persistante : badge absent de l'event après rechargement
- Location: specs/e2e/keyboard/keyboard-delete.spec.js:185:3

# Error details

```
Error: expect(locator).not.toContainText(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.event-item.selected').locator('.event-brins-badges')
Expected substring: not "AUT"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "not toContainText" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.event-item.selected').locator('.event-brins-badges')

```

```yaml
- text: Événement 1 — Événement 2 — DISP MODE NESTING
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  94  |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  95  |     const items = pane1(page).locator('.event-item')
  96  |     const initialCount = await items.count()
  97  |     await press(page, 'Delete')
  98  |     await expect(items).toHaveCount(initialCount - 1)
  99  |     await page.waitForLoadState('networkidle')
  100 |     await page.reload()
  101 |     await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  102 |     await press(page, 'ArrowRight')
  103 |     await press(page, 'ArrowRight')
  104 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  105 |     await expect(items).toHaveCount(initialCount - 1)
  106 |   })
  107 | 
  108 |   test('l\'aide contextuelle mentionne ⌦ dans un ListerEvent avec plusieurs events', async ({ page }) => {
  109 |     await page.goto('/')
  110 |     await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  111 |     await press(page, 'ArrowRight')
  112 |     await press(page, 'ArrowRight')
  113 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  114 |     await press(page, 'Meta+?')
  115 |     await expect(pane1(page).locator('.contextual-help')).toContainText('⌦')
  116 |     await press(page, 'Escape')
  117 |   })
  118 | 
  119 | 
  120 | })
  121 | 
  122 | // ─── BRINS ─────────────────────────────────────────────────────────────────
  123 | // with-brins : project-a (hl:true), events e1/e2, brins b1 (MON, non-coché) / b2 (AUT, coché)
  124 | // e1 a le brin b2 (AUT) assigné → badge AUT visible dans la ligne de e1
  125 | 
  126 | test.describe('Delete dans le panneau des brins', () => {
  127 | 
  128 |   test.beforeEach(() => installFixtures('with-brins'))
  129 | 
  130 |   async function goToListerEvent(page) {
  131 |     await page.goto('/')
  132 |     await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  133 |     await press(page, 'ArrowRight')
  134 |     await press(page, 'ArrowRight')
  135 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  136 |   }
  137 | 
  138 |   async function openBrinPanel(page) {
  139 |     await goToListerEvent(page)
  140 |     await press(page, 'b')
  141 |     await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  142 |   }
  143 | 
  144 |   test('Delete supprime le brin sélectionné dans le panneau des brins', async ({ page }) => {
  145 |     await openBrinPanel(page)
  146 |     const items = pane1(page).locator('.brin-item')
  147 |     const initialCount = await items.count()
  148 |     // Naviguer sur b2 (AUT, index 1)
  149 |     await press(page, 'ArrowDown')
  150 |     await expect(items.nth(1)).toHaveClass(/selected/)
  151 |     await press(page, 'Delete')
  152 |     await expect(items).toHaveCount(initialCount - 1)
  153 |     // Le brin b2 (AUT) ne doit plus être dans la liste
  154 |     const titles = pane1(page).locator('.brin-item .brin-item__title')
  155 |     await expect(titles).not.toContainText('Autre brin')
  156 |   })
  157 | 
  158 |   test('après suppression du brin coché, le badge disparaît de la ligne de l\'event', async ({ page }) => {
  159 |     await openBrinPanel(page)
  160 |     // Vérifier que le badge AUT est présent dans la ligne de e1 (event sélectionné)
  161 |     const eventRow = pane1(page).locator('.event-item.selected')
  162 |     await expect(eventRow.locator('.event-brins-badges .badge.brin')).toContainText('AUT')
  163 |     // Naviguer sur b2 (AUT) et le supprimer
  164 |     await press(page, 'ArrowDown')
  165 |     await press(page, 'Delete')
  166 |     // Le badge AUT doit avoir disparu de la ligne de e1
  167 |     await expect(eventRow.locator('.event-brins-badges')).not.toContainText('AUT')
  168 |   })
  169 | 
  170 |   test('la suppression du brin est persistante : liste des brins du projet', async ({ page }) => {
  171 |     await openBrinPanel(page)
  172 |     await press(page, 'ArrowDown')
  173 |     await press(page, 'Delete')
  174 |     await expect(pane1(page).locator('.brin-item')).toHaveCount(1)
  175 |     await page.waitForLoadState('networkidle')
  176 |     // Rechargement
  177 |     await page.reload()
  178 |     await goToListerEvent(page)
  179 |     await press(page, 'b')
  180 |     await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  181 |     await expect(pane1(page).locator('.brin-item')).toHaveCount(1)
  182 |     await expect(pane1(page).locator('.brin-item .brin-item__title')).not.toContainText('Autre brin')
  183 |   })
  184 | 
  185 |   test('la suppression du brin est persistante : badge absent de l\'event après rechargement', async ({ page }) => {
  186 |     await openBrinPanel(page)
  187 |     await press(page, 'ArrowDown')
  188 |     await press(page, 'Delete')
  189 |     // Rechargement
  190 |     await page.reload()
  191 |     await goToListerEvent(page)
  192 |     // Le badge AUT ne doit pas apparaître dans e1 même après rechargement
  193 |     const eventRow = pane1(page).locator('.event-item.selected')
> 194 |     await expect(eventRow.locator('.event-brins-badges')).not.toContainText('AUT')
      |                                                               ^ Error: expect(locator).not.toContainText(expected) failed
  195 |   })
  196 | 
  197 | })
  198 | 
```