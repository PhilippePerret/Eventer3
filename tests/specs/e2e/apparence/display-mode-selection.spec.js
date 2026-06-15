import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect, pane1 } from '../__setup__.js'

// Fixture depth-move :
//   Liste#2 (depth=1) : [e14 "Acte 1", e23 "Acte 2"]
//   Liste#3 (depth=2, enfant e14) : [e31 "Séquence 1", e45 "Séquence 2"]
//   Liste#4 (depth=3, enfant e31) : [e57 "Scène 1", e68 "Scène 2"]
//   Liste#5 (depth=2, enfant e23) : [e88 "Séquence 3"]

test.beforeEach(() => {
  installFixtures('depth-move')
})

async function enterProject(page) {
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  await page.keyboard.press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
}

// ─── Bug 1 : item sélectionné préservé au toggle LEVEL ───────────────────────

test("Bug 1 — LEVEL : item sélectionné initialement reste sélectionné", async ({ page }) => {
  await page.goto('/')
  await enterProject(page)
  await page.keyboard.press('ArrowRight')  // depth=2 (lister#3 : e31, e45)
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')

  // Sélectionner e45 (2e item, pas le premier)
  await page.keyboard.press('ArrowDown')
  await expect(pane1(page).locator('.event-item[data-id="e45"]')).toHaveClass(/selected/)

  // Toggle LEVEL
  await page.keyboard.press('Meta+m')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
  await expect(pane1(page).locator('.event-item')).toHaveCount(3)  // attendre render async

  // e45 doit rester sélectionné (pas e31 qui est le premier)
  await expect(pane1(page).locator('.event-item[data-id="e45"]')).toHaveClass(/selected/)
  await expect(pane1(page).locator('.event-item[data-id="e31"]')).not.toHaveClass(/selected/)
})

// ─── Bug 2b : ← en LEVEL mode navigue vers le lister de l'item LEVEL sélectionné ──

test("Bug 2b — LEVEL + ← : navigue vers le lister de l'item sélectionné (pas leaveToParent du lister courant)", async ({ page }) => {
  await page.goto('/')
  await enterProject(page)
  await page.keyboard.press('ArrowRight')  // depth=2 (lister#3 : e31, e45)
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')

  await page.keyboard.press('Meta+m')  // LEVEL mode
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
  await expect(pane1(page).locator('.event-item')).toHaveCount(3)

  // Naviguer à e88 (dans lister#5, sous e23 — branche différente du lister courant lister#3)
  const e88 = pane1(page).locator('.event-item[data-id="e88"]')
  while (!(await e88.getAttribute('class')).includes('selected')) {
    await page.keyboard.press('ArrowDown')
  }
  await expect(e88).toHaveClass(/selected/)

  // ← doit naviguer vers le lister de e88 (lister#5, depth=2, sous e23), pas vers lister#2
  await page.keyboard.press('ArrowLeft')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')

  // lister#5 affiché (depth=2, sous e23), e88 sélectionné
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  await expect(pane1(page).locator('.event-item[data-id="e88"]')).toHaveClass(/selected/)
  // Dans lister#5, e31 et e45 ne sont pas visibles (ils sont dans lister#3)
  await expect(pane1(page).locator('.event-item[data-id="e31"]')).not.toBeVisible()
})

// ─── Bug 2 : NESTING←LEVEL utilise l'item sélectionné en LEVEL ───────────────

test("Bug 2 — NEST←LEVEL : item sélectionné en LEVEL détermine le lister (pas l'item initial)", async ({ page }) => {
  await page.goto('/')
  await enterProject(page)
  await page.keyboard.press('ArrowRight')  // depth=2 (lister#3 : e31, e45)
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')

  // Sélectionner e45 (2e item = item "initial" pour ce test)
  await page.keyboard.press('ArrowDown')
  await expect(pane1(page).locator('.event-item[data-id="e45"]')).toHaveClass(/selected/)

  // Toggle LEVEL
  await page.keyboard.press('Meta+m')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
  await expect(pane1(page).locator('.event-item')).toHaveCount(3)

  // Naviguer explicitement à e88 (dans un lister différent de e45)
  // En LEVEL : [e31, e45, e88] — sélectionner e88 quelle que soit la position de départ
  const e88 = pane1(page).locator('.event-item[data-id="e88"]')
  await expect(e88).toBeVisible()
  // ArrowDown jusqu'à e88
  while (!(await e88.getAttribute('class')).includes('selected')) {
    await page.keyboard.press('ArrowDown')
  }
  await expect(e88).toHaveClass(/selected/)

  // Toggle NESTING
  await page.keyboard.press('Meta+m')
  await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')

  // Doit être dans le lister de e88 (Liste#5, depth=2, sous e23)
  // e88 sélectionné — PAS e45 (qui est dans lister#3, sous e14)
  await expect(pane1(page).locator('.event-item[data-id="e88"]')).toHaveClass(/selected/)
  // Si on est dans lister#5, e45 n'est pas visible (il est dans lister#3)
  await expect(pane1(page).locator('.event-item[data-id="e45"]')).not.toBeVisible()
})
