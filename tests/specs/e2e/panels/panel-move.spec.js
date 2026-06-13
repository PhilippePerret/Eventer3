import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('with-styles')
})

async function goToEventLister(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
}

async function openStylePanel(page) {
  await goToEventLister(page)
  await page.keyboard.press('s')
  await expect(pane1(page).locator('#style-panel')).toBeVisible()
}

// ─── Style panel ──────────────────────────────────────────────────────────────

test("Ctrl+Shift+↓ déplace le style panel de 50px vers le bas", async ({ page }) => {
  await openStylePanel(page)
  const before = await pane1(page).locator('.style-panel__inner').boundingBox()
  await page.keyboard.press('Control+Shift+ArrowDown')
  const after = await pane1(page).locator('.style-panel__inner').boundingBox()
  expect(Math.round(after.y - before.y)).toBe(50)
})

test("Ctrl+Shift+↑ déplace le style panel de 50px vers le haut", async ({ page }) => {
  await openStylePanel(page)
  const before = await pane1(page).locator('.style-panel__inner').boundingBox()
  await page.keyboard.press('Control+Shift+ArrowUp')
  const after = await pane1(page).locator('.style-panel__inner').boundingBox()
  expect(Math.round(before.y - after.y)).toBe(50)
})

test("Ctrl+Shift+→ déplace le style panel de 50px vers la droite", async ({ page }) => {
  await openStylePanel(page)
  const before = await pane1(page).locator('.style-panel__inner').boundingBox()
  await page.keyboard.press('Control+Shift+ArrowRight')
  const after = await pane1(page).locator('.style-panel__inner').boundingBox()
  expect(Math.round(after.x - before.x)).toBe(50)
})

test("Ctrl+Shift+← déplace le style panel de 50px vers la gauche", async ({ page }) => {
  await openStylePanel(page)
  const before = await pane1(page).locator('.style-panel__inner').boundingBox()
  await page.keyboard.press('Control+Shift+ArrowLeft')
  const after = await pane1(page).locator('.style-panel__inner').boundingBox()
  expect(Math.round(before.x - after.x)).toBe(50)
})

test("deux Ctrl+Shift+↓ accumulent : 100px total", async ({ page }) => {
  await openStylePanel(page)
  const before = await pane1(page).locator('.style-panel__inner').boundingBox()
  await page.keyboard.press('Control+Shift+ArrowDown')
  await page.keyboard.press('Control+Shift+ArrowDown')
  const after = await pane1(page).locator('.style-panel__inner').boundingBox()
  expect(Math.round(after.y - before.y)).toBe(100)
})

// ─── Shortcuts panel ──────────────────────────────────────────────────────────

test("Ctrl+Shift+↓ déplace le panneau raccourcis de 50px", async ({ page }) => {
  await page.goto('/')
  const frame = page.frames().find(f => f.url().includes('app-frame'))
  await frame.evaluate(() => {
    const panel = document.querySelector('#shortcuts-panel')
    panel.innerHTML = '<div class="shortcuts-panel__inner"><p>Test</p></div>'
    panel.classList.remove('hidden')
  })
  await expect(pane1(page).locator('#shortcuts-panel')).toBeVisible()
  const before = await pane1(page).locator('.shortcuts-panel__inner').boundingBox()
  await page.keyboard.press('Control+Shift+ArrowDown')
  const after = await pane1(page).locator('.shortcuts-panel__inner').boundingBox()
  expect(Math.round(after.y - before.y)).toBe(50)
})

// ─── Tools panel ─────────────────────────────────────────────────────────────

test("Ctrl+Shift+↓ déplace le panneau outils de 50px", async ({ page }) => {
  await goToEventLister(page)
  const frame = page.frames().find(f => f.url().includes('app-frame'))
  await frame.evaluate(() => {
    const panel = document.querySelector('#tools-panel')
    panel.innerHTML = '<div class="tools-panel__item">Test</div><div class="tools-panel__item">Autre</div>'
    panel.classList.remove('hidden')
  })
  await expect(pane1(page).locator('#tools-panel')).toBeVisible()
  const before = await pane1(page).locator('#tools-panel').boundingBox()
  await page.keyboard.press('Control+Shift+ArrowDown')
  const after = await pane1(page).locator('#tools-panel').boundingBox()
  expect(Math.round(after.y - before.y)).toBe(50)
})
