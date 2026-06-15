import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1 } from '../__setup__.js'

// Fixture depth-move :
//   Liste#2 (depth=1) : [e14 "Acte 1", e23 "Acte 2"]
//   Liste#3 (depth=2, enfant e14) : [e31 "Séquence 1", e45 "Séquence 2"]
//   Liste#4 (depth=3, enfant e31) : [e57 "Scène 1", e68 "Scène 2"]
//   Liste#5 (depth=2, enfant e23) : [e88 "Séquence 3"]

test.beforeEach(() => {
  installFixtures('depth-move')
})

async function enterProject(page) {
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  await page.keyboard.press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
}

test("mode LEVEL depth=2 : liste plate de tous les events depth=2", async ({ page }) => {
  await page.goto('/')
  await enterProject(page)

  console.log('\n=== TEST LEVEL MODE — DEPTH=2 ===')

  console.log('-> entrée dans e14 (Acte 1) → depth=2')
  await page.keyboard.press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')

  console.log('-> ⌘+m : passage en LEVEL mode')
  await page.keyboard.press('Meta+m')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')

  console.log('-> 3 items affichés : e31, e45 (Liste#3) + e88 (Liste#5)')
  await expect(pane1(page).locator('.event-item')).toHaveCount(3)
  await expect(pane1(page).locator('.event-item[data-id="e31"]')).toBeVisible()
  await expect(pane1(page).locator('.event-item[data-id="e45"]')).toBeVisible()
  await expect(pane1(page).locator('.event-item[data-id="e88"]')).toBeVisible()

  console.log('-> aucun item virtuel')
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)

  console.log('\n=== FIN ===\n')
})

test("mode LEVEL depth=3 : events réels + virtuels avec +N", async ({ page }) => {
  await page.goto('/')
  await enterProject(page)

  console.log('\n=== TEST LEVEL MODE — DEPTH=3 ===')

  console.log('-> entrée dans e14 → depth=2, puis e31 → depth=3')
  await page.keyboard.press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  await page.keyboard.press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '3')

  console.log('-> ⌘+m : passage en LEVEL mode')
  await page.keyboard.press('Meta+m')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')

  console.log('-> 4 items : e57, e68 (réels) + 2 virtuels (e45+1, e88+1)')
  await expect(pane1(page).locator('.event-item')).toHaveCount(4)
  await expect(pane1(page).locator('.event-item[data-id="e57"]')).toBeVisible()
  await expect(pane1(page).locator('.event-item[data-id="e68"]')).toBeVisible()

  console.log('-> 2 items virtuels avec texte "+1"')
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)
  await expect(pane1(page).locator('.event-item.virtual').nth(0)).toContainText('+1')
  await expect(pane1(page).locator('.event-item.virtual').nth(1)).toContainText('+1')

  console.log('-> items virtuels contiennent le titre de l\'event de référence')
  await expect(pane1(page).locator('.event-item.virtual').nth(0)).toContainText('Séquence 2')
  await expect(pane1(page).locator('.event-item.virtual').nth(1)).toContainText('Séquence 3')

  console.log('\n=== FIN ===\n')
})

test("items virtuels non sélectionnables au clavier", async ({ page }) => {
  await page.goto('/')
  await enterProject(page)

  await page.keyboard.press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  await page.keyboard.press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '3')
  await page.keyboard.press('Meta+m')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')

  console.log('-> LEVEL mode actif : 4 items dont 2 virtuels')
  await expect(pane1(page).locator('.event-item')).toHaveCount(4)
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)

  console.log('-> ↓ navigue uniquement sur les items réels, saute les virtuels')
  await expect(pane1(page).locator('.event-item[data-id="e57"]')).toHaveClass(/selected/)
  await page.keyboard.press('ArrowDown')
  await expect(pane1(page).locator('.event-item[data-id="e68"]')).toHaveClass(/selected/)
  await page.keyboard.press('ArrowDown')
  await expect(pane1(page).locator('.event-item[data-id="e68"]')).toHaveClass(/selected/)
})

test("entrer dans un item en mode LEVEL rebascule en NESTING", async ({ page }) => {
  await page.goto('/')
  await enterProject(page)

  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Meta+m')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')

  console.log('-> ArrowRight sur e31 : entre dans Liste#4, rebascule NESTING')
  await expect(pane1(page).locator('.event-item[data-id="e31"]')).toHaveClass(/selected/)
  await page.keyboard.press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '3')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')
})

// ─── Bug 1 : LEVEL→NEST navigue vers l'item sélectionné ──────────────────────

