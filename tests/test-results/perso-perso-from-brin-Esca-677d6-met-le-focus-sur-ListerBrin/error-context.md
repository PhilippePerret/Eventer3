# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: perso/perso-from-brin.spec.js >> Escape ferme le panneau perso et remet le focus sur ListerBrin
- Location: specs/e2e/perso/perso-from-brin.spec.js:48:1

# Error details

```
Error: expect(locator).not.toBeVisible() failed

Locator:  locator('#pane-1').contentFrame().locator('#persos-panel')
Expected: not visible
Received: visible
Timeout:  5000ms

Call log:
  - Expect "not toBeVisible" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('#persos-panel')
    14 × locator resolved to <div id="persos-panel" class="perso-list">…</div>
       - unexpected value "visible"

```

```yaml
- text: Cyrano de Bergerac 🫥 CY ✓ Roxane Robin 🫥 RO Christian de Neuvillette 🎭 🎭 Valvert de Valvert 👑 👑
```

# Test source

```ts
  1   | import { installFixtures } from '../../../helpers/install-fixtures'
  2   | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3   | 
  4   | test.beforeEach(() => {
  5   |   installFixtures('with-persos')
  6   | })
  7   | 
  8   | // Fixture with-persos :
  9   | //   b1 (MON, perso_ids=[c2])  ← c2 Roxane est sur le brin
  10  | //   c1 Cyrano (CY, direct sur e1)
  11  | //   c2 Roxane (RO, sur brin b1)
  12  | //   c3 Christian (CH, avatar 🎭, non assigné)
  13  | //   c4 Valvert (VA, avatar 👑, non assigné)
  14  | 
  15  | async function goToListerEvent(page) {
  16  |   await page.goto('/')
  17  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  18  |   await press(page, 'ArrowRight')
  19  |   await press(page, 'ArrowRight')
  20  |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  21  | }
  22  | 
  23  | async function openBrinPanel(page) {
  24  |   await goToListerEvent(page)
  25  |   await press(page, 'b')
  26  |   await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  27  | }
  28  | 
  29  | async function openPersoPanelFromBrin(page) {
  30  |   await openBrinPanel(page)
  31  |   await press(page, 'p')
  32  |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  33  | }
  34  | 
  35  | // ─── Ouverture depuis ListerBrin ──────────────────────────────────────────────
  36  | 
  37  | test("p ouvre le panneau des personnages depuis ListerBrin", async ({ page }) => {
  38  |   await openBrinPanel(page)
  39  |   await press(page, 'p')
  40  |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  41  | })
  42  | 
  43  | test("le panneau brins reste visible en fond pendant le panneau perso", async ({ page }) => {
  44  |   await openPersoPanelFromBrin(page)
  45  |   await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  46  | })
  47  | 
  48  | test("Escape ferme le panneau perso et remet le focus sur ListerBrin", async ({ page }) => {
  49  |   await openPersoPanelFromBrin(page)
  50  |   await press(page, 'Escape')
> 51  |   await expect(pane1(page).locator('#persos-panel')).not.toBeVisible()
      |                                                          ^ Error: expect(locator).not.toBeVisible() failed
  52  |   // ListerBrin reprend la main : ↓ change la sélection du brin
  53  |   await press(page, 'ArrowDown')
  54  |   // pas d'erreur = ListerBrin actif
  55  | })
  56  | 
  57  | // ─── État coché = brin.perso_ids ─────────────────────────────────────────────
  58  | 
  59  | test("c2 (perso de b1) est coché à l'ouverture depuis b1", async ({ page }) => {
  60  |   await openPersoPanelFromBrin(page)
  61  |   // c2 = index 1 dans la liste
  62  |   await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/checked/)
  63  | })
  64  | 
  65  | test("c1, c3, c4 ne sont pas cochés à l'ouverture depuis b1", async ({ page }) => {
  66  |   await openPersoPanelFromBrin(page)
  67  |   await expect(pane1(page).locator('.perso-item').nth(0)).not.toHaveClass(/checked/)
  68  |   await expect(pane1(page).locator('.perso-item').nth(2)).not.toHaveClass(/checked/)
  69  |   await expect(pane1(page).locator('.perso-item').nth(3)).not.toHaveClass(/checked/)
  70  | })
  71  | 
  72  | test("les persos du brin ne sont pas grisés (tous décochables depuis brin)", async ({ page }) => {
  73  |   await openPersoPanelFromBrin(page)
  74  |   await expect(pane1(page).locator('.perso-item').nth(1)).not.toHaveClass(/inherited/)
  75  | })
  76  | 
  77  | // ─── Toggle depuis brin ───────────────────────────────────────────────────────
  78  | 
  79  | test("Space coche un perso non-coché sur le brin (c1)", async ({ page }) => {
  80  |   await openPersoPanelFromBrin(page)
  81  |   await expect(pane1(page).locator('.perso-item').nth(0)).not.toHaveClass(/checked/)
  82  |   await press(page, ' ')
  83  |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/checked/)
  84  | })
  85  | 
  86  | test("Space décoche un perso coché sur le brin (c2)", async ({ page }) => {
  87  |   await openPersoPanelFromBrin(page)
  88  |   await press(page, 'ArrowDown') // → c2
  89  |   await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/checked/)
  90  |   await press(page, ' ')
  91  |   await expect(pane1(page).locator('.perso-item').nth(1)).not.toHaveClass(/checked/)
  92  | })
  93  | 
  94  | // ─── Badge perso sur la ligne du brin ────────────────────────────────────────
  95  | 
  96  | test("la ligne de b1 affiche le badge de c2 (son perso)", async ({ page }) => {
  97  |   await openBrinPanel(page)
  98  |   const brinEl = pane1(page).locator('.brin-item').nth(0)
  99  |   await expect(brinEl.locator('.brin-persos-marks .perso-mark')).toContainText('RO')
  100 | })
  101 | 
  102 | test("cocher c3 depuis le panneau perso de b1 ajoute son avatar sur la ligne du brin", async ({ page }) => {
  103 |   await openPersoPanelFromBrin(page)
  104 |   await press(page, 'ArrowDown')
  105 |   await press(page, 'ArrowDown') // → c3
  106 |   await press(page, ' ')
  107 |   const brinEl = pane1(page).locator('.brin-item').nth(0)
  108 |   // c3 a avatar 🎭 → affiché à la place du badge
  109 |   await expect(brinEl.locator('.brin-persos-marks')).toContainText('🎭')
  110 | })
  111 | 
  112 | // ─── Marques perso sur la ligne d'event ──────────────────────────────────────
  113 | 
  114 | test("les persos des brins d'un event s'affichent sur la ligne dès le chargement (sans ouvrir le panneau perso)", async ({ page }) => {
  115 |   await goToListerEvent(page)
  116 |   // e1 a brin b1 (perso c2=RO) et perso direct c1=CY
  117 |   const eventEl = pane1(page).locator('.event-item').nth(0)
  118 |   await expect(eventEl.locator('.event-persos-marks')).toContainText('CY')
  119 |   await expect(eventEl.locator('.event-persos-marks')).toContainText('RO')
  120 | })
  121 | 
  122 | test("retirer un brin d'un event met à jour les marques perso sur la ligne de l'event", async ({ page }) => {
  123 |   await openBrinPanel(page)
  124 |   // b1 est coché sur e1 (c2=RO via b1 s'affiche sur e1)
  125 |   // décocher b1
  126 |   await press(page, ' ')
  127 |   const eventEl = pane1(page).locator('.event-item').nth(0)
  128 |   // c2 (RO) ne devrait plus apparaître (vient de b1)
  129 |   await expect(eventEl.locator('.event-persos-marks')).not.toContainText('RO')
  130 | })
  131 | 
  132 | // ─── Persistance ─────────────────────────────────────────────────────────────
  133 | 
  134 | test("persistance : cochage sur brin survit au rechargement", async ({ page }) => {
  135 |   await openPersoPanelFromBrin(page)
  136 |   await press(page, ' ') // cocher c1 sur b1
  137 |   await page.waitForLoadState('networkidle')
  138 |   await page.reload()
  139 |   await openBrinPanel(page)
  140 |   await press(page, 'p')
  141 |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/checked/)
  142 | })
  143 | 
```