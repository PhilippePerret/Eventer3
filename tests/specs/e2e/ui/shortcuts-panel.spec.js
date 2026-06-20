import { test, expect, pane1 } from '../__setup__.js'

const OPEN_KEY = 'Meta+?'

test('Cmd+? ouvre l\'aide contextuelle', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('.contextual-help')).not.toBeVisible()
  await pane1(page).locator('body').press(OPEN_KEY)
  await expect(pane1(page).locator('.contextual-help')).toBeVisible()
})

test('l\'aide contextuelle contient la touche ⌘ + ↓', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await pane1(page).locator('body').press(OPEN_KEY)
  await expect(pane1(page).locator('.contextual-help')).toContainText('⌘ + ↓')
})

test('l\'aide contextuelle ferme avec Escape', async ({ page }) => {
  await page.goto('/')
  await pane1(page).locator('body').press(OPEN_KEY)
  await expect(pane1(page).locator('.contextual-help')).toBeVisible()
  await pane1(page).locator('body').press('Escape')
  await expect(pane1(page).locator('.contextual-help')).not.toBeVisible()
})

test('après fermeture du panneau, l\'EventLister reste actif (navigation fonctionne)', async ({ page }) => {
  await page.goto('/')
  await pane1(page).locator('body').press(OPEN_KEY)
  await expect(pane1(page).locator('.contextual-help')).toBeVisible()
  await pane1(page).locator('body').press('Escape')
  await expect(pane1(page).locator('.contextual-help')).not.toBeVisible()
  // La navigation au clavier doit de nouveau fonctionner
  const items = pane1(page).locator('.project-item')
  await expect(items.nth(0)).toHaveClass(/selected/)
})
