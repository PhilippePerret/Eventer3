import { test, expect } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

// Sur Mac AZERTY, Cmd+? = Meta+Shift+,
// Sur QWERTY,       Cmd+? = Meta+Shift+/
// Dans les deux cas event.key === '?' avec metaKey=true
// Playwright accepte Meta+? directement
const OPEN_KEY = 'Meta+?'

// ── Ouverture / fermeture ──────────────────────────────────────────

test('Cmd+? ouvre le panneau d\'aide contextuelle', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press(OPEN_KEY)
  await expect(page.locator('.contextual-help')).toBeVisible()
})

test('Escape ferme le panneau d\'aide contextuelle', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press(OPEN_KEY)
  await expect(page.locator('.contextual-help')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('.contextual-help')).not.toBeVisible()
})

test('le panneau fonctionne depuis n\'importe quel contexte (édition en cours)', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.project-item').first()).toBeVisible()
  await page.keyboard.press('Enter') // démarre l'édition du premier projet
  await expect(page.locator('.project-item input[name="title"]')).toBeFocused()
  // Cmd+? doit quand même ouvrir le panneau
  await page.keyboard.press(OPEN_KEY)
  await expect(page.locator('.contextual-help')).toBeVisible()
  // Escape ferme l'aide, l'édition est toujours active
  await page.keyboard.press('Escape')
  await expect(page.locator('.contextual-help')).not.toBeVisible()
})

// ── Contenu ────────────────────────────────────────────────────────

test('le panneau affiche le titre du contexte courant (liste de projets)', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.project-item').first()).toBeVisible()
  await page.keyboard.press(OPEN_KEY)
  await expect(page.locator('.contextual-help__title')).toContainText('Liste des projets')
})

test('le panneau liste les raccourcis du contexte courant', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.project-item').first()).toBeVisible()
  await page.keyboard.press(OPEN_KEY)
  // 'n' doit apparaître dans les raccourcis de project-list
  const rows = page.locator('.contextual-help__row')
  await expect(rows).not.toHaveCount(0)
  const keys = await page.locator('.contextual-help__key').allTextContents()
  expect(keys.some(k => k.includes('n'))).toBeTruthy()
})

test('les raccourcis other_contexts apparaissent avant les raccourcis propres', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.project-item').first()).toBeVisible()
  await page.keyboard.press(OPEN_KEY)
  // 'navigate-items' est other_context de 'project-list' → ↑↓ doivent apparaître
  const keys = await page.locator('.contextual-help__key').allTextContents()
  const arrowIdx = keys.findIndex(k => k.includes('↑') || k.includes('↓'))
  const nIdx     = keys.findIndex(k => k === 'n')
  expect(arrowIdx).toBeGreaterThanOrEqual(0)
  expect(nIdx).toBeGreaterThan(arrowIdx)
})

// ── Navigation dans le panneau ─────────────────────────────────────

test('flèche bas sélectionne le raccourci suivant', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.project-item').first()).toBeVisible()
  await page.keyboard.press(OPEN_KEY)
  const first  = page.locator('.contextual-help__row.selected')
  const firstKey = await first.locator('.contextual-help__key').textContent()
  await page.keyboard.press('ArrowDown')
  const second = page.locator('.contextual-help__row.selected')
  const secondKey = await second.locator('.contextual-help__key').textContent()
  expect(secondKey).not.toBe(firstKey)
})

test('Enter sur un raccourci l\'exécute (↓ → item suivant sélectionné)', async ({ page }) => {
  await page.goto('/')
  // Le premier projet est sélectionné par défaut (index 0)
  const firstProject = page.locator('.project-item').nth(0)
  await expect(firstProject).toHaveClass(/selected/)

  await page.keyboard.press(OPEN_KEY)
  // Naviguer jusqu'au raccourci '↓'
  const rows = page.locator('.contextual-help__row')
  const count = await rows.count()
  let found = false
  for (let i = 0; i < count; i++) {
    const keyText = await rows.nth(i).locator('.contextual-help__key').textContent()
    if (keyText?.includes('↓') && !keyText?.includes('⌘')) {
      // Amener la sélection sur cet item
      const selectedIdx = await page.locator('.contextual-help__row.selected').evaluateAll(
        (els, rows) => rows.indexOf(els[0]),
        await rows.all()
      ).catch(() => 0)
      // Naviguer jusqu'à i depuis 0
      for (let j = 0; j < i; j++) await page.keyboard.press('ArrowDown')
      found = true
      break
    }
  }

  await page.keyboard.press('Enter')
  await expect(page.locator('.contextual-help')).not.toBeVisible()

  // Le deuxième projet doit être sélectionné
  const secondProject = page.locator('.project-item').nth(1)
  await expect(secondProject).toHaveClass(/selected/)
})

// ── Footer vide ────────────────────────────────────────────────────

test('le footer d\'aide (ancien shortcuts-footer) est vide', async ({ page }) => {
  await page.goto('/')
  const footer = page.locator('#shortcuts-footer')
  await expect(footer).toHaveText('')
})
