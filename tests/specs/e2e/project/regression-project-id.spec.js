/**
 * Tests de régression : project_id non propagé pour les sous-listers
 * Tous ces tests vérifient la PERSISTANCE (rechargement de page),
 * pas seulement le DOM immédiat.
 */
import { test, expect, pane1, press, getErr } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

// ── Helpers ────────────────────────────────────────────────────────────

async function enterProject(page) {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await expect(pane1(page).locator('.event-item').first()).toBeVisible()
}

// ── Events imbriqués ───────────────────────────────────────────────────

test('créer un event imbriqué → persiste après rechargement', async ({ page }) => {
  await enterProject(page)

  // Entrer dans le premier event (lister virtuel)
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()

  // Créer un sous-event
  await press(page, 'n')
  const input = pane1(page).locator('.event-item input[name="title"]')
  await expect(input).toBeFocused()
  await input.fill('Sous-event persistant')
  await press(page, 'Enter')
  await expect(pane1(page).locator('.event-item').first()).toContainText('Sous-event persistant')
  await page.waitForLoadState('networkidle')

  // Rechargement
  await page.reload()
  await enterProject(page)
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await expect(pane1(page).locator('.event-item').first()).toContainText('Sous-event persistant')
})

// ── Création brin ──────────────────────────────────────────────────────

test('créer un brin → persiste après rechargement', async ({ page }) => {
  await enterProject(page)

  // Ouvrir le panel brins
  await press(page, 'b')
  await expect(pane1(page).locator('#brins-panel')).toBeVisible()

  // Créer un nouveau brin
  await press(page, 'n')
  const input = pane1(page).locator('.brin-item input[name="title"]')
  await expect(input).toBeFocused()
  await input.fill('Brin régression')
  await press(page, 'Enter')

  // Vérification immédiate
  await expect(pane1(page).locator('.brin-item').filter({ hasText: 'Brin régression' })).toBeVisible()

  // Fermer le panel + rechargement
  await press(page, 'Meta+Enter')
  await page.reload()
  await enterProject(page)
  await press(page, 'b')
  await expect(pane1(page).locator('#brins-panel')).toBeVisible()

  // Le brin doit toujours être là
  await expect(pane1(page).locator('.brin-item').filter({ hasText: 'Brin régression' })).toBeVisible()
})

// ── Création perso ─────────────────────────────────────────────────────

test('créer un perso → persiste après rechargement', async ({ page }) => {
  await enterProject(page)

  // Ouvrir le panel persos
  await press(page, 'p')
  await expect(pane1(page).locator('#persos-panel')).toBeVisible()

  // Créer un nouveau perso
  await press(page, 'n')
  const input = pane1(page).locator('.perso-item input[name="title"]')
  await expect(input).toBeFocused()
  await input.fill('Perso régression')
  await press(page, 'Enter')

  // Vérification immédiate
  await expect(pane1(page).locator('.perso-item').filter({ hasText: 'Perso régression' })).toBeVisible()

  // Fermer le panel + rechargement
  await press(page, 'Meta+Enter')
  await page.reload()
  await enterProject(page)
  await press(page, 'p')
  await expect(pane1(page).locator('#persos-panel')).toBeVisible()

  // Le perso doit toujours être là
  await expect(pane1(page).locator('.perso-item').filter({ hasText: 'Perso régression' })).toBeVisible()
})

// ── ListerEvent depth-2 : brins/persos sans 500 ────────────────────────

test('entrer ListerEvent depth-2 → aucun 500 sur brins/persos', async ({ page }) => {
  const errors = []
  page.on('response', r => { if (r.status() >= 500) errors.push(r.url()) })

  await enterProject(page)
  await page.waitForLoadState('networkidle')
  errors.length = 0  // reset : seuls les 500 de depth-2 nous intéressent

  // Entrer dans le premier event (depth 2, parentItem = event, pas projet)
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await page.waitForLoadState('networkidle')

  expect(errors).toHaveLength(0)
})
