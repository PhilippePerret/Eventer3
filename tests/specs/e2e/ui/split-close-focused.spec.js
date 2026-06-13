import { test, expect, pane1 } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'

test.beforeEach(() => installFixtures('with-links'))

async function gotoApp(page) {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
}

async function openSplit(page) {
  await page.keyboard.press('Alt+2')
  await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
  await expect(page.frameLocator('#pane-2').locator('.project-item').first()).toBeVisible()
}

// Navigue pane-2 jusqu'à e3 (sélectionné)
async function navigatePane2ToE3(page) {
  const pane2 = page.frameLocator('#pane-2')
  // Entrer dans le projet
  await pane2.locator('.project-item').first().click()
  await page.keyboard.press('ArrowRight')
  await expect(pane2.locator('.event-item').first()).toHaveClass(/selected/)
  // Re-cliquer pour rétablir focus CDP
  await pane2.locator('.event-item').first().click()
  // Descendre jusqu'à e3
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await expect(pane2.locator('.event-item[data-id="e3"]')).toHaveClass(/selected/)
}

// ─── Alt+0 avec pane-2 focusé ────────────────────────────────────────────────

test('Alt+0 pane-2 focusé → pane-1 navigue vers l\'item sélectionné dans pane-2', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  // pane-2 a le focus après chargement
  await navigatePane2ToE3(page)
  await page.keyboard.press('Alt+0')
  // pane-1 doit afficher e3 sélectionné
  await expect(pane1(page).locator('.event-item[data-id="e3"]')).toHaveClass(/selected/)
})

test('Alt+0 pane-2 focusé → pane-2 fermé', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await navigatePane2ToE3(page)
  await page.keyboard.press('Alt+0')
  await expect(page.locator('#pane-2')).not.toBeVisible()
})

test('Alt+0 pane-2 focusé → focus revient sur pane-1', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  await navigatePane2ToE3(page)
  await page.keyboard.press('Alt+0')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
})

// ─── Alt+0 avec pane-1 focusé (comportement inchangé) ───────────────────────

test('Alt+0 pane-1 focusé → pane-1 reste dans son état courant', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  // Revenir sur pane-1
  await page.keyboard.press('Alt+1')
  await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  // pane-1 est sur la liste de projets
  await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  await page.keyboard.press('Alt+0')
  // pane-1 reste avec le projet sélectionné (pas de navigation forcée)
  await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
})

// ─── Cas ProjectLister en pane-2, EventLister en pane-1 ──────────────────────

test('Alt+0 pane-2 niveau projets, pane-1 en EventLister → pane-1 revient à la liste projets', async ({ page }) => {
  await gotoApp(page)
  await openSplit(page)
  // pane-1 : entrer dans le projet (EventLister)
  await page.keyboard.press('Alt+1')
  await pane1(page).locator('.project-item').first().click()
  await page.keyboard.press('ArrowRight')
  await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
  // pane-2 : rester au niveau projets, cliquer pour obtenir CDP focus
  const pane2 = page.frameLocator('#pane-2')
  await pane2.locator('.project-item').first().click()
  // Alt+0 depuis pane-2 (niveau projets — currentState lu depuis activeLister)
  await page.keyboard.press('Alt+0')
  // pane-1 doit revenir à la liste des projets
  await expect(pane1(page).locator('.project-item').first()).toBeVisible()
  await expect(pane1(page).locator('.event-item').first()).not.toBeVisible()
})
