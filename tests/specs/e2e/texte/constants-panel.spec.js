import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

// Fixture deep-events : Projet A (UUID-1) avec e1/e2/e3

test.describe('ConstantsPanel', () => {

  test.beforeEach(() => installFixtures('deep-events'))

  // ─── Ouverture ─────────────────────────────────────────────────────────────

  test('q ouvre le panneau depuis ProjectLister', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('q')
    await expect(pane1(page).locator('#constants-panel')).toBeVisible()
  })

  test('q ouvre le panneau depuis EventLister', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    await pane1(page).locator('body').press('q')
    await expect(pane1(page).locator('#constants-panel')).toBeVisible()
  })

  test('Escape ferme le panneau', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('q')
    await expect(pane1(page).locator('#constants-panel')).toBeVisible()
    await pane1(page).locator('body').press('Escape')
    await expect(pane1(page).locator('#constants-panel')).not.toBeVisible()
  })

  // ─── Structure ─────────────────────────────────────────────────────────────

  test('le panneau a exactement deux colonnes', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('q')
    await expect(pane1(page).locator('.constants-panel__column')).toHaveCount(2)
  })

  test('chaque colonne contient des lignes constante/valeur', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('q')
    await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
    const rows = pane1(page).locator('.constants-row')
    const count = await rows.count()
    expect(count).toBeGreaterThan(4)
    await expect(pane1(page).locator('.constants-row__name').first()).toBeVisible()
    await expect(pane1(page).locator('.constants-row__value').first()).toBeVisible()
  })

  // ─── Navigation ────────────────────────────────────────────────────────────

  test('la première ligne est sélectionnée à l\'ouverture', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('q')
    await expect(pane1(page).locator('.constants-row').first()).toHaveClass(/selected/)
  })

  test('↓ sélectionne la ligne suivante', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('q')
    await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
    await pane1(page).locator('body').press('ArrowDown')
    await expect(pane1(page).locator('.constants-row').nth(1)).toHaveClass(/selected/)
    await expect(pane1(page).locator('.constants-row').first()).not.toHaveClass(/selected/)
  })

  test('↑ remonte d\'une ligne', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('q')
    await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
    await pane1(page).locator('body').press('ArrowDown')
    await pane1(page).locator('body').press('ArrowDown')
    await pane1(page).locator('body').press('ArrowUp')
    await expect(pane1(page).locator('.constants-row').nth(1)).toHaveClass(/selected/)
  })

  // ─── Édition ───────────────────────────────────────────────────────────────

  test('Tab met le focus sur le champ constante de la ligne sélectionnée', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('q')
    await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
    await pane1(page).locator('body').press('Tab')
    await expect(pane1(page).locator('.constants-row').first().locator('.constants-row__name')).toBeFocused()
  })

  test('Tab depuis le champ constante met le focus sur le champ valeur', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('q')
    await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
    await pane1(page).locator('body').press('Tab')
    await pane1(page).locator('body').press('Tab')
    await expect(pane1(page).locator('.constants-row').first().locator('.constants-row__value')).toBeFocused()
  })

  test('Shift+Tab depuis le champ valeur revient sur le champ constante (même ligne)', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('q')
    await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
    await pane1(page).locator('body').press('Tab')
    await pane1(page).locator('body').press('Tab')
    await expect(pane1(page).locator('.constants-row').first().locator('.constants-row__value')).toBeFocused()
    await pane1(page).locator('body').press('Shift+Tab')
    await expect(pane1(page).locator('.constants-row').first().locator('.constants-row__name')).toBeFocused()
  })

  test('Shift+Tab depuis le champ constante va sur la valeur de la ligne précédente', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('q')
    await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
    await pane1(page).locator('body').press('ArrowDown')
    await pane1(page).locator('body').press('Tab')
    await expect(pane1(page).locator('.constants-row').nth(1).locator('.constants-row__name')).toBeFocused()
    await pane1(page).locator('body').press('Shift+Tab')
    await expect(pane1(page).locator('.constants-row').first().locator('.constants-row__value')).toBeFocused()
  })

  // ─── Persistance ───────────────────────────────────────────────────────────

  test('constante + valeur : sauvegardée à la fermeture', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('ArrowRight')
    await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
    await pane1(page).locator('body').press('q')
    await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
    await pane1(page).locator('body').press('Tab')
    await page.keyboard.type('VILLE')
    await pane1(page).locator('body').press('Tab')
    await page.keyboard.type('Paris')
    await pane1(page).locator('body').press('Escape')
    await expect(pane1(page).locator('#constants-panel')).not.toBeVisible()
    // Réouverture
    await pane1(page).locator('body').press('q')
    await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
    await expect(pane1(page).locator('.constants-row__name').first()).toHaveValue('VILLE')
    await expect(pane1(page).locator('.constants-row__value').first()).toHaveValue('Paris')
  })

  test('valeur sans constante : ignorée', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('q')
    await pane1(page).locator('body').press('Tab')          // focus name (vide)
    await pane1(page).locator('body').press('Tab')          // focus value
    await page.keyboard.type('Paris')
    await pane1(page).locator('body').press('Escape')
    await pane1(page).locator('body').press('q')
    await expect(pane1(page).locator('.constants-row__value').first()).toHaveValue('')
  })

  test('constante sans valeur : ignorée', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('q')
    await pane1(page).locator('body').press('Tab')
    await page.keyboard.type('VILLE')         // nom sans valeur
    await pane1(page).locator('body').press('Escape')
    await pane1(page).locator('body').press('q')
    await expect(pane1(page).locator('.constants-row__name').first()).toHaveValue('')
  })

  test('lignes vides intercalées : les lignes valides restent sauvegardées', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('q')
    await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
    // Ligne 0 : VILLE / Paris
    await pane1(page).locator('body').press('Tab')
    await page.keyboard.type('VILLE')
    await pane1(page).locator('body').press('Tab')
    await page.keyboard.type('Paris')
    // Ligne 1 : vide (skip)
    await pane1(page).locator('body').press('ArrowDown')
    // Ligne 2 : HEROS / Arthur
    await pane1(page).locator('body').press('ArrowDown')
    await pane1(page).locator('body').press('Tab')
    await page.keyboard.type('HEROS')
    await pane1(page).locator('body').press('Tab')
    await page.keyboard.type('Arthur')
    await pane1(page).locator('body').press('Escape')
    await expect(pane1(page).locator('#constants-panel')).not.toBeVisible()
    // Vérification
    await pane1(page).locator('body').press('q')
    await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
    await expect(pane1(page).locator('.constants-row__name').first()).toHaveValue('VILLE')
    await expect(pane1(page).locator('.constants-row__name').nth(2)).toHaveValue('HEROS')
  })

})
