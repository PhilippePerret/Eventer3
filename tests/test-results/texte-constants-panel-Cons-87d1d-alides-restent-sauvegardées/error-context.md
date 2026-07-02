# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: texte/constants-panel.spec.js >> ConstantsPanel >> lignes vides intercalées : les lignes valides restent sauvegardées
- Location: specs/e2e/texte/constants-panel.spec.js:163:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#pane-1').contentFrame().locator('.constants-row').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.constants-row').first()

```

```yaml
- text: Projet A roman DISP MODE PROJECTS
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  66  |     await expect(pane1(page).locator('.constants-row').nth(1)).toHaveClass(/selected/)
  67  |     await expect(pane1(page).locator('.constants-row').first()).not.toHaveClass(/selected/)
  68  |   })
  69  | 
  70  |   test('↑ remonte d\'une ligne', async ({ page }) => {
  71  |     await page.goto('/')
  72  |     await press(page, 'q')
  73  |     await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
  74  |     await press(page, 'ArrowDown')
  75  |     await press(page, 'ArrowDown')
  76  |     await press(page, 'ArrowUp')
  77  |     await expect(pane1(page).locator('.constants-row').nth(1)).toHaveClass(/selected/)
  78  |   })
  79  | 
  80  |   // ─── Édition ───────────────────────────────────────────────────────────────
  81  | 
  82  |   test('Tab met le focus sur le champ constante de la ligne sélectionnée', async ({ page }) => {
  83  |     await page.goto('/')
  84  |     await press(page, 'q')
  85  |     await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
  86  |     await press(page, 'Tab')
  87  |     await expect(pane1(page).locator('.constants-row').first().locator('.constants-row__name')).toBeFocused()
  88  |   })
  89  | 
  90  |   test('Tab depuis le champ constante met le focus sur le champ valeur', async ({ page }) => {
  91  |     await page.goto('/')
  92  |     await press(page, 'q')
  93  |     await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
  94  |     await press(page, 'Tab')
  95  |     await press(page, 'Tab')
  96  |     await expect(pane1(page).locator('.constants-row').first().locator('.constants-row__value')).toBeFocused()
  97  |   })
  98  | 
  99  |   test('Shift+Tab depuis le champ valeur revient sur le champ constante (même ligne)', async ({ page }) => {
  100 |     await page.goto('/')
  101 |     await press(page, 'q')
  102 |     await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
  103 |     await press(page, 'Tab')
  104 |     await press(page, 'Tab')
  105 |     await expect(pane1(page).locator('.constants-row').first().locator('.constants-row__value')).toBeFocused()
  106 |     await press(page, 'Shift+Tab')
  107 |     await expect(pane1(page).locator('.constants-row').first().locator('.constants-row__name')).toBeFocused()
  108 |   })
  109 | 
  110 |   test('Shift+Tab depuis le champ constante va sur la valeur de la ligne précédente', async ({ page }) => {
  111 |     await page.goto('/')
  112 |     await press(page, 'q')
  113 |     await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
  114 |     await press(page, 'ArrowDown')
  115 |     await press(page, 'Tab')
  116 |     await expect(pane1(page).locator('.constants-row').nth(1).locator('.constants-row__name')).toBeFocused()
  117 |     await press(page, 'Shift+Tab')
  118 |     await expect(pane1(page).locator('.constants-row').first().locator('.constants-row__value')).toBeFocused()
  119 |   })
  120 | 
  121 |   // ─── Persistance ───────────────────────────────────────────────────────────
  122 | 
  123 |   test('constante + valeur : sauvegardée à la fermeture', async ({ page }) => {
  124 |     await page.goto('/')
  125 |     await press(page, 'ArrowRight')
  126 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  127 |     await press(page, 'q')
  128 |     await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
  129 |     await press(page, 'Tab')
  130 |     await pane1(page).locator('.constants-row__name').first().fill('VILLE')
  131 |     await press(page, 'Tab')
  132 |     await pane1(page).locator('.constants-row__value').first().fill('Paris')
  133 |     await press(page, 'Escape')
  134 |     await expect(pane1(page).locator('#constants-panel')).not.toBeVisible()
  135 |     // Réouverture
  136 |     await press(page, 'q')
  137 |     await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
  138 |     await expect(pane1(page).locator('.constants-row__name').first()).toHaveValue('VILLE')
  139 |     await expect(pane1(page).locator('.constants-row__value').first()).toHaveValue('Paris')
  140 |   })
  141 | 
  142 |   test('valeur sans constante : ignorée', async ({ page }) => {
  143 |     await page.goto('/')
  144 |     await press(page, 'q')
  145 |     await press(page, 'Tab')          // focus name (vide)
  146 |     await press(page, 'Tab')          // focus value
  147 |     await pane1(page).locator('.constants-row__value').first().fill('Paris')
  148 |     await press(page, 'Escape')
  149 |     await press(page, 'q')
  150 |     await expect(pane1(page).locator('.constants-row__value').first()).toHaveValue('')
  151 |   })
  152 | 
  153 |   test('constante sans valeur : ignorée', async ({ page }) => {
  154 |     await page.goto('/')
  155 |     await press(page, 'q')
  156 |     await press(page, 'Tab')
  157 |     await pane1(page).locator('.constants-row__name').first().fill('VILLE')         // nom sans valeur
  158 |     await press(page, 'Escape')
  159 |     await press(page, 'q')
  160 |     await expect(pane1(page).locator('.constants-row__name').first()).toHaveValue('')
  161 |   })
  162 | 
  163 |   test('lignes vides intercalées : les lignes valides restent sauvegardées', async ({ page }) => {
  164 |     await page.goto('/')
  165 |     await press(page, 'q')
> 166 |     await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
      |                                                                 ^ Error: expect(locator).toBeVisible() failed
  167 |     // Ligne 0 : VILLE / Paris
  168 |     await press(page, 'Tab')
  169 |     await pane1(page).locator('.constants-row__name').first().fill('VILLE')
  170 |     await press(page, 'Tab')
  171 |     await pane1(page).locator('.constants-row__value').first().fill('Paris')
  172 |     // Ligne 1 : vide (skip)
  173 |     await press(page, 'ArrowDown')
  174 |     // Ligne 2 : HEROS / Arthur
  175 |     await press(page, 'ArrowDown')
  176 |     await press(page, 'Tab')
  177 |     await pane1(page).locator('.constants-row__name').nth(2).fill('HEROS')
  178 |     await press(page, 'Tab')
  179 |     await pane1(page).locator('.constants-row__value').nth(2).fill('Arthur')
  180 |     await press(page, 'Escape')
  181 |     await expect(pane1(page).locator('#constants-panel')).not.toBeVisible()
  182 |     // Vérification
  183 |     await press(page, 'q')
  184 |     await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
  185 |     await expect(pane1(page).locator('.constants-row__name').first()).toHaveValue('VILLE')
  186 |     await expect(pane1(page).locator('.constants-row__name').nth(2)).toHaveValue('HEROS')
  187 |   })
  188 | 
  189 | })
  190 | 
```