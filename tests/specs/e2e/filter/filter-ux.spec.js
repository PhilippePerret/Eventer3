import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

// ── Badge FILTRE : couleur selon état ─────────────────────────────

test.describe('badge FILTRE dans la barre d\'état — couleur selon état', () => {
  test.beforeEach(() => { installFixtures('filter-events') })

  async function enterListerEvent(page) {
    await page.goto('/')
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
  }

  test('badge FILTRE vert dès Cmd+: (mode filtre activé)', async ({ page }) => {
    await enterListerEvent(page)
    await press(page, 'Meta+:')
    await expect(pane1(page).locator('.status-filter-badge--mode')).toBeVisible()
  })

  test('badge FILTRE reste vert si aucun item masqué', async ({ page }) => {
    await enterListerEvent(page)
    await press(page, 'Meta+:')
    await press(page, 't')
    // "bal" → 2 visibles, 2 masqués — mais d'abord tester avec terme qui masque rien
    // "a" → tous contiennent "a" (Scène du bAl, Arrivée à Paris, lA trAhison, Retour Au bAl)
    await pane1(page).locator('#filter-input').fill('a')
    await expect(pane1(page).locator('.status-filter-badge--mode')).toBeVisible()
    await expect(pane1(page).locator('.status-filter-badge--active')).not.toBeVisible()
  })

  test('badge FILTRE rouge quand items masqués', async ({ page }) => {
    await enterListerEvent(page)
    await press(page, 'Meta+:')
    await press(page, 't')
    // "Paris" → seul "Arrivée à Paris" correspond → 3 masqués
    await pane1(page).locator('#filter-input').fill('Paris')
    await expect(pane1(page).locator('.status-filter-badge--active')).toBeVisible()
  })

  test('badge FILTRE rouge après Enter quand items masqués', async ({ page }) => {
    await enterListerEvent(page)
    await press(page, 'Meta+:')
    await press(page, 't')
    await pane1(page).locator('#filter-input').fill('Paris')
    await press(page, 'Enter')
    await expect(pane1(page).locator('.status-filter-badge--active')).toBeVisible()
  })

  test('badge FILTRE absent après Escape dans l\'input', async ({ page }) => {
    await enterListerEvent(page)
    await press(page, 'Meta+:')
    await press(page, 't')
    await pane1(page).locator('#filter-input').fill('Paris')
    await press(page, 'Escape')
    await expect(pane1(page).locator('.status-filter-badge--mode')).not.toBeVisible()
    await expect(pane1(page).locator('.status-filter-badge--active')).not.toBeVisible()
  })
})

// ── Panneau sélecteur : titre sans raccourcis clavier ─────────────

test.describe('panneau sélecteur de brins — présentation', () => {
  test.beforeEach(() => { installFixtures('filter-events') })

  async function enterListerEvent(page) {
    await page.goto('/')
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
  }

  test('titre du sélecteur sans raccourcis clavier', async ({ page }) => {
    await enterListerEvent(page)
    await press(page, 'Meta+:')
    await press(page, 'b')
    await expect(pane1(page).locator('#filter-selector-panel')).toBeVisible()
    await expect(pane1(page).locator('.filter-selector-title')).not.toContainText('↑↓')
    await expect(pane1(page).locator('.filter-selector-title')).not.toContainText('naviguer')
  })
})

// ── Input filtre texte : ne recouvre pas le premier item ──────────

test.describe('input filtre texte ne recouvre pas le contenu', () => {
  test.beforeEach(() => { installFixtures('filter-events') })

  async function enterListerEvent(page) {
    await page.goto('/')
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
  }

  test('premier item visible sous l\'input filtre (pas recouvert)', async ({ page }) => {
    await enterListerEvent(page)
    await press(page, 'Meta+:')
    await press(page, 't')

    const inputBox  = await pane1(page).locator('#filter-input').boundingBox()
    const firstItem = await pane1(page).locator('.event-item').first().boundingBox()
    // le haut du premier item doit être sous le bas de l'input
    expect(firstItem.y).toBeGreaterThan(inputBox.y + inputBox.height - 2)
  })
})

// ── Filtre texte : input positionné sur le lister actif ───────────

test.describe('position de l\'input selon le lister actif', () => {
  test.beforeEach(() => { installFixtures('filter-events') })

  async function enterListerEvent(page) {
    await page.goto('/')
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
  }

  test('input filter-text apparaît dans les limites du lister actif (events)', async ({ page }) => {
    await enterListerEvent(page)

    const panelRect = await pane1(page).locator('#events-panel').boundingBox()

    await press(page, 'Meta+:')
    await press(page, 't')

    const inputRect = await pane1(page).locator('#filter-input').boundingBox()
    // l'input doit commencer au niveau vertical du lister (± 2px)
    expect(inputRect.y).toBeCloseTo(panelRect.y, -1)
  })
})

// ── Filtre brins : notification si aucun brin ─────────────────────

test.describe('filtre brins sans brins disponibles', () => {
  test.beforeEach(() => { installFixtures('filter-no-brins') })

  async function enterListerEvent(page) {
    await page.goto('/')
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
  }

  test('Cmd+: puis b sans brins affiche notification', async ({ page }) => {
    await enterListerEvent(page)

    await press(page, 'Meta+:')
    await press(page, 'b')

    await expect(pane1(page).locator('#notification')).toBeVisible()
    await expect(pane1(page).locator('#notification')).toContainText('Aucun brin')
  })

  test('Cmd+: puis b sans brins ne montre pas le sélecteur', async ({ page }) => {
    await enterListerEvent(page)

    await press(page, 'Meta+:')
    await press(page, 'b')

    await expect(pane1(page).locator('#filter-selector-panel')).not.toBeVisible()
  })
})

// ── Barre d'état : indicateur FILTRE ─────────────────────────────

test.describe('indicateur FILTRE dans la barre d\'état', () => {
  test.beforeEach(() => { installFixtures('filter-events') })

  async function enterListerEvent(page) {
    await page.goto('/')
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
  }

  test('status bar affiche FILTRE quand un filtre est actif', async ({ page }) => {
    await enterListerEvent(page)

    await press(page, 'Meta+:')
    await press(page, 't')
    await pane1(page).locator('#filter-input').fill('bal')
    await press(page, 'Enter')

    await expect(pane1(page).locator('#status-bar')).toContainText('FILTRE')
  })

  test('status bar n\'affiche plus FILTRE après effacement du filtre', async ({ page }) => {
    await enterListerEvent(page)

    await press(page, 'Meta+:')
    await press(page, 't')
    await pane1(page).locator('#filter-input').fill('bal')
    await press(page, 'Enter')

    await press(page, 'Meta+:')
    await press(page, ':')

    await expect(pane1(page).locator('#status-bar')).not.toContainText('FILTRE')
  })

  test('Escape dans l\'input efface le filtre et retire FILTRE du status bar', async ({ page }) => {
    await enterListerEvent(page)

    await press(page, 'Meta+:')
    await press(page, 't')
    await pane1(page).locator('#filter-input').fill('bal')
    await press(page, 'Escape')

    await expect(pane1(page).locator('#status-bar')).not.toContainText('FILTRE')
  })
})
