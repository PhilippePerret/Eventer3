# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/panel-search.spec.js >> panneau brins : filtre remis à zéro à la fermeture/réouverture
- Location: specs/e2e/_tdd/panel-search.spec.js:43:1

# Error details

```
Test timeout of 15000ms exceeded.
```

```
Error: locator.fill: Test timeout of 15000ms exceeded.
Call log:
  - waiting for locator('.panel-search')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - navigation [ref=e3]:
      - button "Projet A" [ref=e4] [cursor=pointer]
      - generic [ref=e5]: ‹
    - generic [ref=e8]:
      - generic [ref=e10]: Événement 1
      - generic [ref=e11]:
        - generic [ref=e13]: MON
        - generic [ref=e15]: CY
        - generic [ref=e16]: —
    - generic [ref=e19]:
      - generic [ref=e21]: Événement 2
      - generic [ref=e23]: —
  - generic:
    - generic: DISP MODE NESTING
  - contentinfo "Raccourcis clavier" [ref=e24]:
    - generic [ref=e25]:
      - generic [ref=e26]: ↑ ↓
      - text: choisir
    - generic [ref=e27]:
      - generic [ref=e28]: ⏎
      - text: éditer
    - generic [ref=e29]:
      - generic [ref=e30]: "n"
      - text: nouveau après
    - generic [ref=e31]:
      - generic [ref=e32]: ⌥n
      - text: nouveau avant
    - generic [ref=e33]:
      - generic [ref=e34]: ⌘c
      - text: copier
    - generic [ref=e35]:
      - generic [ref=e36]: ⌘x
      - text: couper
    - generic [ref=e37]:
      - generic [ref=e38]: ⌘v
      - text: coller avant
    - generic [ref=e39]:
      - generic [ref=e40]: ⌦
      - text: supprimer
    - generic [ref=e41]:
      - generic [ref=e42]: ←
      - text: parent
    - generic [ref=e43]:
      - generic [ref=e44]: →
      - text: éléments
    - generic [ref=e45]:
      - generic [ref=e46]: "⌘:"
      - text: filtrer
    - generic [ref=e47]:
      - generic [ref=e48]: ␣
      - text: cocher
    - generic [ref=e49]:
      - generic [ref=e50]: ⌘⏎
      - text: fermer
    - generic [ref=e51]:
      - generic [ref=e52]: ⌥↓ ⌥↑
      - text: Event suivant/précédent
  - generic [ref=e54]:
    - generic [ref=e56]: Brins · Événement 1
    - generic [ref=e57]:
      - generic [ref=e58]: ✓
      - textbox "Couleur du brin" [ref=e59]: "#d9c8a9"
      - generic [ref=e60]: MON
      - generic [ref=e61]: Mon brin
      - combobox [ref=e62]:
        - option "—"
        - option "intrigue principale"
        - option "intrigue amoureuse"
        - option "intrigue"
        - option "personnage"
        - option "relation"
        - option "thème"
        - option "accessoire"
        - option "autre"
    - generic [ref=e63]:
      - generic [ref=e64]: ✓
      - textbox "Couleur du brin" [ref=e65]: "#c8d9a9"
      - generic [ref=e66]: AUT
      - generic [ref=e67]: Autre brin
      - combobox [ref=e68]:
        - option "—"
        - option "intrigue principale"
        - option "intrigue amoureuse"
        - option "intrigue"
        - option "personnage"
        - option "relation"
        - option "thème"
        - option "accessoire"
        - option "autre"
```

# Test source

