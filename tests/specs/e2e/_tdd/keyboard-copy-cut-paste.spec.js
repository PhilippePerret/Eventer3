import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect } from '../__setup__.js'

// ─── COPY ⌘+c ───────────────────────────────────────────────────────────────
// many-events : project-a (hl:true, e1/e2/e3), project-b (sans events)

test.describe('⌘+c dans EventLister', () => {

  test.beforeEach(() => installFixtures('many-events'))

  async function goToEventLister(page) {
    await page.goto('/')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  }

  test('⌘+c ne retire pas l\'item original de la liste', async ({ page }) => {
    await goToEventLister(page)
    const items = page.locator('.event-item')
    const countBefore = await items.count()
    await page.keyboard.press('Meta+c')
    await expect(items).toHaveCount(countBefore)
  })

  test('⌘+c + ⌘+v ajoute un item au-dessus de la sélection', async ({ page }) => {
    await goToEventLister(page)
    const items = page.locator('.event-item')
    const countBefore = await items.count()
    const selectedTitle = await page.locator('.event-item.selected').textContent()
    await page.keyboard.press('Meta+c')
    await page.keyboard.press('Meta+v')
    await expect(items).toHaveCount(countBefore + 1)
    // L'item collé est au-dessus de la sélection d'origine → index 0 contient le titre copié
    await expect(items.nth(0)).toContainText(selectedTitle.trim())
  })

  test('⌘+c + ⌘+v : l\'item collé est sélectionné', async ({ page }) => {
    await goToEventLister(page)
    await page.keyboard.press('Meta+c')
    await page.keyboard.press('Meta+v')
    await expect(page.locator('.event-item.selected')).toBeVisible()
    await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)
  })

  test('après ⌘+c + ⌘+v, le collage est persistant', async ({ page }) => {
    await goToEventLister(page)
    const items = page.locator('.event-item')
    const countBefore = await items.count()
    await page.keyboard.press('Meta+c')
    await page.keyboard.press('Meta+v')
    await page.waitForLoadState('networkidle')
    await page.reload()
    await goToEventLister(page)
    await expect(items).toHaveCount(countBefore + 1)
  })

})

// ─── CUT ⌘+x ────────────────────────────────────────────────────────────────

test.describe('⌘+x dans EventLister', () => {

  test.beforeEach(() => installFixtures('many-events'))

  async function goToEventLister(page) {
    await page.goto('/')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  }

  test('⌘+x retire l\'item sélectionné de la liste', async ({ page }) => {
    await goToEventLister(page)
    const items = page.locator('.event-item')
    const countBefore = await items.count()
    await page.keyboard.press('Meta+x')
    await expect(items).toHaveCount(countBefore - 1)
  })

  test('⌘+x + ⌘+v restitue l\'item au-dessus de la sélection', async ({ page }) => {
    await goToEventLister(page)
    const items = page.locator('.event-item')
    const countBefore = await items.count()
    // Mémoriser le titre de e1
    const cutTitle = await items.nth(0).textContent()
    // Couper e1, sélection passe à e2
    await page.keyboard.press('Meta+x')
    await expect(items).toHaveCount(countBefore - 1)
    // Coller au-dessus de e2 (sélectionné)
    await page.keyboard.press('Meta+v')
    await expect(items).toHaveCount(countBefore)
    await expect(items.nth(0)).toContainText(cutTitle.trim())
  })

  test('après ⌘+x + ⌘+v, la suppression initiale est annulée (persistance)', async ({ page }) => {
    await goToEventLister(page)
    const items = page.locator('.event-item')
    const countBefore = await items.count()
    await page.keyboard.press('Meta+x')
    await page.keyboard.press('Meta+v')
    await page.waitForLoadState('networkidle')
    await page.reload()
    await goToEventLister(page)
    await expect(items).toHaveCount(countBefore)
  })

})

