import { test, expect, pane1, press, getErr } from '../__setup__.js'

const OPEN_KEY = 'Meta+?'

test('Cmd+? ouvre l\'aide contextuelle', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('.contextual-help')).not.toBeVisible()
  await press(page, OPEN_KEY)
  await expect(pane1(page).locator('.contextual-help')).toBeVisible()
})

test('l\'aide contextuelle contient la touche ⌘ + ↓', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, OPEN_KEY)
  await expect(pane1(page).locator('.contextual-help')).toContainText('⌘ + ↓')
})

test('l\'aide contextuelle ferme avec Meta+Enter', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, OPEN_KEY)
  await expect(pane1(page).locator('.contextual-help')).toBeVisible()
  await press(page, 'Meta+Enter')
  await expect(pane1(page).locator('.contextual-help')).not.toBeVisible()
})

test('après fermeture du panneau, la navigation fonctionne', async ({ page }) => {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, OPEN_KEY)
  await expect(pane1(page).locator('.contextual-help')).toBeVisible()
  await press(page, 'Meta+Enter')
  await expect(pane1(page).locator('.contextual-help')).not.toBeVisible()
  // La navigation au clavier doit de nouveau fonctionner
  const items = pane1(page).locator('.project-item')
  await expect(items.nth(0)).toHaveClass(/selected/)
})
