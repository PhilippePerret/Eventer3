// Origine : tests/specs/e2e/keyboard/keyboard-copy-cut-paste.spec.js
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1, press } from '../__setup__.js'

// ─── COPY ⌘+c ───────────────────────────────────────────────────────────────
// many-events : project-a (hl:true, e1/e2/e3), project-b (sans events)

test.describe('⌘+c dans ListerEvent', () => {

  test.beforeEach(() => installFixtures('many-events'))

  async function goToListerEvent(page) {
    await page.goto('/')
    await pane1(page).locator('#projects-panel').waitFor()
    await press(page, 'ArrowRight')
    await pane1(page).locator('#events-panel').waitFor()
  }

  test('⌘+c ne retire pas l\'item original de la liste', async ({ page }) => {
    await goToListerEvent(page)
    const items = pane1(page).locator('.event-item')
    const countBefore = await items.count()
    await press(page, 'Meta+c')
    await expect(items).toHaveCount(countBefore)
  })

  test('⌘+c + ⌘+v ajoute un item au-dessus de la sélection', async ({ page }) => {
    await goToListerEvent(page)
    const items = pane1(page).locator('.event-item')
    const countBefore = await items.count()
    const selectedTitle = await pane1(page).locator('.event-item.selected').textContent()
    await press(page, 'Meta+c')
    await press(page, 'Meta+v')
    await expect(items).toHaveCount(countBefore + 1)
    await expect(items.nth(0)).toContainText(selectedTitle.trim())
  })

  test('⌘+c + ⌘+v : l\'item collé est sélectionné', async ({ page }) => {
    await goToListerEvent(page)
    await press(page, 'Meta+c')
    await press(page, 'Meta+v')
    await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  })

  test('⌘+c + ⌘+v : l\'item collé a un id différent de l\'original', async ({ page }) => {
    await goToListerEvent(page)
    const items = pane1(page).locator('.event-item')
    const countBefore = await items.count()
    const originalId = await items.nth(0).getAttribute('data-id')
    await press(page, 'Meta+c')
    await press(page, 'Meta+v')
    await expect(items).toHaveCount(countBefore + 1)
    const copiedId = await items.nth(0).getAttribute('data-id')
    expect(copiedId).not.toBe(originalId)
  })

  test('après ⌘+c + ⌘+v, le collage est persistant', async ({ page }) => {
    await goToListerEvent(page)
    const items = pane1(page).locator('.event-item')
    const countBefore = await items.count()
    await press(page, 'Meta+c')
    await press(page, 'Meta+v')
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
    await pane1(page).locator('#projects-panel').waitFor()
    await press(page, 'ArrowRight')
    await pane1(page).locator('#events-panel').waitFor()
  }

  test('⌘+x retire l\'item sélectionné de la liste', async ({ page }) => {
    await goToListerEvent(page)
    const items = pane1(page).locator('.event-item')
    const countBefore = await items.count()
    await press(page, 'Meta+x')
    await expect(items).toHaveCount(countBefore - 1)
  })

  test('⌘+x + ⌘+v restitue l\'item au-dessus de la sélection', async ({ page }) => {
    await goToListerEvent(page)
    const items = pane1(page).locator('.event-item')
    const countBefore = await items.count()
    const cutTitle = await items.nth(0).textContent()
    await press(page, 'Meta+x')
    await expect(items).toHaveCount(countBefore - 1)
    await press(page, 'Meta+v')
    await expect(items).toHaveCount(countBefore)
    await expect(items.nth(0)).toContainText(cutTitle.trim())
  })

  test('⌘+x + ⌘+v : l\'item collé conserve le même id que l\'original', async ({ page }) => {
    await goToListerEvent(page)
    const items = pane1(page).locator('.event-item')
    const originalId = await items.nth(0).getAttribute('data-id')
    await press(page, 'Meta+x')
    await press(page, 'Meta+v')
    await expect(items.nth(0)).toHaveAttribute('data-id', originalId)
  })

  test('après ⌘+x + ⌘+v, la suppression initiale est annulée (persistance)', async ({ page }) => {
    await goToListerEvent(page)
    const items = pane1(page).locator('.event-item')
    const countBefore = await items.count()
    await press(page, 'Meta+x')
    await press(page, 'Meta+v')
    await page.waitForLoadState('networkidle')
    await page.reload()
    await goToListerEvent(page)
    await expect(items).toHaveCount(countBefore)
  })

})

// ─── CUT : INTERDICTION SUR DERNIER ITEM ────────────────────────────────────

test.describe('⌘+x interdit sur le dernier item', () => {

  test.beforeEach(() => installFixtures('with-brins'))

  test('⌘+x du dernier event affiche une notification et ne supprime pas', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('#projects-panel').waitFor()
    await press(page, 'ArrowRight')
    await pane1(page).locator('#events-panel').waitFor()
    const items = pane1(page).locator('.event-item')
    await press(page, 'Meta+x')
    await expect(items).toHaveCount(1)
    await press(page, 'Meta+x')
    await expect(items).toHaveCount(1)
    await expect(pane1(page).locator('#notification')).toBeVisible()
    await expect(pane1(page).locator('#notification')).toContainText('évènement')
  })

  test('⌘+x du dernier brin affiche une notification mentionnant "brin"', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('#projects-panel').waitFor()
    await press(page, 'ArrowRight')
    await pane1(page).locator('#events-panel').waitFor()
    await press(page, 'b')
    await pane1(page).locator('#brins-panel').waitFor()
    const items = pane1(page).locator('.brin-item')
    await press(page, 'Meta+x')
    await expect(items).toHaveCount(1)
    await press(page, 'Meta+x')
    await expect(items).toHaveCount(1)
    await expect(pane1(page).locator('#notification')).toBeVisible()
    await expect(pane1(page).locator('#notification')).toContainText('brin')
  })

})

