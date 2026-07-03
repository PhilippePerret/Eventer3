# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/links-tab-open.spec.js >> popup : 3 options présentes
- Location: specs/e2e/_tdd/links-tab-open.spec.js:131:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('#pane-1').contentFrame().locator('.floating-panel__item')
Expected: 3
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.floating-panel__item')
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

# Page snapshot

```yaml
- iframe [active] [ref=e3]:
  - generic [ref=f1e1]:
    - generic [ref=f1e4]:
      - generic [ref=f1e6]: Acte I
      - generic [ref=f1e7]:
        - generic [ref=f1e10]:
          - generic [ref=f1e11]: Séquence 1 de Acte I
          - generic [ref=f1e13]: —
        - generic [ref=f1e19]:
          - generic [ref=f1e20]: Séquence 2 de Acte I, avec Acte III
          - generic [ref=f1e22]: —
        - generic [ref=f1e28]:
          - generic [ref=f1e29]: Séquence 3 de Acte I
          - generic [ref=f1e31]: —
        - generic [ref=f1e37]:
          - generic [ref=f1e38]: Séquence 4 de Acte I
          - generic [ref=f1e40]: —
    - generic:
      - generic: DISP MODE NESTING
    - contentinfo "Raccourcis clavier" [ref=f1e44]
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  38  |   await expect(pane1(page).locator('.event-item.selected .item-link--active')).toHaveCount(1)
  39  |   await expect(pane1(page).locator('.event-item.selected .item-link--active')).toContainText('Acte III')
  40  | })
  41  | 
  42  | test('TAB cycle : 2e TAB → 2e lien activé', async ({ page }) => {
  43  |   await gotoEventList(page)
  44  |   await press(page, 'ArrowDown') // → a2
  45  |   await enterSubLister(page)             // entre dans Acte II
  46  |   await press(page, 'ArrowDown') // → s2a2
  47  |   await enterSubLister(page)             // entre dans Séquence 2
  48  |   await press(page, 'ArrowDown')
  49  |   await press(page, 'ArrowDown') // → sc3s2a2 (3e scène, 2 liens)
  50  |   await press(page, 'Tab') // lien 1
  51  |   await press(page, 'Tab') // lien 2
  52  |   await expect(pane1(page).locator('.event-item.selected .item-link--active')).toContainText('Scène 1 de Séquence 4 de Acte III')
  53  | })
  54  | 
  55  | test('TAB bouclage : après dernier lien → retour au premier', async ({ page }) => {
  56  |   await gotoEventList(page)
  57  |   await press(page, 'ArrowDown') // → a2
  58  |   await enterSubLister(page)
  59  |   await press(page, 'ArrowDown') // → s2a2
  60  |   await enterSubLister(page)
  61  |   await press(page, 'ArrowDown')
  62  |   await press(page, 'ArrowDown') // → sc3s2a2 (3 liens)
  63  |   await press(page, 'Tab') // lien 1
  64  |   await press(page, 'Tab') // lien 2
  65  |   await press(page, 'Tab') // lien 3
  66  |   await press(page, 'Tab') // bouclage → lien 1
  67  |   await expect(pane1(page).locator('.event-item.selected .item-link--active')).toContainText('Séquence 3 de Acte I')
  68  | })
  69  | 
  70  | test('changer item sélectionné efface le lien actif', async ({ page }) => {
  71  |   await gotoEventList(page)
  72  |   await press(page, 'ArrowDown') // → a2
  73  |   await enterSubLister(page)
  74  |   await press(page, 'ArrowDown') // → s2a2
  75  |   await enterSubLister(page)
  76  |   await press(page, 'ArrowDown')
  77  |   await press(page, 'ArrowDown') // → sc3s2a2
  78  |   await press(page, 'Tab')
  79  |   await expect(pane1(page).locator('.item-link--active')).toHaveCount(1)
  80  |   await press(page, 'ArrowUp')
  81  |   await expect(pane1(page).locator('.item-link--active')).toHaveCount(0)
  82  | })
  83  | 
  84  | test('MAJ+TAB cycle à l\'envers : TAB → lien 1, Shift+TAB → lien 3 (wrap arrière)', async ({ page }) => {
  85  |   await gotoEventList(page)
  86  |   await press(page, 'ArrowDown') // → a2
  87  |   await enterSubLister(page)
  88  |   await press(page, 'ArrowDown') // → s2a2
  89  |   await enterSubLister(page)
  90  |   await press(page, 'ArrowDown')
  91  |   await press(page, 'ArrowDown') // → sc3s2a2 (3 liens)
  92  |   await press(page, 'Tab')       // lien 1 : "Séquence 3 de Acte I"
  93  |   // Shift+TAB depuis index 0 → backward wrap → index 2 (lien 3 : "Acte II")
  94  |   await press(page, 'Shift+Tab')
  95  |   await expect(pane1(page).locator('.event-item.selected .item-link--active')).toContainText('Acte II')
  96  | })
  97  | 
  98  | // ─── 'o' sans lien actif ─────────────────────────────────────────────────────
  99  | 
  100 | test("'o' sans lien actif sur item sans liens → notification", async ({ page }) => {
  101 |   await gotoEventList(page)
  102 |   await press(page, 'o')
  103 |   await expect(pane1(page).locator('.notification')).toBeVisible()
  104 |   await expect(pane1(page).locator('.notification')).toContainText(getErr(5210))
  105 | })
  106 | 
  107 | test("'o' sans TAB sur item avec liens → notification", async ({ page }) => {
  108 |   await gotoEventList(page)
  109 |   await press(page, 'ArrowDown') // → a2
  110 |   await enterSubLister(page)
  111 |   await press(page, 'ArrowDown') // → s2a2
  112 |   await enterSubLister(page)
  113 |   await press(page, 'ArrowDown')
  114 |   await press(page, 'ArrowDown') // → sc3s2a2
  115 |   await press(page, 'o')
  116 |   await expect(pane1(page).locator('.notification')).toBeVisible()
  117 |   await expect(pane1(page).locator('.notification')).toContainText(getErr(5210))
  118 | })
  119 | 
  120 | // ─── Popup 'o' ───────────────────────────────────────────────────────────────
  121 | 
  122 | test("TAB puis 'o' → popup s'ouvre", async ({ page }) => {
  123 |   await gotoEventList(page)
  124 |   await enterSubLister(page) // entre dans a1
  125 |   await press(page, 'ArrowDown') // → s2a1
  126 |   await press(page, 'Tab')
  127 |   await press(page, 'o')
  128 |   await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  129 | })
  130 | 
  131 | test('popup : 3 options présentes', async ({ page }) => {
  132 |   await gotoEventList(page)
  133 |   await enterSubLister(page)
  134 |   await press(page, 'ArrowDown') // → s2a1
  135 |   await press(page, 'Tab')
  136 |   await press(page, 'o')
  137 |   const items = pane1(page).locator('.floating-panel__item')
> 138 |   await expect(items).toHaveCount(3)
      |                       ^ Error: expect(locator).toHaveCount(expected) failed
  139 |   await expect(items.nth(0)).toContainText('évènemencier')
  140 |   await expect(items.nth(1)).toContainText('carte')
  141 |   await expect(items.nth(2)).toContainText('fenêtre')
  142 | })
  143 | 
  144 | test('Escape ferme le popup, lien reste actif', async ({ page }) => {
  145 |   await gotoEventList(page)
  146 |   await enterSubLister(page)
  147 |   await press(page, 'ArrowDown') // → s2a1
  148 |   await press(page, 'Tab')
  149 |   await press(page, 'o')
  150 |   await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  151 |   await press(page, 'Escape')
  152 |   await expect(pane1(page).locator('.link-open-popup')).not.toBeVisible()
  153 |   await expect(pane1(page).locator('.item-link--active')).toHaveCount(1)
  154 | })
  155 | 
```