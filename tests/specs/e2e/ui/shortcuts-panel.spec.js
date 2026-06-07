import { test, expect } from '../__setup__.js'

// Le panneau des raccourcis s'ouvre avec la touche ? (Shift+,)
// Il se ferme avec ⌘+Enter (comme tout panneau modal)
// Il affiche TOUS les raccourcis de l'application

test('la touche ? ouvre le panneau des raccourcis', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#shortcuts-panel')).not.toBeVisible()
  await page.keyboard.press('?')
  await expect(page.locator('#shortcuts-panel')).toBeVisible()
})

test('le panneau des raccourcis contient la touche ⌦ (supprimer)', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('?')
  await expect(page.locator('#shortcuts-panel')).toContainText('⌘ + ↓')
})

test('le panneau des raccourcis ferme avec ⌘+Enter', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('?')
  await expect(page.locator('#shortcuts-panel')).toBeVisible()
  await page.keyboard.press('Meta+Enter')
  await expect(page.locator('#shortcuts-panel')).not.toBeVisible()
})

test('après fermeture du panneau, l\'EventLister reste actif (navigation fonctionne)', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('?')
  await page.keyboard.press('Meta+Enter')
  await expect(page.locator('#shortcuts-panel')).not.toBeVisible()
  // La navigation au clavier doit de nouveau fonctionner
  const items = page.locator('.project-item')
  await expect(items.nth(0)).toHaveClass(/selected/)
  await page.keyboard.press('ArrowDown')
  await expect(items.nth(1)).toHaveClass(/selected/)
})
