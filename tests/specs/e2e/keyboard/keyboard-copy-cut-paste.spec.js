import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

// ─── COPY ⌘+c ───────────────────────────────────────────────────────────────
// many-events : project-a (hl:true, e1/e2/e3), project-b (sans events)

test.describe('⌘+c dans ListerEvent', () => {

  test.beforeEach(() => installFixtures('many-events'))

  async function goToListerEvent(page) {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    await pane1(page).locator('#main-panel').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  }

  test('⌘+c ne retire pas l\'item original de la liste', async ({ page }) => {
    await goToListerEvent(page)
    const items = pane1(page).locator('.event-item')
    const countBefore = await items.count()
    await pane1(page).locator('#main-panel').press('Meta+c')
    await expect(items).toHaveCount(countBefore)
  })

  test('⌘+c + ⌘+v ajoute un item au-dessus de la sélection', async ({ page }) => {
    await goToListerEvent(page)
    const items = pane1(page).locator('.event-item')
    const countBefore = await items.count()
    const selectedTitle = await pane1(page).locator('.event-item.selected').textContent()
    await pane1(page).locator('#main-panel').press('Meta+c')
    await pane1(page).locator('#main-panel').press('Meta+v')
    await expect(items).toHaveCount(countBefore + 1)
    // L'item collé est au-dessus de la sélection d'origine → index 0 contient le titre copié
    await expect(items.nth(0)).toContainText(selectedTitle.trim())
  })

  test('⌘+c + ⌘+v : l\'item collé est sélectionné', async ({ page }) => {
    await goToListerEvent(page)
    await pane1(page).locator('#main-panel').press('Meta+c')
    await pane1(page).locator('#main-panel').press('Meta+v')
    await expect(pane1(page).locator('.event-item.selected')).toBeVisible()
    await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  })

  test('⌘+c + ⌘+v : l\'item collé a un id différent de l\'original', async ({ page }) => {
    await goToListerEvent(page)
    const items = pane1(page).locator('.event-item')
    const originalId = await items.nth(0).getAttribute('data-id')
    await pane1(page).locator('#main-panel').press('Meta+c')
    await pane1(page).locator('#main-panel').press('Meta+v')
    const copiedId = await items.nth(0).getAttribute('data-id')
    expect(copiedId).not.toBe(originalId)
  })

  test('après ⌘+c + ⌘+v, le collage est persistant', async ({ page }) => {
    await goToListerEvent(page)
    const items = pane1(page).locator('.event-item')
    const countBefore = await items.count()
    await pane1(page).locator('#main-panel').press('Meta+c')
    await pane1(page).locator('#main-panel').press('Meta+v')
    await page.waitForLoadState('networkidle')
    await page.reload()
    await goToListerEvent(page)
    await expect(items).toHaveCount(countBefore + 1)
  })

})

// ─── CUT ⌘+x ────────────────────────────────────────────────────────────────

test.describe('⌘+x dans ListerEvent', () => {

  test.beforeEach(() => installFixtures('many-events'))

  async function goToListerEvent(page) {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    await pane1(page).locator('#main-panel').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  }

  test('⌘+x retire l\'item sélectionné de la liste', async ({ page }) => {
    await goToListerEvent(page)
    const items = pane1(page).locator('.event-item')
    const countBefore = await items.count()
    await pane1(page).locator('#main-panel').press('Meta+x')
    await expect(items).toHaveCount(countBefore - 1)
  })

  test('⌘+x + ⌘+v restitue l\'item au-dessus de la sélection', async ({ page }) => {
    await goToListerEvent(page)
    const items = pane1(page).locator('.event-item')
    const countBefore = await items.count()
    // Mémoriser le titre de e1
    const cutTitle = await items.nth(0).textContent()
    // Couper e1, sélection passe à e2
    await pane1(page).locator('#main-panel').press('Meta+x')
    await expect(items).toHaveCount(countBefore - 1)
    // Coller au-dessus de e2 (sélectionné)
    await pane1(page).locator('#main-panel').press('Meta+v')
    await expect(items).toHaveCount(countBefore)
    await expect(items.nth(0)).toContainText(cutTitle.trim())
  })

  test('⌘+x + ⌘+v : l\'item collé conserve le même id que l\'original', async ({ page }) => {
    await goToListerEvent(page)
    const items = pane1(page).locator('.event-item')
    const originalId = await items.nth(0).getAttribute('data-id')
    await pane1(page).locator('#main-panel').press('Meta+x')
    await pane1(page).locator('#main-panel').press('Meta+v')
    await expect(items.nth(0)).toHaveAttribute('data-id', originalId)
  })

  test('après ⌘+x + ⌘+v, la suppression initiale est annulée (persistance)', async ({ page }) => {
    await goToListerEvent(page)
    const items = pane1(page).locator('.event-item')
    const countBefore = await items.count()
    await pane1(page).locator('#main-panel').press('Meta+x')
    await pane1(page).locator('#main-panel').press('Meta+v')
    await page.waitForLoadState('networkidle')
    await page.reload()
    await goToListerEvent(page)
    await expect(items).toHaveCount(countBefore)
  })

})

