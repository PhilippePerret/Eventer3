import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

// Fixture with-tokens :
//   e1 "/VILLE/ est belle"         → "Paris est belle"              (brin_ids=[b1])
//   e2 "PP arrive à /VILLE/"       → "Phil arrive à Paris"
//   e3 "PPpat arrive à /VILLE/"    → "Philippe Perret arrive à Paris"
//   b1 "Le brin de /VILLE/"        → "Le brin de Paris"
//   c1 "Phil" badge=PP patronyme="Philippe Perret"
//   c2 "Héros de /VILLE/" badge=HR → "Héros de Paris"
//   constante VILLE=Paris

test.describe('Token replacement dans les titres', () => {

  test.beforeEach(() => installFixtures('with-tokens'))

  // ─── Events ────────────────────────────────────────────────────────────────

  test('constante /VILLE/ remplacée dans le titre de l\'event', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('ArrowRight')
    await expect(pane1(page).locator('.event-text').first()).toHaveText('Paris est belle')
  })

  test('badge PP remplacé par le titre du personnage', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('ArrowRight')
    await expect(pane1(page).locator('.event-text').nth(1)).toHaveText('Phil arrive à Paris')
  })

  test('badge PPpat remplacé par le patronyme du personnage', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('ArrowRight')
    await expect(pane1(page).locator('.event-text').nth(2)).toHaveText('Philippe Perret arrive à Paris')
  })

  // ─── Brins ─────────────────────────────────────────────────────────────────

  test('constante /VILLE/ remplacée dans le titre du brin', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('ArrowRight')
    await expect(pane1(page).locator('.event-text').first()).toBeVisible()
    await pane1(page).locator('body').press('b')
    await expect(pane1(page).locator('#brin-panel')).toBeVisible()
    await expect(pane1(page).locator('.brin-item__title').first()).toHaveText('Le brin de Paris')
  })

  // ─── Persos ────────────────────────────────────────────────────────────────

  test('constante /VILLE/ remplacée dans le titre du perso', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('ArrowRight')
    await expect(pane1(page).locator('.event-text').first()).toBeVisible()
    await pane1(page).locator('body').press('p')
    await expect(pane1(page).locator('#perso-panel')).toBeVisible()
    await expect(pane1(page).locator('.perso-item__title').nth(1)).toHaveText('Héros de Paris')
  })

  // ─── Titre du panneau brins ─────────────────────────────────────────────────

  test('titre du panneau brins utilise le titre rendu (tokens remplacés)', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('ArrowRight')
    await expect(pane1(page).locator('.event-text').first()).toBeVisible()
    await pane1(page).locator('body').press('b')
    await expect(pane1(page).locator('#brin-panel')).toBeVisible()
    await expect(pane1(page).locator('#brin-panel .panel-title')).toContainText('Paris est belle')
  })

  // ─── Nouvel item après définition constante ─────────────────────────────────

  test('nouvel event créé après définition constante : remplacement immédiat', async ({ page }) => {
    await page.goto('/')
    await pane1(page).locator('body').press('ArrowRight')
    await expect(pane1(page).locator('.event-text').first()).toBeVisible()
    // Définir PAYS=France
    await pane1(page).locator('body').press('q')
    await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
    await pane1(page).locator('body').press('ArrowDown')
    await pane1(page).locator('body').press('Tab')
    await page.keyboard.type('PAYS')
    await pane1(page).locator('body').press('Tab')
    await page.keyboard.type('France')
    await pane1(page).locator('body').press('Meta+Enter')
    await expect(pane1(page).locator('#constants-panel')).not.toBeVisible()
    // Créer un nouvel event avec /PAYS/
    await pane1(page).locator('body').press('n')
    const titleInput = pane1(page).locator('.event-item.editing input[name="title"]')
    await titleInput.fill('/PAYS/ est grand')
    await pane1(page).locator('body').press('Enter')
    await expect(pane1(page).locator('.event-text').nth(1)).toHaveText('France est grand')
  })

})