```ts
  1   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  2   | import { test, expect } from '../__setup__.js'
  3   | 
  4   | // Fixtures:
  5   | //   with-brins-and-persos : b1="Mon brin", b2="Autre brin", c1="Cyrano", c2="Roxane"
  6   | //   with-styles           : titre, note-rouge
  7   | 
  8   | async function goToEventLister(page, fixture) {
  9   |   installFixtures(fixture)
  10  |   await page.goto('/')
  11  |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  12  |   await page.keyboard.press('ArrowRight')
  13  |   await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  14  | }
  15  | 
  16  | // ─── BrinLister ───────────────────────────────────────────────────────────────
  17  | 
  18  | test("panneau brins : champ .panel-search présent", async ({ page }) => {
  19  |   await goToEventLister(page, 'with-brins-and-persos')
  20  |   await page.keyboard.press('b')
  21  |   await expect(page.locator('#brin-panel')).toBeVisible()
  22  |   await expect(page.locator('#brin-panel .panel-search')).toBeVisible()
  23  | })
  24  | 
  25  | test("panneau brins : taper 'mon' cache 'Autre brin'", async ({ page }) => {
  26  |   await goToEventLister(page, 'with-brins-and-persos')
  27  |   await page.keyboard.press('b')
  28  |   await expect(page.locator('.brin-row')).toHaveCount(2)
  29  |   await page.locator('.panel-search').fill('mon')
  30  |   await expect(page.locator('.brin-row:not(.hidden)')).toHaveCount(1)
  31  |   await expect(page.locator('.brin-row.hidden')).toHaveCount(1)
  32  | })
  33  | 
  34  | test("panneau brins : vider le champ réaffiche tout", async ({ page }) => {
  35  |   await goToEventLister(page, 'with-brins-and-persos')
  36  |   await page.keyboard.press('b')
  37  |   await page.locator('.panel-search').fill('mon')
  38  |   await expect(page.locator('.brin-row:not(.hidden)')).toHaveCount(1)
  39  |   await page.locator('.panel-search').fill('')
  40  |   await expect(page.locator('.brin-row:not(.hidden)')).toHaveCount(2)
  41  | })
  42  | 
  43  | test("panneau brins : filtre remis à zéro à la fermeture/réouverture", async ({ page }) => {
  44  |   await goToEventLister(page, 'with-brins-and-persos')
  45  |   await page.keyboard.press('b')
> 46  |   await page.locator('.panel-search').fill('mon')
      |                                       ^ Error: locator.fill: Test timeout of 15000ms exceeded.
  47  |   await expect(page.locator('.brin-row:not(.hidden)')).toHaveCount(1)
  48  |   await page.keyboard.press('Escape') // fermer
  49  |   await page.keyboard.press('b')     // rouvrir
  50  |   await expect(page.locator('.brin-row:not(.hidden)')).toHaveCount(2)
  51  |   const inputVal = await page.locator('.panel-search').inputValue()
  52  |   expect(inputVal).toBe('')
  53  | })
  54  | 
  55  | // ─── PersoLister ─────────────────────────────────────────────────────────────
  56  | 
  57  | test("panneau persos : champ .panel-search présent", async ({ page }) => {
  58  |   await goToEventLister(page, 'with-brins-and-persos')
  59  |   await page.keyboard.press('p')
  60  |   await expect(page.locator('#perso-panel')).toBeVisible()
  61  |   await expect(page.locator('#perso-panel .panel-search')).toBeVisible()
  62  | })
  63  | 
  64  | test("panneau persos : taper 'cyr' cache 'Roxane'", async ({ page }) => {
  65  |   await goToEventLister(page, 'with-brins-and-persos')
  66  |   await page.keyboard.press('p')
  67  |   await expect(page.locator('.perso-row')).toHaveCount(2)
  68  |   await page.locator('.panel-search').fill('cyr')
  69  |   await expect(page.locator('.perso-row:not(.hidden)')).toHaveCount(1)
  70  |   await expect(page.locator('.perso-row.hidden')).toHaveCount(1)
  71  | })
  72  | 
  73  | // ─── StyleLister ─────────────────────────────────────────────────────────────
  74  | 
  75  | test("panneau styles : champ .panel-search présent", async ({ page }) => {
  76  |   await goToEventLister(page, 'with-styles')
  77  |   await page.keyboard.press('s')
  78  |   await expect(page.locator('#style-panel')).toBeVisible()
  79  |   await expect(page.locator('#style-panel .panel-search')).toBeVisible()
  80  | })
  81  | 
  82  | test("panneau styles : taper 'titre' cache 'note-rouge'", async ({ page }) => {
  83  |   await goToEventLister(page, 'with-styles')
  84  |   await page.keyboard.press('s')
  85  |   await expect(page.locator('.style-row')).toHaveCount(2)
  86  |   await page.locator('.panel-search').fill('titre')
  87  |   await expect(page.locator('.style-row:not(.hidden)')).toHaveCount(1)
  88  |   await expect(page.locator('.style-row.hidden')).toHaveCount(1)
  89  | })
  90  | 
  91  | // ─── EventLister ─────────────────────────────────────────────────────────────
  92  | 
  93  | test("liste events : champ .panel-search toujours présent", async ({ page }) => {
  94  |   await goToEventLister(page, 'with-brins-and-persos')
  95  |   await expect(page.locator('#main-panel .panel-search')).toBeVisible()
  96  | })
  97  | 
  98  | test("liste events : absent dans la liste des projets", async ({ page }) => {
  99  |   installFixtures('with-brins-and-persos')
  100 |   await page.goto('/')
  101 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  102 |   await expect(page.locator('#main-panel .panel-search')).toHaveCount(0)
  103 | })
  104 | 
  105 | test("liste events : taper '1' cache 'Événement 2'", async ({ page }) => {
  106 |   await goToEventLister(page, 'with-brins-and-persos')
  107 |   await expect(page.locator('.event-item')).toHaveCount(2)
  108 |   await page.locator('#main-panel .panel-search').fill('1')
  109 |   await expect(page.locator('.event-item:not(.hidden)')).toHaveCount(1)
  110 |   await expect(page.locator('.event-item.hidden')).toHaveCount(1)
  111 | })
  112 | 
  113 | test("liste events : vider le champ réaffiche tout", async ({ page }) => {
  114 |   await goToEventLister(page, 'with-brins-and-persos')
  115 |   await page.locator('#main-panel .panel-search').fill('1')
  116 |   await expect(page.locator('.event-item:not(.hidden)')).toHaveCount(1)
  117 |   await page.locator('#main-panel .panel-search').fill('')
  118 |   await expect(page.locator('.event-item:not(.hidden)')).toHaveCount(2)
  119 | })
  120 | 
  121 | test("liste events : filtre remis à zéro quand on revient à la liste", async ({ page }) => {
  122 |   await goToEventLister(page, 'with-brins-and-persos')
  123 |   await page.locator('#main-panel .panel-search').fill('1')
  124 |   await expect(page.locator('.event-item:not(.hidden)')).toHaveCount(1)
  125 |   await page.keyboard.press('ArrowLeft') // retour projets
  126 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  127 |   await page.keyboard.press('ArrowRight') // retour events
  128 |   await expect(page.locator('.event-item:not(.hidden)')).toHaveCount(2)
  129 |   const inputVal = await page.locator('#main-panel .panel-search').inputValue()
  130 |   expect(inputVal).toBe('')
  131 | })
  132 | 
```