// Origine : tests/specs/e2e/panels/panel-move.spec.js
//
// CES TESTS N'ONT PEUT-ÊTRE PLUS LIEU D'ÊTRE — fonctionnalité Ctrl+Shift+Arrow
// (déplacer les panneaux flottants) non implémentée dans la nouvelle architecture.
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('with-styles')
})

async function goToListerEvent(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
}

async function openStylePanel(page) {
  await goToListerEvent(page)
  await press(page, 's')
  await expect(pane1(page).locator('#style-panel')).toBeVisible()
}

// ─── Style panel ──────────────────────────────────────────────────────────────

test("Ctrl+Shift+↓ déplace le style panel de 50px vers le bas", async ({ page }) => {
  await openStylePanel(page)
  const before = await pane1(page).locator('#style-panel .lister-panel').boundingBox()
  await press(page, 'Control+Shift+ArrowDown')
  const after = await pane1(page).locator('#style-panel .lister-panel').boundingBox()
  expect(Math.round(after.y - before.y)).toBe(50)
})

test("Ctrl+Shift+↑ déplace le style panel de 50px vers le haut", async ({ page }) => {
  await openStylePanel(page)
  const before = await pane1(page).locator('#style-panel .lister-panel').boundingBox()
  await press(page, 'Control+Shift+ArrowUp')
  const after = await pane1(page).locator('#style-panel .lister-panel').boundingBox()
  expect(Math.round(before.y - after.y)).toBe(50)
})

test("Ctrl+Shift+→ déplace le style panel de 50px vers la droite", async ({ page }) => {
  await openStylePanel(page)
  const before = await pane1(page).locator('#style-panel .lister-panel').boundingBox()
  await press(page, 'Control+Shift+ArrowRight')
  const after = await pane1(page).locator('#style-panel .lister-panel').boundingBox()
  expect(Math.round(after.x - before.x)).toBe(50)
})

test("Ctrl+Shift+← déplace le style panel de 50px vers la gauche", async ({ page }) => {
  await openStylePanel(page)
  const before = await pane1(page).locator('#style-panel .lister-panel').boundingBox()
  await press(page, 'Control+Shift+ArrowLeft')
  const after = await pane1(page).locator('#style-panel .lister-panel').boundingBox()
  expect(Math.round(before.x - after.x)).toBe(50)
})

test("deux Ctrl+Shift+↓ accumulent : 100px total", async ({ page }) => {
  await openStylePanel(page)
  const before = await pane1(page).locator('#style-panel .lister-panel').boundingBox()
  await press(page, 'Control+Shift+ArrowDown')
  await press(page, 'Control+Shift+ArrowDown')
  const after = await pane1(page).locator('#style-panel .lister-panel').boundingBox()
  expect(Math.round(after.y - before.y)).toBe(100)
})

// ─── Tools panel ─────────────────────────────────────────────────────────────

test("Ctrl+Shift+↓ déplace le panneau outils de 50px", async ({ page }) => {
  await goToListerEvent(page)
  await press(page, 'Meta+t')
  await expect(pane1(page).locator('.tools-panel')).toBeVisible()
  const before = await pane1(page).locator('.tools-panel').boundingBox()
  await press(page, 'Control+Shift+ArrowDown')
  const after = await pane1(page).locator('.tools-panel').boundingBox()
  expect(Math.round(after.y - before.y)).toBe(50)
})