test.describe('⌘+x interdit sur le dernier projet (ListerProject)', () => {

  test.beforeEach(() => installFixtures('many-projects'))

  test('⌘+x du dernier projet affiche une notification et ne supprime pas', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('#projects-panel').waitFor()
    const items = pane1(page).locator('.project-item')
    const initialCount = await items.count()
    for (let i = 0; i < initialCount - 1; i++) {
      await press(page, 'Meta+x')
      await expect(items).toHaveCount(initialCount - i - 1)
    }
    await expect(items).toHaveCount(1)
    await press(page, 'Meta+x')
    await expect(items).toHaveCount(1)
    await expect(pane1(page).locator('#notification')).toBeVisible()
    await expect(pane1(page).locator('#notification')).toContainText('projet')
  })

})

// ─── COPY + PASTE DANS PROJECTLISTER ────────────────────────────────────────

test.describe('⌘+c + ⌘+v dans ListerProject', () => {

  test.beforeEach(() => installFixtures('many-projects'))

  test('⌘+c + ⌘+v ajoute un projet au-dessus de la sélection', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('#projects-panel').waitFor()
    const items = pane1(page).locator('.project-item')
    const countBefore = await items.count()
    const selectedTitle = await pane1(page).locator('.project-item.selected .project-title').textContent()
    await press(page, 'Meta+c')
    await press(page, 'Meta+v')
    await press(page, 'Enter')
    await expect(items).toHaveCount(countBefore + 1)
    await expect(items.nth(0).locator('.project-title')).toHaveText(selectedTitle.trim())
  })

  test('⌘+c + ⌘+v : l\'item collé est sélectionné', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('#projects-panel').waitFor()
    await press(page, 'Meta+c')
    await press(page, 'Meta+v')
    await press(page, 'Enter')
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  })

  test('⌘+c + ⌘+v : l\'identifiant du projet collé est un UUID valide (pas vide)', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('#projects-panel').waitFor()
    await press(page, 'Meta+c')
    await press(page, 'Meta+v')
    await press(page, 'Enter')
    await page.waitForLoadState('networkidle')
    const copiedId = await pane1(page).locator('.project-item').nth(0).getAttribute('data-id')
    expect(copiedId).toBeTruthy()
  })

  test('⌘+c + ⌘+v : l\'id collé est différent de l\'original', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('#projects-panel').waitFor()
    const items = pane1(page).locator('.project-item')
    const originalId = await items.nth(0).getAttribute('data-id')
    await press(page, 'Meta+c')
    await press(page, 'Meta+v')
    await press(page, 'Enter')
    await expect(items).toHaveCount(4)
    const copiedId = await items.nth(0).getAttribute('data-id')
    expect(copiedId).not.toBe(originalId)
  })

  test('après ⌘+c + ⌘+v, le projet collé est persistant', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('#projects-panel').waitFor()
    const items = pane1(page).locator('.project-item')
    const countBefore = await items.count()
    await press(page, 'Meta+c')
    await press(page, 'Meta+v')
    await press(page, 'Enter')
    await expect(items).toHaveCount(countBefore + 1)
    await page.reload()
    await pane1(page).locator('#projects-panel').waitFor()
    await expect(items).toHaveCount(countBefore + 1)
  })

})

