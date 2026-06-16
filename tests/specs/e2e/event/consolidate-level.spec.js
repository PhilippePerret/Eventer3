import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

// Fixture consolidate-level (copie de depth-move, dédiée à ce module) :
//   depth=3 : e57, e68 (réels) + "Séquence 2 +1" + "Séquence 3 +1"  — 2 virtuels

test.beforeEach(() => {
  installFixtures('consolidate-level')
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

test("⌘+t ouvre le panneau d'outils en LEVEL mode", async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)

  await page.keyboard.press('Meta+t')
  await expect(pane1(page).locator('.tools-panel')).toBeVisible()
})

test("hors LEVEL mode : panneau outils s'ouvre sans l'outil Consolider", async ({ page }) => {
  await page.goto('/')

  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  await page.keyboard.press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)

  await page.keyboard.press('Meta+t')

  await expect(pane1(page).locator('.tools-panel')).toBeVisible()
  await expect(pane1(page).locator('.tools-panel')).not.toContainText('Consolider')
})

test("panneau outils contient 'Consolider le niveau'", async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)

  await page.keyboard.press('Meta+t')
  await expect(pane1(page).locator('.tools-panel')).toBeVisible()

  await expect(pane1(page).locator('.tools-panel')).toContainText('Consolider le niveau')
})

test("consolidation via lettre dans le panneau outils", async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)

  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)

  await page.keyboard.press('Meta+t')
  await expect(pane1(page).locator('.tools-panel')).toBeVisible()

  await page.keyboard.press('c')
  await expect(pane1(page).locator('.tools-panel')).not.toBeVisible()

  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  await expect(pane1(page).locator('.event-item')).toHaveCount(4)
})

test("consolidation : titres des nouveaux events corrects", async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)

  await page.keyboard.press('Meta+t')
  await page.keyboard.press('c')
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  await expect(pane1(page).locator('.event-item')).toHaveCount(4)

  const titles = await pane1(page).locator('.event-item .event-text').allTextContents()
  expect(titles).toContain('Séquence 2 +1')
  expect(titles).toContain('Séquence 3 +1')
})

test("consolidation : items restent réels après toggle NESTING → LEVEL", async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)

  await page.keyboard.press('Meta+t')
  await page.keyboard.press('c')
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  await expect(pane1(page).locator('.event-item')).toHaveCount(4)

  await page.keyboard.press('Meta+m')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')

  await page.keyboard.press('Meta+m')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')

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
    page.on('console', msg => process.stdout.write(`[BROWSER] ${msg.text()}\n`))

    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    await page.keyboard.press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    await page.keyboard.press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
    await page.keyboard.press('Meta+m')
    await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')

    await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(1)
    await expect(pane1(page).locator('.event-item')).toHaveCount(3)

    await page.keyboard.press('Meta+t')
    await page.keyboard.press('c')
    await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
    await expect(pane1(page).locator('.event-item')).toHaveCount(3)

    await page.keyboard.press('Meta+m')
    await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')

    await page.keyboard.press('Meta+m')
    await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')

    await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
    await expect(pane1(page).locator('.event-item')).toHaveCount(3)
  })
})
