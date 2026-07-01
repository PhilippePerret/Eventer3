// Origine: tests/specs/e2e/app/contextual-help.spec.js
import { test, expect, pane1, press, getErr } from '../__setup__.js'
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
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, OPEN_KEY)
  await expect(pane1(page).locator('.contextual-help')).toBeVisible()
})

test('⌘+Enter ferme le panneau d\'aide contextuelle', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, OPEN_KEY)
  await expect(pane1(page).locator('.contextual-help')).toBeVisible()
  await press(page, 'Meta+Enter')
  await expect(pane1(page).locator('.contextual-help')).not.toBeVisible()
})

test('Tab+Tab+Enter ferme le panneau d\'aide contextuelle', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, OPEN_KEY)
  await expect(pane1(page).locator('.contextual-help')).toBeVisible()
  await press(page, 'Tab')
  await press(page, 'Tab')
  await press(page, 'Enter')
  await expect(pane1(page).locator('.contextual-help')).not.toBeVisible()
})

test('le panneau fonctionne depuis n\'importe quel contexte (édition en cours)', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').first()).toBeVisible()
  await press(page, 'Enter')
  await expect(pane1(page).locator('.project-item.editing')).toBeVisible()
  await press(page, OPEN_KEY)
  await expect(pane1(page).locator('.contextual-help')).toBeVisible()
  await press(page, 'Meta+Enter')
  await expect(pane1(page).locator('.contextual-help')).not.toBeVisible()
  await expect(pane1(page).locator('.project-item.editing')).toBeVisible()
})

// ── Contenu ────────────────────────────────────────────────────────

test('le panneau affiche le titre du contexte courant (liste de projets)', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').first()).toBeVisible()
  await press(page, OPEN_KEY)
  await expect(pane1(page).locator('.ftpanel__title')).toContainText('Liste des projets')
})

test('le panneau liste les raccourcis du contexte courant', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').first()).toBeVisible()
  await press(page, OPEN_KEY)
  const rows = pane1(page).locator('.contextual-help__row')
  await expect(rows).not.toHaveCount(0)
  const keys = await pane1(page).locator('.contextual-help__key').allTextContents()
  expect(keys.some(k => k.includes('n'))).toBeTruthy()
})

test('les raccourcis other_contexts apparaissent avant les raccourcis propres', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').first()).toBeVisible()
  await press(page, OPEN_KEY)
  const keys = await pane1(page).locator('.contextual-help__key').allTextContents()
  const arrowIdx = keys.findIndex(k => k.includes('↑') || k.includes('↓'))
  const nIdx     = keys.findIndex(k => k === 'n')
  expect(arrowIdx).toBeGreaterThanOrEqual(0)
  expect(nIdx).toBeGreaterThan(arrowIdx)
})

// ── Navigation dans le panneau ─────────────────────────────────────

test('flèche bas sélectionne le raccourci suivant', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').first()).toBeVisible()
  await press(page, OPEN_KEY)
  const first    = pane1(page).locator('.contextual-help__row.selected')
  const firstKey = await first.locator('.contextual-help__key').textContent()
  await press(page, 'ArrowDown')
  const second    = pane1(page).locator('.contextual-help__row.selected')
  const secondKey = await second.locator('.contextual-help__key').textContent()
  expect(secondKey).not.toBe(firstKey)
})

test('Enter sur un raccourci l\'exécute (↓ → item suivant sélectionné)', async ({ page }) => {
  await page.goto('/')
  const firstProject = pane1(page).locator('.project-item').nth(0)
  await expect(firstProject).toHaveClass(/selected/)

  await press(page, OPEN_KEY)
  const rows = pane1(page).locator('.contextual-help__row')
  const count = await rows.count()
  for (let i = 0; i < count; i++) {
    const keyText = await rows.nth(i).locator('.contextual-help__key').textContent()
    if (keyText?.includes('↓') && !keyText?.includes('⌘')) {
      for (let j = 0; j < i; j++) await press(page, 'ArrowDown')
      break
    }
  }

  await press(page, 'Enter')
  await expect(pane1(page).locator('.contextual-help')).not.toBeVisible()

  const secondProject = pane1(page).locator('.project-item').nth(1)
  await expect(secondProject).toHaveClass(/selected/)
})

// ── Footer vide ────────────────────────────────────────────────────

test('le footer d\'aide (ancien shortcuts-footer) est vide', async ({ page }) => {
  await page.goto('/')
  const footer = pane1(page).locator('#shortcuts-footer')
  await expect(footer).toHaveText('')
})

// ── except ────────────────────────────────────────────────────────

test('project-list : ␣ absent (except depuis with-selected)', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, OPEN_KEY)
  const keys = await pane1(page).locator('.contextual-help__key').allTextContents()
  expect(keys.some(k => k === '␣')).toBeFalsy()
})

// ── Clipboard paste ───────────────────────────────────────────────

test('⌘+v apparaît dans l\'aide si clipboard compatible (après ⌘+c)', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'Meta+c')
  await press(page, OPEN_KEY)
  const keys = await pane1(page).locator('.contextual-help__key').allTextContents()
  expect(keys.some(k => k.includes('v'))).toBeTruthy()
})

test('⌘+v absent de l\'aide si clipboard vide', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, OPEN_KEY)
  const keys = await pane1(page).locator('.contextual-help__key').allTextContents()
  expect(keys.some(k => k.includes('v'))).toBeFalsy()
})

test('⌘+v absent si clipboard incompatible (brin copié, panneau persos)', async ({ page }) => {
  installFixtures('with-brins-and-persos')
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').first()).toBeVisible()
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await press(page, 'b')
  await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  await press(page, 'Meta+c')
  await press(page, 'p')
  await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  await press(page, OPEN_KEY)
  const keys = await pane1(page).locator('.contextual-help__key').allTextContents()
  expect(keys.some(k => k.includes('v'))).toBeFalsy()
})

// ── Templates wf ───────────────────────────────────────────────────

test('project-list : "{wf.Thing} précédent" résolu en "Projet précédent"', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, OPEN_KEY)
  const effects = await pane1(page).locator('.contextual-help__effect').allTextContents()
  expect(effects.some(e => e === 'Projet précédent')).toBeTruthy()
})

test('project-list : "{wf.Thing} suivant" résolu en "Projet suivant"', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, OPEN_KEY)
  const effects = await pane1(page).locator('.contextual-help__effect').allTextContents()
  expect(effects.some(e => e === 'Projet suivant')).toBeTruthy()
})

test('project-list : with-selected résolu avec "projet" (wf.mot fallback)', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, OPEN_KEY)
  const effects = await pane1(page).locator('.contextual-help__effect').allTextContents()
  expect(effects.some(e => e.includes('projet'))).toBeTruthy()
})

test('event-list : "{wf.Thing} précédent" résolu en "Évènement précédent"', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await press(page, OPEN_KEY)
  const effects = await pane1(page).locator('.contextual-help__effect').allTextContents()
  expect(effects.some(e => e === 'Évènement précédent')).toBeTruthy()
})

test('aucun placeholder {wf.*} ne reste dans le rendu', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, OPEN_KEY)
  const fullText = await pane1(page).locator('.contextual-help').textContent()
  expect(fullText).not.toMatch(/\{wf\.\w+\}/)
})
