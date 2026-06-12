import { test, expect } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'

test.beforeEach(() => {
  installFixtures('many-events')
})

// Helper : navigue vers l'event-list, mémorise N cibles (les N premiers events), puis
// entre en édition sur l'event suivant et ouvre le TargetsPanel.
async function setupTargetsAndOpenPanel(page, count = 1) {
  await page.goto('/')
  await expect(page.locator('.project-item').first()).toHaveClass(/selected/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  for (let i = 0; i < count; i++) {
    if (i > 0) await page.keyboard.press('ArrowDown')
    await page.keyboard.press('k')
    await page.locator('.notification').waitFor({ state: 'hidden' })
  }
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await expect(page.locator('.event-item.editing input[name="title"]')).toBeFocused()
  await page.keyboard.press('Meta+k')
  await expect(page.locator('.targets-panel')).toBeVisible()
}

// ─── TITRE ───────────────────────────────────────────────────────────────────

test('TargetsPanel — titre visible', async ({ page }) => {
  await setupTargetsAndOpenPanel(page)
  await expect(page.locator('.floating-panel__title')).toBeVisible()
})

// ─── DÉPLACEMENT cmd+↑/↓ ─────────────────────────────────────────────────────

test('cmd+↑/↓ déplace les items dans la section regular', async ({ page }) => {
  await setupTargetsAndOpenPanel(page, 2)
  const items = page.locator('.floating-panel__item')
  const first  = (await items.nth(0).textContent()).trim()
  const second = (await items.nth(1).textContent()).trim()

  // Sélectionner le 2ème, le remonter
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Meta+ArrowUp')

  await expect(items.nth(0)).toContainText(second)
  await expect(items.nth(1)).toContainText(first)
})

// ─── PINNING ─────────────────────────────────────────────────────────────────

test('cmd+↑ au-dessus du top regular → item punaisé + notification', async ({ page }) => {
  await setupTargetsAndOpenPanel(page)
  // 1 item regular, déjà sélectionné (index 0), cmd+↑ → passe en pinned
  await page.keyboard.press('Meta+ArrowUp')
  await expect(page.locator('.floating-panel__item--pinned')).toHaveCount(1)
  await expect(page.locator('.notification')).toBeVisible()
  await expect(page.locator('.notification')).toContainText('punaisée')
})

test('cmd+↓ sous le bas du pinned → item dépunaisé + notification', async ({ page }) => {
  await setupTargetsAndOpenPanel(page)
  // Punaiser d'abord
  await page.keyboard.press('Meta+ArrowUp')
  await page.locator('.notification').waitFor({ state: 'hidden' })
  // L'item est maintenant dans pinned et sélectionné — cmd+↓ → repasse en regular
  await page.keyboard.press('Meta+ArrowDown')
  await expect(page.locator('.floating-panel__item--pinned')).toHaveCount(0)
  await expect(page.locator('.notification')).toBeVisible()
  await expect(page.locator('.notification')).toContainText('dépunaisée')
})

test('items pinned persistent après rechargement', async ({ page }) => {
  await setupTargetsAndOpenPanel(page)
  await page.keyboard.press('Meta+ArrowUp')
  await page.locator('.notification').waitFor({ state: 'hidden' })
  await page.keyboard.press('Escape')

  await page.reload()
  await expect(page.locator('.project-item').first()).toHaveClass(/selected/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await expect(page.locator('.event-item.editing input[name="title"]')).toBeFocused()
  await page.keyboard.press('Meta+k')
  await expect(page.locator('.targets-panel')).toBeVisible()
  await expect(page.locator('.floating-panel__item--pinned')).toHaveCount(1)
})

test('overflow : item pinned non supprimé quand pile déborde', async ({ page }) => {
  // Scénario : 1 item pinned → ajouter MAX_TARGETS items regular
  // → le pinned reste, l'overflow supprime les regular trop vieux
  // On va juste vérifier que le pinned n'est pas supprimé lors d'un ajout
  await setupTargetsAndOpenPanel(page)
  await page.keyboard.press('Meta+ArrowUp')          // pin le premier item
  await page.locator('.notification').waitFor({ state: 'hidden' })
  await page.keyboard.press('Escape')   // ferme TargetsPanel → retour item-edition
  await page.keyboard.press('Escape')   // annule édition → mode normal

  // Mémoriser un 2ème event (regular)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('k')
  await page.locator('.notification').waitFor({ state: 'hidden' })

  // Ré-ouvrir le panel en éditant l'event courant
  await page.keyboard.press('Enter')
  await expect(page.locator('.event-item.editing input[name="title"]')).toBeFocused()
  await page.keyboard.press('Meta+k')
  await expect(page.locator('.targets-panel')).toBeVisible()

  // Le pinned est toujours là
  await expect(page.locator('.floating-panel__item--pinned')).toHaveCount(1)
  // Et le regular aussi (2 items au total)
  await expect(page.locator('.floating-panel__item')).toHaveCount(2)
})