// ─── CUT : INTERDICTION SUR DERNIER ITEM ────────────────────────────────────
// with-brins : project-a (2 events, 2 brins b1/b2)
// many-projects : Projet A (idx 0), Projet B (idx 1), Projet C (idx 2)
// TODO perso : ajouter quand Perso.js + fixture avec 2 persos existeront

test.describe('⌘+x interdit sur le dernier item', () => {

  test.beforeEach(() => installFixtures('with-brins'))

  test('⌘+x du dernier event affiche une notification et ne supprime pas', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    await pane1(page).locator('#main-panel').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    const items = pane1(page).locator('.event-item')
    // Couper jusqu'à 1 item restant
    await pane1(page).locator('#main-panel').press('Meta+x')
    await expect(items).toHaveCount(1)
    // Tenter de couper le dernier
    await pane1(page).locator('#main-panel').press('Meta+x')
    await expect(items).toHaveCount(1)
    await expect(pane1(page).locator('#notification')).toBeVisible()
    await expect(pane1(page).locator('#notification')).toContainText('évènement')
  })

  test('⌘+x du dernier brin affiche une notification mentionnant "brin"', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    await pane1(page).locator('#main-panel').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    await pane1(page).locator('#main-panel').press('b')
    await expect(pane1(page).locator('#brins-panel')).toBeVisible()
    const items = pane1(page).locator('.brin-item')
    // Couper jusqu'à 1 brin restant
    await pane1(page).locator('#main-panel').press('Meta+x')
    await expect(items).toHaveCount(1)
    // Tenter de couper le dernier
    await pane1(page).locator('#main-panel').press('Meta+x')
    await expect(items).toHaveCount(1)
    await expect(pane1(page).locator('#notification')).toBeVisible()
    await expect(pane1(page).locator('#notification')).toContainText('brin')
  })

})

test.describe('⌘+x interdit sur le dernier projet (ListerProject)', () => {

  test.beforeEach(() => installFixtures('many-projects'))

  test('⌘+x du dernier projet affiche une notification et ne supprime pas', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    const items = pane1(page).locator('.project-item')
    const initialCount = await items.count()
    // Couper jusqu'à 1 projet restant
    for (let i = 0; i < initialCount - 1; i++) {
      await pane1(page).locator('#main-panel').press('Meta+x')
      await expect(items).toHaveCount(initialCount - i - 1)
    }
    await expect(items).toHaveCount(1)
    // Tenter de couper le dernier
    await pane1(page).locator('#main-panel').press('Meta+x')
    await expect(items).toHaveCount(1)
    await expect(pane1(page).locator('#notification')).toBeVisible()
    await expect(pane1(page).locator('#notification')).toContainText('projet')
  })

})

// ─── COPY + PASTE DANS PROJECTLISTER ────────────────────────────────────────
// many-projects : Projet A, Projet B, Projet C

test.describe('⌘+c + ⌘+v dans ListerProject', () => {

  test.beforeEach(() => installFixtures('many-projects'))

  test('⌘+c + ⌘+v ajoute un projet au-dessus de la sélection', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    const items = pane1(page).locator('.project-item')
    const countBefore = await items.count()
    const selectedTitle = await pane1(page).locator('.project-item.selected .project-item__title').textContent()
    await pane1(page).locator('#main-panel').press('Meta+c')
    await pane1(page).locator('#main-panel').press('Meta+v')
    await pane1(page).locator('#main-panel').press('Enter')
    await expect(items).toHaveCount(countBefore + 1)
    await expect(items.nth(0).locator('.project-item__title')).toHaveText(selectedTitle.trim())
  })

  test('⌘+c + ⌘+v : l\'item collé est sélectionné', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    await pane1(page).locator('#main-panel').press('Meta+c')
    await pane1(page).locator('#main-panel').press('Meta+v')
    await pane1(page).locator('#main-panel').press('Enter')
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  })

  test('⌘+c + ⌘+v : l\'identifiant du projet collé est un UUID valide (pas vide)', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    await pane1(page).locator('#main-panel').press('Meta+c')
    await pane1(page).locator('#main-panel').press('Meta+v')
    await pane1(page).locator('#main-panel').press('Enter')
    await page.waitForLoadState('networkidle')
    const copiedId = await pane1(page).locator('.project-item').nth(0).getAttribute('data-id')
    expect(copiedId).toBeTruthy()
  })

  test('⌘+c + ⌘+v : l\'id collé est différent de l\'original', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    const originalId = await pane1(page).locator('.project-item').nth(0).getAttribute('data-id')
    await pane1(page).locator('#main-panel').press('Meta+c')
    await pane1(page).locator('#main-panel').press('Meta+v')
    await pane1(page).locator('#main-panel').press('Enter')
    await page.waitForLoadState('networkidle')
    const copiedId = await pane1(page).locator('.project-item').nth(0).getAttribute('data-id')
    expect(copiedId).not.toBe(originalId)
  })

  test('après ⌘+c + ⌘+v, le projet collé est persistant', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    const items = pane1(page).locator('.project-item')
    const countBefore = await items.count()
    await pane1(page).locator('#main-panel').press('Meta+c')
    await pane1(page).locator('#main-panel').press('Meta+v')
    await pane1(page).locator('#main-panel').press('Enter')
    await page.waitForLoadState('networkidle')
    await page.reload()
    await expect(items).toHaveCount(countBefore + 1)
  })

})

