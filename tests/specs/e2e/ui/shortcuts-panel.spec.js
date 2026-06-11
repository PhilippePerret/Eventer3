import { test, expect } from '../__setup__.js'

const OPEN_KEY = 'Meta+?'

test('Cmd+? ouvre l\'aide contextuelle', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.contextual-help')).not.toBeVisible()
  await page.keyboard.press(OPEN_KEY)
  await expect(page.locator('.contextual-help')).toBeVisible()
})

test('l\'aide contextuelle contient la touche ⌘ + ↓', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press(OPEN_KEY)
  await expect(page.locator('.contextual-help')).toContainText('⌘ + ↓')
})

test('l\'aide contextuelle ferme avec Escape', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press(OPEN_KEY)
  await expect(page.locator('.contextual-help')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('.contextual-help')).not.toBeVisible()
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
