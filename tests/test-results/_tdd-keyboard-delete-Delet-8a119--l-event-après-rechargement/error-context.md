# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/keyboard-delete.spec.js >> Delete dans le panneau des brins >> la suppression du brin est persistante : badge absent de l'event après rechargement
- Location: specs/e2e/_tdd/keyboard-delete.spec.js:186:3

# Error details

```
Error: expect(locator).not.toContainText(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.event-item.selected').locator('.event-brins-marks')
Expected substring: not "AUT"
Received string: "AUT"
Timeout: 5000ms

Call log:
  - Expect "not toContainText" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.event-item.selected').locator('.event-brins-marks')
    14 × locator resolved to <div class="brins-marks event-brins-marks">…</div>
       - unexpected value "AUT"

```

```yaml
- text: AUT
```

# Test source

```ts
  95  |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  96  |     const items = pane1(page).locator('.event-item')
  97  |     const initialCount = await items.count()
  98  |     await press(page, 'Delete')
  99  |     await expect(items).toHaveCount(initialCount - 1)
  100 |     await page.waitForLoadState('networkidle')
  101 |     await page.reload()
  102 |     await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  103 |     await press(page, 'ArrowRight')
  104 |     await press(page, 'ArrowRight')
  105 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  106 |     await expect(items).toHaveCount(initialCount - 1)
  107 |   })
  108 | 
  109 |   test('l\'aide contextuelle mentionne ⌦ dans un ListerEvent avec plusieurs events', async ({ page }) => {
  110 |     await page.goto('/')
  111 |     await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  112 |     await press(page, 'ArrowRight')
  113 |     await press(page, 'ArrowRight')
  114 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  115 |     await press(page, 'Meta+?')
  116 |     await expect(pane1(page).locator('.contextual-help')).toContainText('⌦')
  117 |     await press(page, 'Escape')
  118 |   })
  119 | 
  120 | 
  121 | })
  122 | 
  123 | // ─── BRINS ─────────────────────────────────────────────────────────────────
  124 | // with-brins : project-a (hl:true), events e1/e2, brins b1 (MON, non-coché) / b2 (AUT, coché)
  125 | // e1 a le brin b2 (AUT) assigné → badge AUT visible dans la ligne de e1
  126 | 
  127 | test.describe('Delete dans le panneau des brins', () => {
  128 | 
  129 |   test.beforeEach(() => installFixtures('with-brins'))
  130 | 
  131 |   async function goToListerEvent(page) {
  132 |     await page.goto('/')
  133 |     await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  134 |     await press(page, 'ArrowRight')
  135 |     await press(page, 'ArrowRight')
  136 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  137 |   }
  138 | 
  139 |   async function openBrinPanel(page) {
  140 |     await goToListerEvent(page)
  141 |     await press(page, 'b')
  142 |     await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  143 |   }
  144 | 
  145 |   test('Delete supprime le brin sélectionné dans le panneau des brins', async ({ page }) => {
  146 |     await openBrinPanel(page)
  147 |     const items = pane1(page).locator('.brin-item')
  148 |     const initialCount = await items.count()
  149 |     // Naviguer sur b2 (AUT, index 1)
  150 |     await press(page, 'ArrowDown')
  151 |     await expect(items.nth(1)).toHaveClass(/selected/)
  152 |     await press(page, 'Delete')
  153 |     await expect(items).toHaveCount(initialCount - 1)
  154 |     // Le brin b2 (AUT) ne doit plus être dans la liste
  155 |     const titles = pane1(page).locator('.brin-item .brin-title')
  156 |     await expect(titles).not.toContainText('Autre brin')
  157 |   })
  158 | 
  159 |   test('après suppression du brin coché, le badge disparaît de la ligne de l\'event', async ({ page }) => {
  160 |     await openBrinPanel(page)
  161 |     // Vérifier que le badge AUT est présent dans la ligne de e1 (event sélectionné)
  162 |     const eventRow = pane1(page).locator('.event-item.selected')
  163 |     await expect(eventRow.locator('.event-brins-marks .panel-mark')).toContainText('AUT')
  164 |     // Naviguer sur b2 (AUT) et le supprimer
  165 |     await press(page, 'ArrowDown')
  166 |     await press(page, 'Delete')
  167 |     // Le badge AUT doit avoir disparu de la ligne de e1
  168 |     await expect(eventRow.locator('.event-brins-marks')).not.toContainText('AUT')
  169 |   })
  170 | 
  171 |   test('la suppression du brin est persistante : liste des brins du projet', async ({ page }) => {
  172 |     await openBrinPanel(page)
  173 |     await press(page, 'ArrowDown')
  174 |     await press(page, 'Delete')
  175 |     await expect(pane1(page).locator('.brin-item')).toHaveCount(1)
  176 |     await page.waitForLoadState('networkidle')
  177 |     // Rechargement
  178 |     await page.reload()
  179 |     await goToListerEvent(page)
  180 |     await press(page, 'b')
  181 |     await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  182 |     await expect(pane1(page).locator('.brin-item')).toHaveCount(1)
  183 |     await expect(pane1(page).locator('.brin-item .brin-title')).not.toContainText('Autre brin')
  184 |   })
  185 | 
  186 |   test('la suppression du brin est persistante : badge absent de l\'event après rechargement', async ({ page }) => {
  187 |     await openBrinPanel(page)
  188 |     await press(page, 'ArrowDown')
  189 |     await press(page, 'Delete')
  190 |     // Rechargement
  191 |     await page.reload()
  192 |     await goToListerEvent(page)
  193 |     // Le badge AUT ne doit pas apparaître dans e1 même après rechargement
  194 |     const eventRow = pane1(page).locator('.event-item.selected')
> 195 |     await expect(eventRow.locator('.event-brins-marks')).not.toContainText('AUT')
      |                                                              ^ Error: expect(locator).not.toContainText(expected) failed
  196 |   })
  197 | 
  198 | })
  199 | 
```