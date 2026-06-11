import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect } from '../__setup__.js'

// ─── PROJETS ───────────────────────────────────────────────────────────────
// many-projects : Projet A (index 0), Projet B (index 1), Projet C (index 2)

test.describe('Delete dans ProjectLister', () => {

  test.beforeEach(() => installFixtures('many-projects'))

  test('Delete supprime le projet sélectionné', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
    const items = page.locator('.project-item')
    const initialCount = await items.count()
    await page.keyboard.press('Delete')
    await expect(items).toHaveCount(initialCount - 1)
  })

  test('la suppression du projet est persistante (rechargement)', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
    const items = page.locator('.project-item')
    const initialCount = await items.count()
    await page.keyboard.press('Delete')
    await expect(items).toHaveCount(initialCount - 1)
    await page.waitForLoadState('networkidle')
    await page.reload()
    await expect(items).toHaveCount(initialCount - 1)
  })

  test('l\'aide contextuelle mentionne ⌦ dans le ProjectLister avec plusieurs projets', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
    await page.keyboard.press('Meta+?')
    await expect(page.locator('.contextual-help')).toContainText('⌦')
    await page.keyboard.press('Escape')
  })

  test('quand un seul projet reste, le footer ne mentionne plus ⌦', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
    const items = page.locator('.project-item')
    const initialCount = await items.count()
    for (let i = 0; i < initialCount - 1; i++) {
      await page.keyboard.press('Delete')
      await expect(items).toHaveCount(initialCount - i - 1)
    }
    await expect(items).toHaveCount(1)
    await expect(page.locator('#shortcuts-footer')).not.toContainText('⌦')
  })

  test('quand un seul projet reste, Delete ne le supprime pas et affiche un message', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
    const items = page.locator('.project-item')
    const initialCount = await items.count()
    for (let i = 0; i < initialCount - 1; i++) {
      await page.keyboard.press('Delete')
      await expect(items).toHaveCount(initialCount - i - 1)
    }
    await expect(items).toHaveCount(1)
    await page.keyboard.press('Delete')
    await expect(items).toHaveCount(1)
    await expect(page.locator('#notification')).toBeVisible()
  })

})

// ─── EVENTS ────────────────────────────────────────────────────────────────
// many-events : project-a (hl:true, events e1/e2/e3), project-b

test.describe('Delete dans EventLister', () => {

  test.beforeEach(() => installFixtures('many-events'))

  test('Delete supprime l\'event sélectionné dans un EventLister', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
    const items = page.locator('.event-item')
    const initialCount = await items.count()
    await page.keyboard.press('Delete')
    await expect(items).toHaveCount(initialCount - 1)
  })

  test('la suppression de l\'event est persistante (rechargement)', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
    const items = page.locator('.event-item')
    const initialCount = await items.count()
    await page.keyboard.press('Delete')
    await expect(items).toHaveCount(initialCount - 1)
    await page.waitForLoadState('networkidle')
    await page.reload()
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
    await expect(items).toHaveCount(initialCount - 1)
  })

  test('l\'aide contextuelle mentionne ⌦ dans un EventLister avec plusieurs events', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
    await page.keyboard.press('Meta+?')
    await expect(page.locator('.contextual-help')).toContainText('⌦')
    await page.keyboard.press('Escape')
  })


})

// ─── BRINS ─────────────────────────────────────────────────────────────────
// with-brins : project-a (hl:true), events e1/e2, brins b1 (MON, non-coché) / b2 (AUT, coché)
// e1 a le brin b2 (AUT) assigné → badge AUT visible dans la ligne de e1

test.describe('Delete dans le panneau des brins', () => {

  test.beforeEach(() => installFixtures('with-brins'))

  async function goToEventLister(page) {
    await page.goto('/')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  }

  async function openBrinPanel(page) {
    await goToEventLister(page)
    await page.keyboard.press('b')
    await expect(page.locator('#brin-panel')).toBeVisible()
  }

  test('Delete supprime le brin sélectionné dans le panneau des brins', async ({ page }) => {
    await openBrinPanel(page)
    const items = page.locator('.brin-item')
    const initialCount = await items.count()
    // Naviguer sur b2 (AUT, index 1)
    await page.keyboard.press('ArrowDown')
    await expect(items.nth(1)).toHaveClass(/selected/)
    await page.keyboard.press('Delete')
    await expect(items).toHaveCount(initialCount - 1)
    // Le brin b2 (AUT) ne doit plus être dans la liste
    const titles = page.locator('.brin-item .brin-item__title')
    await expect(titles).not.toContainText('Autre brin')
  })

  test('après suppression du brin coché, le badge disparaît de la ligne de l\'event', async ({ page }) => {
    await openBrinPanel(page)
    // Vérifier que le badge AUT est présent dans la ligne de e1 (event sélectionné)
    const eventRow = page.locator('.event-item.selected')
    await expect(eventRow.locator('.event-brins-badges .badge.brin')).toContainText('AUT')
    // Naviguer sur b2 (AUT) et le supprimer
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Delete')
    // Le badge AUT doit avoir disparu de la ligne de e1
    await expect(eventRow.locator('.event-brins-badges')).not.toContainText('AUT')
  })

  test('la suppression du brin est persistante : liste des brins du projet', async ({ page }) => {
    await openBrinPanel(page)
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Delete')
    await expect(page.locator('.brin-item')).toHaveCount(1)
    await page.waitForLoadState('networkidle')
    // Rechargement
    await page.reload()
    await goToEventLister(page)
    await page.keyboard.press('b')
    await expect(page.locator('#brin-panel')).toBeVisible()
    await expect(page.locator('.brin-item')).toHaveCount(1)
    await expect(page.locator('.brin-item .brin-item__title')).not.toContainText('Autre brin')
  })

  test('la suppression du brin est persistante : badge absent de l\'event après rechargement', async ({ page }) => {
    await openBrinPanel(page)
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Delete')
    // Rechargement
    await page.reload()
    await goToEventLister(page)
    // Le badge AUT ne doit pas apparaître dans e1 même après rechargement
    const eventRow = page.locator('.event-item.selected')
    await expect(eventRow.locator('.event-brins-badges')).not.toContainText('AUT')
  })

})