test("LEVEL→NEST : retour dans le lister de l'item sélectionné (e88 sous Acte 2)", async ({ page }) => {
  await page.goto('/')
  await enterProject(page)
  await page.keyboard.press('ArrowRight')  // depth 2 (sous Acte 1)
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')

  await page.keyboard.press('Meta+m')  // LEVEL mode
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
  await expect(pane1(page).locator('.event-item')).toHaveCount(3)  // attendre fin render async

  // Sélectionner e88 (3e item : e31, e45, e88)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await expect(pane1(page).locator('.event-item[data-id="e88"]')).toHaveClass(/selected/)

  await page.keyboard.press('Meta+m')  // retour NEST
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')

  // Doit être dans le lister de Acte 2 (depth=2), e88 sélectionné
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  await expect(pane1(page).locator('.event-item[data-id="e88"]')).toHaveClass(/selected/)
})

// ─── Bug 2 : LEVEL mode sur lister "man" ─────────────────────────────────────
// Fixture man-level-mode : depth-move + man_depth=2, nature='roman' dans project_meta
// Lister 3 (depth=2, sous e14) et Lister 5 (depth=2, sous e23) deviennent "man" via man_depth

test("man lister depth=2 (=man_depth) → LEVEL mode affiche items des listers man (cas normal)", async ({ page }) => {
  installFixtures('man-level-mode')
  await page.goto('/')
  await enterProject(page)
  await page.keyboard.press('ArrowRight')  // depth 2 (man lister, man_depth=2)
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')

  await page.keyboard.press('Meta+m')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')

  // e31, e45 (Liste#3), e88 (Liste#5), e99 (feuille sans lister enfant)
  await expect(pane1(page).locator('.event-item')).toHaveCount(4)
  await expect(pane1(page).locator('.event-item[data-id="e31"]')).toBeVisible()
  await expect(pane1(page).locator('.event-item[data-id="e45"]')).toBeVisible()
  await expect(pane1(page).locator('.event-item[data-id="e88"]')).toBeVisible()
  await expect(pane1(page).locator('.event-item[data-id="e99"]')).toBeVisible()
  // Pas d'items virtuels
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
})

// ─── Bug : lister nature='man' explicite avec depth ≠ man_depth ─────────────
// Fixture man-nature-explicit : depth-move + lister#3 nature='man', man_depth=3
// e14→lister#3(depth=2,nature='man')→[e31→lister#4(depth=3)→[e57,e68], e45]
// e23→lister#5(depth=2)→[e88]

test("lister nature='man' depth=2 et man_depth=3 → LEVEL mode collecte à man_depth=3", async ({ page }) => {
  installFixtures('man-nature-explicit')
  await page.goto('/')
  await enterProject(page)
  await page.keyboard.press('ArrowRight')  // depth 2 (lister#3, nature='man')
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')

  await page.keyboard.press('Meta+m')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')

  // targetDepth doit être man_depth=3 (pas this.depth=2)
  await expect(pane1(page).locator('.event-item[data-id="e57"]')).toBeVisible()
  await expect(pane1(page).locator('.event-item[data-id="e68"]')).toBeVisible()
  // e45 est dans le lister nature='man' sans enfant → item man valide → visible
  await expect(pane1(page).locator('.event-item[data-id="e45"]')).toBeVisible()
  // e31 a des enfants à depth=3 → remplacé par e57/e68 → non visible
  await expect(pane1(page).locator('.event-item[data-id="e31"]')).not.toBeVisible()
})

test("man LEVEL mode : item feuille sans lister enfant s'affiche non-virtuel (pas de '+N')", async ({ page }) => {
  installFixtures('man-level-mode')
  await page.goto('/')
  await enterProject(page)
  await page.keyboard.press('ArrowRight')  // depth 2 (man lister, man_depth=2)
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')

  await page.keyboard.press('Meta+m')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')

  // e99 = item feuille à depth=1 (pas de lister enfant) → doit apparaître sans "+1"
  const e99 = pane1(page).locator('.event-item[data-id="e99"]')
  await expect(e99).toBeVisible()
  await expect(e99).not.toHaveClass(/virtual/)
  await expect(e99).not.toContainText('+1')
})

test("depth=1 (<man_depth=2) → LEVEL mode affiche items depth=1 (comportement normal, pas man)", async ({ page }) => {
  installFixtures('man-level-mode')
  await page.goto('/')
  await enterProject(page)
  // Rester à depth=1 (root, pas man puisque 1 < man_depth=2)
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '1')

  await page.keyboard.press('Meta+m')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')

  // depth=1 < man_depth=2 → comportement normal : items depth=1 (e14, e23, e99)
  await expect(pane1(page).locator('.event-item')).toHaveCount(3)
  await expect(pane1(page).locator('.event-item[data-id="e14"]')).toBeVisible()
  await expect(pane1(page).locator('.event-item[data-id="e23"]')).toBeVisible()
  await expect(pane1(page).locator('.event-item[data-id="e99"]')).toBeVisible()
})
