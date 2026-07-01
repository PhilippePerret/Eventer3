// Origine : tests/specs/e2e/project/keyboard-delete.spec.js
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

// ─── PROJETS ───────────────────────────────────────────────────────────────
// many-projects : Projet A (index 0), Projet B (index 1), Projet C (index 2)

test.describe('Delete dans ListerProject', () => {

  test.beforeEach(() => installFixtures('many-projects'))

  test('Delete supprime le projet sélectionné', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    const items = pane1(page).locator('.project-item')
    const initialCount = await items.count()
    await press(page, 'Delete')
    await expect(items).toHaveCount(initialCount - 1)
  })

  test('la suppression du projet est persistante (rechargement)', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    const items = pane1(page).locator('.project-item')
    const initialCount = await items.count()
    await press(page, 'Delete')
    await expect(items).toHaveCount(initialCount - 1)
    await page.waitForLoadState('networkidle')
    await page.reload()
    await expect(items).toHaveCount(initialCount - 1)
  })


  test('quand un seul projet reste, le footer ne mentionne plus ⌦', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    const items = pane1(page).locator('.project-item')
    const initialCount = await items.count()
    for (let i = 0; i < initialCount - 1; i++) {
      await press(page, 'Delete')
      await expect(items).toHaveCount(initialCount - i - 1)
    }
    await expect(items).toHaveCount(1)
    await expect(pane1(page).locator('#shortcuts-footer')).not.toContainText('⌦')
  })

  test('quand un seul projet reste, Delete ne le supprime pas et affiche un message', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    const items = pane1(page).locator('.project-item')
    const initialCount = await items.count()
    for (let i = 0; i < initialCount - 1; i++) {
      await press(page, 'Delete')
      await expect(items).toHaveCount(initialCount - i - 1)
    }
    await expect(items).toHaveCount(1)
    await press(page, 'Delete')
    await expect(items).toHaveCount(1)
    await expect(pane1(page).locator('#notification')).toBeVisible()
  })

  test('La destruction du dernier projet sélectionne le nouveau dernier projet', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    const items = pane1(page).locator('.project-item')
    const initialCount = await items.count()
    expect(initialCount).toBeGreaterThanOrEqual(4)
    for (let i = 0; i < initialCount - 1; i++) {
      await press(page, 'ArrowDown')
    }
    await expect(items.last()).toHaveClass(/selected/)
    await press(page, 'Delete')
    await expect(items).toHaveCount(initialCount - 1)
    await expect(items.last()).toHaveClass(/selected/)
  })

})

// ─── PROJETS AVEC EVENTS ────────────────────────────────────────────────────
// two-projects-events : Projet 1 (index 0, 3 events), Projet 2 (index 1, 2 events)

test.describe('Delete dans ListerProject — cascade', () => {

  test.beforeEach(() => installFixtures('two-projects-events'))

  test('projet sans events → suppression directe, pas de dialog', async ({ page }) => {
    await installFixtures('many-projects')
    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    const items = pane1(page).locator('.project-item')
    const initialCount = await items.count()
    await press(page, 'Delete')
    await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
    await expect(items).toHaveCount(initialCount - 1)
  })

  test('projet avec events → dialog de confirmation cascade affiché', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    await press(page, 'Delete')
    await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  })

  test('dialog : mentionne le bon nombre d\'events (3)', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    await press(page, 'Delete')
    await expect(pane1(page).locator('.confirm-dialog__message')).toContainText('3')
  })

  test('dialog : Annuler → annulation, projet intact', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    const items = pane1(page).locator('.project-item')
    await press(page, 'Delete')
    await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
    await press(page, 'Tab')
    await press(page, 'Enter')
    await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
    await expect(items).toHaveCount(2)
  })

  test('dialog : saisie incorrecte → reste ouvert, projet intact', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    const items = pane1(page).locator('.project-item')
    await press(page, 'Delete')
    await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
    await pane1(page).locator('.confirm-dialog__input').fill('5')
    await press(page, 'Enter')
    await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
    await expect(items).toHaveCount(2)
  })

  test('dialog : saisie correcte (3) + Enter → projet et events détruits', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    const items = pane1(page).locator('.project-item')
    await press(page, 'Delete')
    await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
    await pane1(page).locator('.confirm-dialog__input').fill('3')
    await press(page, 'Enter')
    await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
    await expect(items).toHaveCount(1)
  })

})