// ─── CUT + PASTE DANS PROJECTLISTER ─────────────────────────────────────────

test.describe('⌘+x + ⌘+v dans ListerProject', () => {

  test.beforeEach(() => installFixtures('many-projects'))

  test('⌘+x + ⌘+v coupe et colle un projet au-dessus de la sélection', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('#projects-panel').waitFor()
    const items = pane1(page).locator('.project-item')
    const countBefore = await items.count()
    const cutTitle = await items.nth(0).textContent()
    await press(page, 'Meta+x')
    await expect(items).toHaveCount(countBefore - 1)
    await press(page, 'Meta+v')
    await expect(items).toHaveCount(countBefore)
    await expect(items.nth(0)).toContainText(cutTitle.trim())
  })

})

// ─── PASTE CROSS-PANEL MÊME TYPE ────────────────────────────────────────────

test.describe('⌘+v colle dans un autre ListerEvent (même type)', () => {

  test.beforeEach(() => installFixtures('two-projects-events'))

  test('⌘+c dans project-a puis ⌘+v dans project-b colle l\'item', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('#projects-panel').waitFor()
    await press(page, 'ArrowRight')
    await pane1(page).locator('#events-panel').waitFor()
    const copiedTitle = await pane1(page).locator('.event-item.selected').textContent()
    await press(page, 'Meta+c')
    await press(page, 'ArrowLeft')
    await pane1(page).locator('#projects-panel').waitFor()
    await press(page, 'ArrowDown')
    await press(page, 'ArrowRight')
    await pane1(page).locator('#events-panel').waitFor()
    const items = pane1(page).locator('.event-item')
    const countBefore = await items.count()
    await press(page, 'Meta+v')
    await expect(items).toHaveCount(countBefore + 1)
    await expect(items.nth(0)).toContainText(copiedTitle.trim())
  })

  test('⌘+x dans project-a puis ⌘+v dans project-b déplace l\'item', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('#projects-panel').waitFor()
    await press(page, 'ArrowRight')
    await pane1(page).locator('#events-panel').waitFor()
    const itemsA = pane1(page).locator('.event-item')
    const countABefore = await itemsA.count()
    const cutTitle = await pane1(page).locator('.event-item.selected').textContent()
    await press(page, 'Meta+x')
    await expect(itemsA).toHaveCount(countABefore - 1)
    await press(page, 'ArrowLeft')
    await pane1(page).locator('#projects-panel').waitFor()
    await press(page, 'ArrowDown')
    await press(page, 'ArrowRight')
    await pane1(page).locator('#events-panel').waitFor()
    const itemsB = pane1(page).locator('.event-item')
    const countBBefore = await itemsB.count()
    await press(page, 'Meta+v')
    await expect(itemsB).toHaveCount(countBBefore + 1)
    await expect(itemsB.nth(0)).toContainText(cutTitle.trim())
  })

})

// ─── PASTE CROSS-TYPE BLOQUÉ ─────────────────────────────────────────────────

test.describe('⌘+v bloqué entre types différents', () => {

  test.beforeEach(() => installFixtures('with-brins'))

  test('ne peut pas coller un event dans le panneau des brins', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('#projects-panel').waitFor()
    await press(page, 'ArrowRight')
    await pane1(page).locator('#events-panel').waitFor()
    await press(page, 'Meta+c')
    await press(page, 'b')
    await pane1(page).locator('#brins-panel').waitFor()
    const brins = pane1(page).locator('.brin-item')
    const countBefore = await brins.count()
    await press(page, 'Meta+v')
    await expect(brins).toHaveCount(countBefore)
  })

  test('ne peut pas coller un event dans le panneau des projets', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('#projects-panel').waitFor()
    await press(page, 'ArrowRight')
    await pane1(page).locator('#events-panel').waitFor()
    await press(page, 'Meta+c')
    await press(page, 'ArrowLeft')
    await pane1(page).locator('#projects-panel').waitFor()
    const projects = pane1(page).locator('.project-item')
    const countBefore = await projects.count()
    await press(page, 'Meta+v')
    await expect(projects).toHaveCount(countBefore)
  })

})
