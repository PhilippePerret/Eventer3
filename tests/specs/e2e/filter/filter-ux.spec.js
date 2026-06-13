import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

// ── Badge FILTRE : couleur selon état ─────────────────────────────

test.describe('badge FILTRE dans la barre d\'état — couleur selon état', () => {
  test.beforeEach(() => { installFixtures('filter-events') })

  async function enterEventLister(page) {
    await page.goto('/')
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
    await page.keyboard.press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  }

  test('badge FILTRE vert dès Cmd+: (mode filtre activé)', async ({ page }) => {
    await enterEventLister(page)
    await page.keyboard.press('Meta+:')
    await expect(pane1(page).locator('.status-filter-badge--mode')).toBeVisible()
  })

  test('badge FILTRE reste vert si aucun item masqué', async ({ page }) => {
    await enterEventLister(page)
    await page.keyboard.press('Meta+:')
    await page.keyboard.press('t')
    // "bal" → 2 visibles, 2 masqués — mais d'abord tester avec terme qui masque rien
    // "a" → tous contiennent "a" (Scène du bAl, Arrivée à Paris, lA trAhison, Retour Au bAl)
    await page.keyboard.type('a')
    await expect(pane1(page).locator('.status-filter-badge--mode')).toBeVisible()
    await expect(pane1(page).locator('.status-filter-badge--active')).not.toBeVisible()
  })

  test('badge FILTRE rouge quand items masqués', async ({ page }) => {
    await enterEventLister(page)
    await page.keyboard.press('Meta+:')
    await page.keyboard.press('t')
    // "Paris" → seul "Arrivée à Paris" correspond → 3 masqués
    await page.keyboard.type('Paris')
    await expect(pane1(page).locator('.status-filter-badge--active')).toBeVisible()
  })

  test('badge FILTRE rouge après Enter quand items masqués', async ({ page }) => {
    await enterEventLister(page)
    await page.keyboard.press('Meta+:')
    await page.keyboard.press('t')
    await page.keyboard.type('Paris')
    await page.keyboard.press('Enter')
    await expect(pane1(page).locator('.status-filter-badge--active')).toBeVisible()
  })

  test('badge FILTRE absent après Escape dans l\'input', async ({ page }) => {
    await enterEventLister(page)
    await page.keyboard.press('Meta+:')
    await page.keyboard.press('t')
    await page.keyboard.type('Paris')
    await page.keyboard.press('Escape')
    await expect(pane1(page).locator('.status-filter-badge--mode')).not.toBeVisible()
    await expect(pane1(page).locator('.status-filter-badge--active')).not.toBeVisible()
  })
})

// ── Panneau sélecteur : titre sans raccourcis clavier ─────────────

test.describe('panneau sélecteur de brins — présentation', () => {
  test.beforeEach(() => { installFixtures('filter-events') })

  async function enterEventLister(page) {
    await page.goto('/')
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
    await page.keyboard.press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  }

  test('titre du sélecteur sans raccourcis clavier', async ({ page }) => {
    await enterEventLister(page)
    await page.keyboard.press('Meta+:')
    await page.keyboard.press('b')
    await expect(pane1(page).locator('#filter-selector-panel')).toBeVisible()
    await expect(pane1(page).locator('.filter-selector-title')).not.toContainText('↑↓')
    await expect(pane1(page).locator('.filter-selector-title')).not.toContainText('naviguer')
  })
})

// ── Input filtre texte : ne recouvre pas le premier item ──────────

test.describe('input filtre texte ne recouvre pas le contenu', () => {
  test.beforeEach(() => { installFixtures('filter-events') })

  async function enterEventLister(page) {
    await page.goto('/')
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
    await page.keyboard.press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  }

  test('premier item visible sous l\'input filtre (pas recouvert)', async ({ page }) => {
    await enterEventLister(page)
    await page.keyboard.press('Meta+:')
    await page.keyboard.press('t')

    const inputBox  = await pane1(page).locator('#filter-input').boundingBox()
    const firstItem = await pane1(page).locator('.event-item').first().boundingBox()
    // le haut du premier item doit être sous le bas de l'input
    expect(firstItem.y).toBeGreaterThan(inputBox.y + inputBox.height - 2)
  })
})

// ── Filtre texte : input positionné sur le lister actif ───────────

test.describe('position de l\'input selon le lister actif', () => {
  test.beforeEach(() => { installFixtures('filter-events') })

  async function enterEventLister(page) {
    await page.goto('/')
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
    await page.keyboard.press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  }

  test('input filter-text apparaît dans les limites du lister actif (events)', async ({ page }) => {
    await enterEventLister(page)

    const panelRect = await pane1(page).locator('#main-panel').boundingBox()

    await page.keyboard.press('Meta+:')
    await page.keyboard.press('t')

    const inputRect = await pane1(page).locator('#filter-input').boundingBox()
    // l'input doit commencer au niveau vertical du lister (± 2px)
    expect(inputRect.y).toBeCloseTo(panelRect.y, -1)
  })
})

// ── Filtre brins : notification si aucun brin ─────────────────────

test.describe('filtre brins sans brins disponibles', () => {
  test.beforeEach(() => { installFixtures('filter-no-brins') })

  async function enterEventLister(page) {
    await page.goto('/')
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
    await page.keyboard.press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  }

  test('Cmd+: puis b sans brins affiche notification', async ({ page }) => {
    await enterEventLister(page)

    await page.keyboard.press('Meta+:')
    await page.keyboard.press('b')

    await expect(pane1(page).locator('#notification')).toBeVisible()
    await expect(pane1(page).locator('#notification')).toContainText('Aucun brin')
  })

  test('Cmd+: puis b sans brins ne montre pas le sélecteur', async ({ page }) => {
    await enterEventLister(page)

    await page.keyboard.press('Meta+:')
    await page.keyboard.press('b')

    await expect(pane1(page).locator('#filter-selector-panel')).not.toBeVisible()
  })
})

// ── Barre d'état : indicateur FILTRE ─────────────────────────────

test.describe('indicateur FILTRE dans la barre d\'état', () => {
  test.beforeEach(() => { installFixtures('filter-events') })

  async function enterEventLister(page) {
    await page.goto('/')
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
    await page.keyboard.press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  }

  test('status bar affiche FILTRE quand un filtre est actif', async ({ page }) => {
    await enterEventLister(page)

    await page.keyboard.press('Meta+:')
    await page.keyboard.press('t')
    await page.keyboard.type('bal')
    await page.keyboard.press('Enter')

    await expect(pane1(page).locator('#status-bar')).toContainText('FILTRE')
  })

  test('status bar n\'affiche plus FILTRE après effacement du filtre', async ({ page }) => {
    await enterEventLister(page)

    await page.keyboard.press('Meta+:')
    await page.keyboard.press('t')
    await page.keyboard.type('bal')
    await page.keyboard.press('Enter')

    await page.keyboard.press('Meta+:')
    await page.keyboard.press(':')

    await expect(pane1(page).locator('#status-bar')).not.toContainText('FILTRE')
  })

  test('Escape dans l\'input efface le filtre et retire FILTRE du status bar', async ({ page }) => {
    await enterEventLister(page)

    await page.keyboard.press('Meta+:')
    await page.keyboard.press('t')
    await page.keyboard.type('bal')
    await page.keyboard.press('Escape')

    await expect(pane1(page).locator('#status-bar')).not.toContainText('FILTRE')
  })
})
