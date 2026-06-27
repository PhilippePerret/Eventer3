# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/brin-persistence.spec.js >> brin créé persiste après rechargement de la page
- Location: specs/e2e/_tdd/brin-persistence.spec.js:20:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#pane-1').contentFrame().locator('#events-panel')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('#events-panel')

```

```yaml
- text: Projet A --- roman
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | // Origine : tests/specs/e2e/brin/brin-persistence.spec.js
  2   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  3   | import { test, expect, pane1, getErr } from '../__setup__.js'
  4   | 
  5   | test.beforeEach(() => {
  6   |   installFixtures('with-brins')
  7   | })
  8   | 
  9   | // fixture with-brins : project-a, events e1/e2, brins b1 (MON) / b2 (AUT)
  10  | 
  11  | async function openBrinPanel(page) {
  12  |   await page.goto('/')
  13  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  14  |   await pane1(page).locator('.project-item.selected').press('ArrowRight')
> 15  |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
      |                                                      ^ Error: expect(locator).toBeVisible() failed
  16  |   await pane1(page).locator('.event-item.selected').press('b')
  17  |   await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  18  | }
  19  | 
  20  | test("brin créé persiste après rechargement de la page", async ({ page }) => {
  21  |   await openBrinPanel(page)
  22  | 
  23  |   await pane1(page).locator('.brin-item.selected').press('n')
  24  |   await pane1(page).locator('.brin-item.selected [data-field="title"]').fill('Brin persistant')
  25  |   await pane1(page).locator('.brin-item.selected').press('Enter')
  26  | 
  27  |   // Vérification immédiate
  28  |   await expect(pane1(page).locator('.brin-item').nth(1)).toContainText('Brin persistant')
  29  | 
  30  |   // Rechargement de la page
  31  |   await page.reload()
  32  | 
  33  |   // Navigation vers le panel brins
  34  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  35  |   await pane1(page).locator('.project-item.selected').press('ArrowRight')
  36  |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  37  |   await pane1(page).locator('.event-item.selected').press('b')
  38  |   await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  39  | 
  40  |   // Le brin créé doit être visible
  41  |   const brins = pane1(page).locator('.brin-item')
  42  |   const brinPersistant = brins.filter({ hasText: 'Brin persistant' })
  43  |   await expect(brinPersistant).toBeVisible()
  44  | 
  45  |   // Le badge du nouveau brin doit être non vide (stocké en DB)
  46  |   const badge = brinPersistant.locator('.brin-badge')
  47  |   await expect(badge).not.toHaveText('')
  48  | })
  49  | 
  50  | test("brin créé a bien un badge affiché après rechargement", async ({ page }) => {
  51  |   await openBrinPanel(page)
  52  | 
  53  |   await pane1(page).locator('.brin-item.selected').press('n')
  54  |   await pane1(page).locator('.brin-item.selected [data-field="title"]').fill('Nouveau Brin')
  55  |   await pane1(page).locator('.brin-item.selected').press('Enter')
  56  | 
  57  |   // Attendre que le DOM reflète la création et que le save réseau soit terminé
  58  |   await expect(pane1(page).locator('.brin-item').nth(1)).toContainText('Nouveau Brin')
  59  |   await page.waitForLoadState('networkidle')
  60  | 
  61  |   // Recharger
  62  |   await page.reload()
  63  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  64  |   await pane1(page).locator('.project-item.selected').press('ArrowRight')
  65  |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  66  |   await pane1(page).locator('.event-item.selected').press('b')
  67  |   await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  68  | 
  69  |   // Le second brin (inséré après le premier) doit avoir un badge non vide
  70  |   const newBrin = pane1(page).locator('.brin-item').nth(1)
  71  |   await expect(newBrin).toContainText('Nouveau Brin')
  72  |   await expect(newBrin.locator('.brin-badge')).not.toHaveText('')
  73  | })
  74  | 
  75  | // ─── Unicité badge (checkBadgeValue) ─────────────────────────────────────────
  76  | 
  77  | test("modifier le badge d'un brin vers une valeur déjà prise → notification immédiate + badge non modifié", async ({ page }) => {
  78  |   await openBrinPanel(page)
  79  |   // b1 badge=MON, b2 badge=AUT
  80  |   await pane1(page).locator('.brin-item.selected').press('Enter') // édite b1
  81  |   await pane1(page).locator('.brin-item.selected').press('Tab')   // title → badge
  82  |   // Taper AUT (déjà pris par b2) → notification immédiate, sans Enter
  83  |   await pane1(page).locator('.brin-item.selected [data-field="badge"]').fill('AUT')
  84  |   await expect(pane1(page).locator('.notification')).toBeVisible()
  85  |   await expect(pane1(page).locator('.notification')).toContainText(getErr(2010, 'AUT'))
  86  |   // Valider → badge doit être resté MON
  87  |   await pane1(page).locator('.brin-item.selected').press('Enter')
  88  |   await expect(pane1(page).locator('.brin-item').nth(0).locator('.brin-badge')).toHaveText('MON')
  89  | })
  90  | 
  91  | test("remettre son propre badge après changement temporaire → pas de notification", async ({ page }) => {
  92  |   await openBrinPanel(page)
  93  |   // Sélectionner b2 (badge=AUT)
  94  |   await pane1(page).locator('.brin-item.selected').press('ArrowDown')
  95  |   await pane1(page).locator('.brin-item.selected').press('Enter') // édite b2
  96  |   await pane1(page).locator('.brin-item.selected').press('Tab')   // title → badge
  97  |   // Changer vers PRE (pas encore Enter), puis remettre AUT
  98  |   await pane1(page).locator('.brin-item.selected [data-field="badge"]').fill('PRE')
  99  |   await pane1(page).locator('.brin-item.selected [data-field="badge"]').fill('AUT')
  100 |   // Pas de notification
  101 |   await expect(pane1(page).locator('.notification')).not.toBeVisible()
  102 | })
  103 | 
```