// ─── CUT + PASTE DANS PROJECTLISTER ─────────────────────────────────────────
// many-projects : Projet A, Projet B, Projet C

test.describe('⌘+x + ⌘+v dans ListerProject', () => {

  test.beforeEach(() => installFixtures('many-projects'))

  test('⌘+x + ⌘+v coupe et colle un projet au-dessus de la sélection', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    const items = pane1(page).locator('.project-item')
    const countBefore = await items.count()
    const cutTitle = await items.nth(0).textContent()
    await pane1(page).locator('#main-panel').press('Meta+x')
    await expect(items).toHaveCount(countBefore - 1)
    await pane1(page).locator('#main-panel').press('Meta+v')
    await expect(items).toHaveCount(countBefore)
    await expect(items.nth(0)).toContainText(cutTitle.trim())
  })

})

// ─── PASTE CROSS-PANEL MÊME TYPE ────────────────────────────────────────────
// two-projects-events : project-a (e1/e2/e3), project-b (e4/e5)

test.describe('⌘+v colle dans un autre ListerEvent (même type)', () => {

  test.beforeEach(() => installFixtures('two-projects-events'))

  test('⌘+c dans project-a puis ⌘+v dans project-b colle l\'item', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)

    // Entrer dans project-a → copier e1
    await pane1(page).locator('#main-panel').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    const copiedTitle = await pane1(page).locator('.event-item.selected').textContent()
    await pane1(page).locator('#main-panel').press('Meta+c')

    // Revenir à la liste des projets
    await pane1(page).locator('#main-panel').press('ArrowLeft')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)

    // Naviguer sur project-b puis entrer dedans
    await pane1(page).locator('#main-panel').press('ArrowDown')
    await pane1(page).locator('#main-panel').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)

    const items = pane1(page).locator('.event-item')
    const countBefore = await items.count()

    // Coller
    await pane1(page).locator('#main-panel').press('Meta+v')
    await expect(items).toHaveCount(countBefore + 1)
    await expect(items.nth(0)).toContainText(copiedTitle.trim())
  })

  test('⌘+x dans project-a puis ⌘+v dans project-b déplace l\'item', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)

    // Entrer dans project-a → couper e1
    await pane1(page).locator('#main-panel').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    const itemsA = pane1(page).locator('.event-item')
    const countABefore = await itemsA.count()
    const cutTitle = await pane1(page).locator('.event-item.selected').textContent()
    await pane1(page).locator('#main-panel').press('Meta+x')
    await expect(itemsA).toHaveCount(countABefore - 1)

    // Revenir à la liste des projets
    await pane1(page).locator('#main-panel').press('ArrowLeft')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)

    // Entrer dans project-b → coller
    await pane1(page).locator('#main-panel').press('ArrowDown')
    await pane1(page).locator('#main-panel').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    const itemsB = pane1(page).locator('.event-item')
    const countBBefore = await itemsB.count()
    await pane1(page).locator('#main-panel').press('Meta+v')
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
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    await pane1(page).locator('#main-panel').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)

    // Copier l'event sélectionné
    await pane1(page).locator('#main-panel').press('Meta+c')

    // Ouvrir le panneau brins
    await pane1(page).locator('#main-panel').press('b')
    await expect(pane1(page).locator('#brins-panel')).toBeVisible()

    const brins = pane1(page).locator('.brin-item')
    const countBefore = await brins.count()

    // Tenter de coller
    await pane1(page).locator('#main-panel').press('Meta+v')
    await expect(brins).toHaveCount(countBefore)
  })

  test('ne peut pas coller un event dans le panneau des projets', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
    await pane1(page).locator('#main-panel').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)

    // Copier l'event sélectionné
    await pane1(page).locator('#main-panel').press('Meta+c')

    // Revenir à la liste des projets
    await pane1(page).locator('#main-panel').press('ArrowLeft')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)

    const projects = pane1(page).locator('.project-item')
    const countBefore = await projects.count()

    // Tenter de coller
    await pane1(page).locator('#main-panel').press('Meta+v')
    await expect(projects).toHaveCount(countBefore)
  })

})
