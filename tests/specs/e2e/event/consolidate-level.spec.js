import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

// Fixture consolidate-level (copie de depth-move, dédiée à ce module) :
//   depth=3 : e57, e68 (réels) + "Séquence 2 +1" + "Séquence 3 +1"  — 2 virtuels

test.beforeEach(() => {
  installFixtures('consolidate-level-dup')
})

async function enterLevelMode(page, targetDepth) {
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  if (targetDepth >= 2) {
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '2')
  }
  if (targetDepth >= 3) {
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '3')
  }
  await press(page, 'Meta+m')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
}

test.skip("⌘+t ouvre le panneau d'outils en LEVEL mode", async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)

  await press(page, 'Meta+t')
  await expect(pane1(page).locator('.tools-panel')).toBeVisible()
})

test.skip("hors LEVEL mode : panneau outils s'ouvre sans l'outil Consolider", async ({ page }) => {
  await page.goto('/')

  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()

  await press(page, 'Meta+t')

  await expect(pane1(page).locator('.tools-panel')).toBeVisible()
  await expect(pane1(page).locator('.tools-panel')).not.toContainText('Consolider')
})

test.skip("panneau outils contient 'Consolider le niveau'", async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)

  await press(page, 'Meta+t')
  await expect(pane1(page).locator('.tools-panel')).toBeVisible()

  await expect(pane1(page).locator('.tools-panel')).toContainText('Consolider le niveau')
})

test.skip("consolidation via lettre dans le panneau outils", async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)

  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)

  await press(page, 'Meta+t')
  await expect(pane1(page).locator('.tools-panel')).toBeVisible()

  await press(page, 'c')
  await expect(pane1(page).locator('.tools-panel')).not.toBeVisible()

  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  await expect(pane1(page).locator('.event-item')).toHaveCount(4)
})

test.skip("consolidation : titres des nouveaux events corrects", async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)

  await press(page, 'Meta+t')
  await press(page, 'c')
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  await expect(pane1(page).locator('.event-item')).toHaveCount(4)

  const titles = await pane1(page).locator('.event-item .event-title').allTextContents()
  expect(titles).toContain('Séquence 2 +1')
  expect(titles).toContain('Séquence 3 +1')
})

// ── BUG 2 : item virtuel au niveau ROOT non persistant ──────────────
// Fixture level-mode-mixed : e2 "Acte II" est virtuel au niveau ROOT (depth=1)
// Après consolidation, son lister_id doit être mis à jour en mémoire,
// sinon le prochain _collectItemsAtDepth voit encore lister_id=null → virtuel.
test.describe("persistance consolidation — item virtuel au niveau root", () => {
  test.beforeEach(() => {
    installFixtures('level-mode-mixed')
  })

  test.skip("consolidation item root-level : reste réel après toggle NESTING → LEVEL", async ({ page }) => {
    page.on('console', msg => process.stdout.write(`[BROWSER] ${msg.text()}\n`))

    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    await press(page, 'ArrowRight')
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '2')
    await press(page, 'Meta+m')
    await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')

    await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(1)
    await expect(pane1(page).locator('.event-item')).toHaveCount(3)

    await press(page, 'Meta+t')
    await press(page, 'c')
    await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
    await expect(pane1(page).locator('.event-item')).toHaveCount(3)

    await press(page, 'Meta+m')
    await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')

    await press(page, 'Meta+m')
    await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')

    await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
    await expect(pane1(page).locator('.event-item')).toHaveCount(3)
  })
})
