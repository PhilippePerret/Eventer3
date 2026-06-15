import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

// Fixture depth-move :
//   depth=3 : e57, e68 (réels) + "Séquence 2 +1" + "Séquence 3 +1"  — 2 virtuels

test.beforeEach(() => {
  installFixtures('depth-move')
})

async function enterLevelMode(page, targetDepth) {
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  await page.keyboard.press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  if (targetDepth >= 2) {
    await page.keyboard.press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  }
  if (targetDepth >= 3) {
    await page.keyboard.press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '3')
  }
  await page.keyboard.press('Meta+m')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
}

test("⌘+k ouvre le panneau d'outils en LEVEL mode", async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)

  console.log('-> ⌘+k ouvre le panneau outils')
  await page.keyboard.press('Meta+k')
  await expect(pane1(page).locator('#tools-panel')).toBeVisible()
})

test("⌘+k inactif hors LEVEL mode", async ({ page }) => {
  await page.goto('/')

  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  await page.keyboard.press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)

  await page.keyboard.press('Meta+k')

  console.log('-> panneau outils doit exister dans le DOM mais rester caché')
  await expect(pane1(page).locator('#tools-panel')).toBeAttached()
  await expect(pane1(page).locator('#tools-panel')).not.toBeVisible()
})

test("panneau outils contient 'Consolider le niveau courant'", async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)

  await page.keyboard.press('Meta+k')
  await expect(pane1(page).locator('#tools-panel')).toBeVisible()

  console.log('-> outil consolidation listé avec sa lettre')
  await expect(pane1(page).locator('#tools-panel')).toContainText('Consolider le niveau courant')
})

test("consolidation via lettre dans le panneau outils", async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)

  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)

  await page.keyboard.press('Meta+k')
  await expect(pane1(page).locator('#tools-panel')).toBeVisible()

  console.log('-> touche C : exécute la consolidation, ferme le panneau')
  await page.keyboard.press('c')
  await expect(pane1(page).locator('#tools-panel')).not.toBeVisible()

  console.log('-> 0 virtuels, 4 items réels')
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  await expect(pane1(page).locator('.event-item')).toHaveCount(4)
})

test("consolidation : titres des nouveaux events corrects", async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)

  await page.keyboard.press('Meta+k')
  await page.keyboard.press('c')
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  await expect(pane1(page).locator('.event-item')).toHaveCount(4)

  console.log('-> nouveaux events : "Séquence 2 +1" et "Séquence 3 +1"')
  const titles = await pane1(page).locator('.event-item .event-text').allTextContents()
  expect(titles).toContain('Séquence 2 +1')
  expect(titles).toContain('Séquence 3 +1')
})

test("consolidation : items restent réels après toggle NESTING → LEVEL", async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)

  await page.keyboard.press('Meta+k')
  await page.keyboard.press('c')
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  await expect(pane1(page).locator('.event-item')).toHaveCount(4)

  console.log('-> ⌘+m : retour en NESTING')
  await page.keyboard.press('Meta+m')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')

  console.log('-> ⌘+m : retour en LEVEL')
  await page.keyboard.press('Meta+m')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')

  console.log('-> items consolidés restent réels (0 virtuels, 4 réels)')
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  await expect(pane1(page).locator('.event-item')).toHaveCount(4)
})

// ── BUG 2 : item virtuel au niveau ROOT non persistant ──────────────
// Fixture level-mode-mixed : e2 "Acte II" est virtuel au niveau ROOT (depth=1)
// Après consolidation, son lister_id doit être mis à jour en mémoire,
// sinon le prochain _collectItemsAtDepth voit encore lister_id=null → virtuel.
test.describe("persistance consolidation — item virtuel au niveau root", () => {
  test.beforeEach(() => {
    installFixtures('level-mode-mixed')
  })

  test("consolidation item root-level : reste réel après toggle NESTING → LEVEL", async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    await page.keyboard.press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    await page.keyboard.press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
    await page.keyboard.press('Meta+m')
    await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')

    console.log('-> 1 virtuel visible : Acte II +1')
    await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(1)
    await expect(pane1(page).locator('.event-item')).toHaveCount(3)

    console.log('-> ⌘+k puis c : consolide')
    await page.keyboard.press('Meta+k')
    await page.keyboard.press('c')
    await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
    await expect(pane1(page).locator('.event-item')).toHaveCount(3)

    console.log('-> ⌘+m : NESTING')
    await page.keyboard.press('Meta+m')
    await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')

    console.log('-> ⌘+m : LEVEL')
    await page.keyboard.press('Meta+m')
    await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')

    console.log('-> item Acte II +1 reste réel (0 virtuels)')
    await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
    await expect(pane1(page).locator('.event-item')).toHaveCount(3)
  })
})
