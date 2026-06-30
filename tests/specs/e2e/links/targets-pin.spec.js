import { test, expect, pane1, press } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

const field = page => pane1(page).locator('.event-item.editing [contenteditable][data-field="title"]')

async function setupTargetsAndOpenPanel(page, count = 1) {
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  for (let i = 0; i < count; i++) {
    if (i > 0) await press(page, 'ArrowDown')
    await press(page, 'k')
    await pane1(page).locator('.notification').waitFor({ state: 'hidden' })
  }
  await press(page, 'ArrowDown')
  await press(page, 'Enter')
  await expect(field(page)).toBeFocused()
  await press(page, 'Meta+k')
  await expect(pane1(page).locator('.targets-panel')).toBeVisible()
}

// ─── TITRE ───────────────────────────────────────────────────────────────────

test('TargetsPanel — titre visible', async ({ page }) => {
  await setupTargetsAndOpenPanel(page)
  await expect(pane1(page).locator('.floating-panel__title')).toBeVisible()
})

// ─── DÉPLACEMENT cmd+↑/↓ ─────────────────────────────────────────────────────

test('cmd+↑/↓ déplace les items dans la section regular', async ({ page }) => {
  await setupTargetsAndOpenPanel(page, 2)
  const items  = pane1(page).locator('.floating-panel__item')
  const first  = (await items.nth(0).textContent()).trim()
  const second = (await items.nth(1).textContent()).trim()

  await press(page, 'ArrowDown')       // → 2ème item
  await press(page, 'Meta+ArrowUp')    // remonter

  await expect(items.nth(0)).toContainText(second)
  await expect(items.nth(1)).toContainText(first)
})

// ─── PINNING ─────────────────────────────────────────────────────────────────

test('cmd+↑ au-dessus du top regular → item punaisé + notification', async ({ page }) => {
  await setupTargetsAndOpenPanel(page)
  await press(page, 'Meta+ArrowUp')
  await expect(pane1(page).locator('.floating-panel__item--pinned')).toHaveCount(1)
  await expect(pane1(page).locator('.notification')).toBeVisible()
  await expect(pane1(page).locator('.notification')).toContainText('punaisée')
})

test('cmd+↓ sous le bas du pinned → item dépunaisé + notification', async ({ page }) => {
  await setupTargetsAndOpenPanel(page)
  await press(page, 'Meta+ArrowUp')
  await pane1(page).locator('.notification').waitFor({ state: 'hidden' })
  await press(page, 'Meta+ArrowDown')
  await expect(pane1(page).locator('.floating-panel__item--pinned')).toHaveCount(0)
  await expect(pane1(page).locator('.notification')).toBeVisible()
  await expect(pane1(page).locator('.notification')).toContainText('dépunaisée')
})

test('items pinned persistent après rechargement', async ({ page }) => {
  await setupTargetsAndOpenPanel(page)
  await press(page, 'Meta+ArrowUp')
  await pane1(page).locator('.notification').waitFor({ state: 'hidden' })
  await press(page, 'Meta+Enter')

  await page.reload()
  await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await press(page, 'ArrowDown')
  await press(page, 'Enter')
  await expect(field(page)).toBeFocused()
  await press(page, 'Meta+k')
  await expect(pane1(page).locator('.targets-panel')).toBeVisible()
  await expect(pane1(page).locator('.floating-panel__item--pinned')).toHaveCount(1)
})

test('overflow : item pinned non supprimé quand pile déborde', async ({ page }) => {
  await setupTargetsAndOpenPanel(page)
  await press(page, 'Meta+ArrowUp')
  await pane1(page).locator('.notification').waitFor({ state: 'hidden' })
  await press(page, 'Meta+Enter')

  await press(page, 'Escape')

  await press(page, 'ArrowDown')
  await press(page, 'k')
  await pane1(page).locator('.notification').waitFor({ state: 'hidden' })

  await press(page, 'Enter')
  await expect(field(page)).toBeFocused()
  await press(page, 'Meta+k')
  await expect(pane1(page).locator('.targets-panel')).toBeVisible()

  await expect(pane1(page).locator('.floating-panel__item--pinned')).toHaveCount(1)
  await expect(pane1(page).locator('.floating-panel__item')).toHaveCount(2)
})
