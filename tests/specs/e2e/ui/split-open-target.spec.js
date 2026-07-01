import { test, expect, pane1, press, getErr } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'

test.beforeEach(() => installFixtures('with-links'))

async function gotoApp(page) {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
}

// Ouvre le split et navigue pane-1 jusqu'à e5 (qui a un lien vers e3)
async function setupLinkOnE5(page) {
  await gotoApp(page)
  // Ouvrir split
  await press(page, 'Alt+2')
  await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
  await expect(page.frameLocator('#pane-2').locator('.project-item').first()).toBeVisible()
  // Entrer dans le projet (e1, e2, e3) depuis pane-1 via click
  await pane1(page).locator('.project-item').first().click()
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
  // Re-cliquer pour rétablir le focus CDP après changement de lister
  await pane1(page).locator('.event-item').first().click()
  // Entrer dans e1 → e4,e5,e6,e7
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
  // Re-cliquer, puis descendre sur e5
  await pane1(page).locator('.event-item').first().click()
  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.event-item[data-id="e5"]')).toHaveClass(/selected/)
  // Tab → sélectionner le lien dans e5
  await press(page, 'Tab')
}

// Navigue vers e5 SANS split actif
async function navigateToE5NoSplit(page) {
  await gotoApp(page)
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
  await pane1(page).locator('.event-item').first().click()
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
  await pane1(page).locator('.event-item').first().click()
  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.event-item[data-id="e5"]')).toHaveClass(/selected/)
  await press(page, 'Tab')
}

// ─── Popup ────────────────────────────────────────────────────────────────────

test('split actif : popup affiche "Dans l\'autre fenêtre"', async ({ page }) => {
  await setupLinkOnE5(page)
  await press(page, 'o')
  await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  await expect(pane1(page).locator('.link-open-popup')).toContainText("Dans l'autre fenêtre")
})

test('split inactif : popup affiche "Dans une autre fenêtre"', async ({ page }) => {
  await navigateToE5NoSplit(page)
  await press(page, 'o')
  await expect(pane1(page).locator('.link-open-popup')).toContainText("Dans une autre fenêtre")
})

// ─── Navigation dans l'autre pane ─────────────────────────────────────────────

test('touche a → pane-2 affiche e3 (Acte III) sélectionné', async ({ page }) => {
  await setupLinkOnE5(page)
  await press(page, 'o')
  await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  await press(page, 'a')
  // pane-2 doit montrer e3 sélectionné
  const pane2 = page.frameLocator('#pane-2')
  await expect(pane2.locator('.event-item.selected')).toContainText('Acte III')
})

test('touche a → focus passe sur pane-2', async ({ page }) => {
  await setupLinkOnE5(page)
  await press(page, 'o')
  await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  await press(page, 'a')
  await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
})

// ─── Sans split : 'a' ouvre le split puis navigue ─────────────────────────────

test('sans split, touche a → popup direction apparaît', async ({ page }) => {
  await navigateToE5NoSplit(page)
  await press(page, 'o')
  await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  await press(page, 'a')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
})

test('sans split, touche a + Vertical → pane-2 affiche e3 sélectionné', async ({ page }) => {
  await navigateToE5NoSplit(page)
  await press(page, 'o')
  await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  await press(page, 'a')
  await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
  const pane2 = page.frameLocator('#pane-2')
  await expect(pane2.locator('.event-item.selected')).toContainText('Acte III')
})

test('sans split, touche a + Vertical → focus passe sur pane-2', async ({ page }) => {
  await navigateToE5NoSplit(page)
  await press(page, 'o')
  await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  await press(page, 'a')
  await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
  await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
})
