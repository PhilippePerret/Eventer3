import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

// Fixture depth-move : events à profondeur 3 avec virtuels — même que consolidate-level

test.beforeEach(() => {
  installFixtures('depth-move')
})

async function enterLevelMode(page, targetDepth) {
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  if (targetDepth >= 2) {
    await pane1(page).locator('#main-panel').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  }
  if (targetDepth >= 3) {
    await pane1(page).locator('#main-panel').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '3')
  }
  await pane1(page).locator('#main-panel').press('Meta+m')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
}

// ── Ouverture / fermeture ────────────────────────────────────────────────────

test('⌘+t ouvre le panneau outils en mode LEVEL', async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)

  await pane1(page).locator('#main-panel').press('Meta+t')
  await expect(pane1(page).locator('.tools-panel')).toBeVisible()
})

test('⌘+t hors mode LEVEL : ouvre le panneau sans l\'outil Consolider', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)

  await pane1(page).locator('#main-panel').press('Meta+t')
  await expect(pane1(page).locator('.tools-panel')).toBeVisible()
  await expect(pane1(page).locator('.tools-panel')).not.toContainText('Consolider')
})

// ── Esthétique ───────────────────────────────────────────────────────────────

test('panneau outils : titre visible', async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)

  await pane1(page).locator('#main-panel').press('Meta+t')
  await expect(pane1(page).locator('.tools-panel .floating-panel__title')).toBeVisible()
})

test('panneau outils : footer avec faux-boutons Fermer et Exécuter', async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)

  await pane1(page).locator('#main-panel').press('Meta+t')
  const footer = pane1(page).locator('.tools-panel .floating-panel__footer')
  await expect(footer).toBeVisible()
  await expect(footer.locator('.panel-btn--cancel')).toContainText('Fermer')
  await expect(footer.locator('.panel-btn--primary')).toContainText('Exécuter')
})

test('panneau outils : item Consolider listé avec son raccourci ⌘⇧C', async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)

  await pane1(page).locator('#main-panel').press('Meta+t')
  await expect(pane1(page).locator('.tools-panel .floating-panel__item').first()).toContainText('Consolider le niveau')
  await expect(pane1(page).locator('.tools-panel .floating-panel__item').first()).toContainText('⌘')
})

// ── TAB cycle ────────────────────────────────────────────────────────────────

test('TAB : items → Exécuter → Fermer → items', async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)
  await pane1(page).locator('#main-panel').press('Meta+t')

  const panel = pane1(page).locator('.tools-panel')

  console.log('-> aucun faux-bouton focusé à l\'ouverture')
  await expect(panel.locator('.panel-btn--focused')).toHaveCount(0)

  console.log('-> TAB #1 : Exécuter focusé')
  await pane1(page).locator('#main-panel').press('Tab')
  await expect(panel.locator('.panel-btn--primary.panel-btn--focused')).toBeVisible()
  await expect(panel.locator('.panel-btn--cancel.panel-btn--focused')).toHaveCount(0)

  console.log('-> TAB #2 : Fermer focusé')
  await pane1(page).locator('#main-panel').press('Tab')
  await expect(panel.locator('.panel-btn--cancel.panel-btn--focused')).toBeVisible()
  await expect(panel.locator('.panel-btn--primary.panel-btn--focused')).toHaveCount(0)

  console.log('-> TAB #3 : retour aux items, aucun bouton focusé')
  await pane1(page).locator('#main-panel').press('Tab')
  await expect(panel.locator('.panel-btn--focused')).toHaveCount(0)
  await expect(panel.locator('.floating-panel__item.selected')).toBeVisible()
})

test('TAB + Enter sur Exécuter : consolide et ferme le panneau', async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)

  await pane1(page).locator('#main-panel').press('Meta+t')
  await pane1(page).locator('#main-panel').press('Tab')
  await expect(pane1(page).locator('.tools-panel .panel-btn--primary.panel-btn--focused')).toBeVisible()

  await pane1(page).locator('#main-panel').press('Enter')
  await expect(pane1(page).locator('.tools-panel')).not.toBeAttached()
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
})

test('TAB + TAB + Enter sur Fermer : ferme sans consolider', async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)

  await pane1(page).locator('#main-panel').press('Meta+t')
  await pane1(page).locator('#main-panel').press('Tab')
  await pane1(page).locator('#main-panel').press('Tab')
  await expect(pane1(page).locator('.tools-panel .panel-btn--cancel.panel-btn--focused')).toBeVisible()

  await pane1(page).locator('#main-panel').press('Enter')
  await expect(pane1(page).locator('.tools-panel')).not.toBeAttached()
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)
})

// ── Exécution par lettre ─────────────────────────────────────────────────────

test('lettre C dans le panneau : consolide et ferme', async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)

  await pane1(page).locator('#main-panel').press('Meta+t')
  await expect(pane1(page).locator('.tools-panel')).toBeVisible()
  await pane1(page).locator('#main-panel').press('c')

  await expect(pane1(page).locator('.tools-panel')).not.toBeAttached()
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  await expect(pane1(page).locator('.event-item')).toHaveCount(4)
})

test('Enter sur item sélectionné : consolide et ferme', async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)

  await pane1(page).locator('#main-panel').press('Meta+t')
  await expect(pane1(page).locator('.tools-panel .floating-panel__item').nth(0)).toHaveClass(/selected/)
  await pane1(page).locator('#main-panel').press('Enter')

  await expect(pane1(page).locator('.tools-panel')).not.toBeAttached()
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
})

// ── Raccourci direct ─────────────────────────────────────────────────────────

test('⌘+⇧+C direct : consolide sans ouvrir le panneau', async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)

  await pane1(page).locator('#main-panel').press('Meta+Shift+c')

  await expect(pane1(page).locator('.tools-panel')).not.toBeAttached()
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  await expect(pane1(page).locator('.event-item')).toHaveCount(4)
})

test('⌘+⇧+C inactif hors mode LEVEL', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)

  await pane1(page).locator('#main-panel').press('Meta+Shift+c')

  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  await expect(pane1(page).locator('.tools-panel')).not.toBeAttached()
})