// ─── CUT : INTERDICTION SUR DERNIER ITEM ────────────────────────────────────
// with-brins : project-a (2 events)

test.describe('⌘+x interdit sur le dernier item', () => {

  test.beforeEach(() => installFixtures('with-brins'))

  test('⌘+x du dernier event affiche une notification et ne supprime pas', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
    const items = page.locator('.event-item')
    // Couper jusqu'à 1 item restant
    await page.keyboard.press('Meta+x')
    await expect(items).toHaveCount(1)
    // Tenter de couper le dernier
    await page.keyboard.press('Meta+x')
    await expect(items).toHaveCount(1)
    await expect(page.locator('#notification')).toBeVisible()
  })

})

// ─── PASTE CROSS-PANEL MÊME TYPE ────────────────────────────────────────────
// two-projects-events : project-a (e1/e2/e3), project-b (e4/e5)

test.describe('⌘+v colle dans un autre EventLister (même type)', () => {

  test.beforeEach(() => installFixtures('two-projects-events'))

  test('⌘+c dans project-a puis ⌘+v dans project-b colle l\'item', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

    // Entrer dans project-a → copier e1
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
    const copiedTitle = await page.locator('.event-item.selected').textContent()
    await page.keyboard.press('Meta+c')

    // Revenir à la liste des projets
    await page.keyboard.press('ArrowLeft')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

    // Naviguer sur project-b puis entrer dedans
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)

    const items = page.locator('.event-item')
    const countBefore = await items.count()

    // Coller
    await page.keyboard.press('Meta+v')
    await expect(items).toHaveCount(countBefore + 1)
    await expect(items.nth(0)).toContainText(copiedTitle.trim())
  })

  test('⌘+x dans project-a puis ⌘+v dans project-b déplace l\'item', async ({ page }) => {
    await page.goto('/')

    // Entrer dans project-a → couper e1
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
    const itemsA = page.locator('.event-item')
    const countABefore = await itemsA.count()
    const cutTitle = await page.locator('.event-item.selected').textContent()
    await page.keyboard.press('Meta+x')
    await expect(itemsA).toHaveCount(countABefore - 1)

    // Revenir à la liste des projets
    await page.keyboard.press('ArrowLeft')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

    // Entrer dans project-b → coller
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
    const itemsB = page.locator('.event-item')
    const countBBefore = await itemsB.count()
    await page.keyboard.press('Meta+v')
    await expect(itemsB).toHaveCount(countBBefore + 1)
    await expect(itemsB.nth(0)).toContainText(cutTitle.trim())
  })

})

// ─── PASTE CROSS-TYPE BLOQUÉ ─────────────────────────────────────────────────
// with-brins : project-a, events e1/e2, brins b1/b2

test.describe('⌘+v bloqué entre types différents', () => {

  test.beforeEach(() => installFixtures('with-brins'))

  test('ne peut pas coller un event dans le panneau des brins', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)

    // Copier l'event sélectionné
    await page.keyboard.press('Meta+c')

    // Ouvrir le panneau brins
    await page.keyboard.press('b')
    await expect(page.locator('#brin-panel')).toBeVisible()

    const brins = page.locator('.brin-item')
    const countBefore = await brins.count()

    // Tenter de coller
    await page.keyboard.press('Meta+v')
    await expect(brins).toHaveCount(countBefore)
  })

  test('ne peut pas coller un event dans le panneau des projets', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#main-panel')).toHaveClass(/event-list/)

    // Copier l'event sélectionné
    await page.keyboard.press('Meta+c')

    // Revenir à la liste des projets
    await page.keyboard.press('ArrowLeft')
    await expect(page.locator('#main-panel')).toHaveClass(/project-list/)

    const projects = page.locator('.project-item')
    const countBefore = await projects.count()

    // Tenter de coller
    await page.keyboard.press('Meta+v')
    await expect(projects).toHaveCount(countBefore)
  })

})
