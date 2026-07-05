//Origine: tests/specs/e2e/panels/tools-panel.spec.js
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

// Fixture depth-move : events à profondeur 3 avec virtuels — même que consolidate-level

test.beforeEach(() => {
  installFixtures('depth-move')
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

// ── Ouverture / fermeture ────────────────────────────────────────────────────

test('⌘+t ouvre le panneau outils en mode LEVEL', async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)

  await press(page, 'Meta+t')
  await expect(pane1(page).locator('.tools-panel')).toBeVisible()
})

test('⌘+t hors mode LEVEL : ouvre le panneau sans l\'outil Consolider', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()

  await press(page, 'Meta+t')
  await expect(pane1(page).locator('.tools-panel')).toBeVisible()
  await expect(pane1(page).locator('.tools-panel')).not.toContainText('Consolider')
})

// ── Esthétique ───────────────────────────────────────────────────────────────

test('panneau outils : titre visible', async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)

  await press(page, 'Meta+t')
  await expect(pane1(page).locator('.tools-panel .ftpanel__title')).toBeVisible()
})

test('panneau outils : footer avec faux-boutons Fermer et Exécuter', async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)

  await press(page, 'Meta+t')
  const footer = pane1(page).locator('.tools-panel .ftpanel__footer')
  await expect(footer).toBeVisible()
  await expect(footer.locator('.ftpanel-btn--cancel')).toContainText('Fermer')
  await expect(footer.locator('.ftpanel-btn--primary')).toContainText('Exécuter')
})

test('panneau outils : item Consolider listé avec son raccourci ⌘⇧C', async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)

  await press(page, 'Meta+t')
  await expect(pane1(page).locator('.tools-panel .ftpanel__item').first()).toContainText('Consolider le niveau')
  await expect(pane1(page).locator('.tools-panel .ftpanel__item').first()).toContainText('⌘')
})

// ── TAB cycle ────────────────────────────────────────────────────────────────

test('TAB : items → Exécuter → Fermer → items', async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)
  await press(page, 'Meta+t')

  const panel = pane1(page).locator('.tools-panel')

  await expect(panel.locator('.ftpanel-btn--focused')).toHaveCount(0)

  await press(page, 'Tab')
  await expect(panel.locator('.ftpanel-btn--primary.ftpanel-btn--focused')).toBeVisible()
  await expect(panel.locator('.ftpanel-btn--cancel.ftpanel-btn--focused')).toHaveCount(0)

  await press(page, 'Tab')
  await expect(panel.locator('.ftpanel-btn--cancel.ftpanel-btn--focused')).toBeVisible()
  await expect(panel.locator('.ftpanel-btn--primary.ftpanel-btn--focused')).toHaveCount(0)

  await press(page, 'Tab')
  await expect(panel.locator('.ftpanel-btn--focused')).toHaveCount(0)
  await expect(panel.locator('.ftpanel__item.selected')).toBeVisible()
})

test('TAB + Enter sur Exécuter : consolide et ferme le panneau', async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)

  await press(page, 'Meta+t')
  await press(page, 'Tab')
  await expect(pane1(page).locator('.tools-panel .ftpanel-btn--primary.ftpanel-btn--focused')).toBeVisible()

  await press(page, 'Enter')
  await expect(pane1(page).locator('.tools-panel')).not.toBeAttached()
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
})

test('TAB + TAB + Enter sur Fermer : ferme sans consolider', async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)

  await press(page, 'Meta+t')
  await press(page, 'Tab')
  await press(page, 'Tab')
  await expect(pane1(page).locator('.tools-panel .ftpanel-btn--cancel.ftpanel-btn--focused')).toBeVisible()

  await press(page, 'Enter')
  await expect(pane1(page).locator('.tools-panel')).not.toBeAttached()
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)
})

// ── Exécution par lettre ─────────────────────────────────────────────────────

test('lettre C dans le panneau : consolide et ferme', async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)

  await press(page, 'Meta+t')
  await expect(pane1(page).locator('.tools-panel')).toBeVisible()
  await press(page, 'c')

  await expect(pane1(page).locator('.tools-panel')).not.toBeAttached()
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  await expect(pane1(page).locator('.event-item')).toHaveCount(4)
})

test('Enter sur item sélectionné : consolide et ferme', async ({ page }) => {
  await page.goto('/')
  await enterLevelMode(page, 3)
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)

  await press(page, 'Meta+t')
  await expect(pane1(page).locator('.tools-panel .ftpanel__item').nth(0)).toHaveClass(/selected/)
  await press(page, 'Enter')

  await expect(pane1(page).locator('.tools-panel')).not.toBeAttached()
  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
})

// ── Raccourci direct ─────────────────────────────────────────────────────────

test('⌘+⇧+C inactif hors mode LEVEL', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()

  await press(page, 'Meta+Shift+c')

  await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  await expect(pane1(page).locator('.tools-panel')).not.toBeAttached()
})
