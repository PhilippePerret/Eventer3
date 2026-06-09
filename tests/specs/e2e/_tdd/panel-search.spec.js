import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect } from '../__setup__.js'

// Fixtures:
//   with-brins-and-persos : b1="Mon brin", b2="Autre brin", c1="Cyrano", c2="Roxane"
//   with-styles           : titre, note-rouge

async function goToEventLister(page, fixture) {
  installFixtures(fixture)
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
}

// ─── BrinLister ───────────────────────────────────────────────────────────────

test("panneau brins : champ .panel-search présent", async ({ page }) => {
  await goToEventLister(page, 'with-brins-and-persos')
  await page.keyboard.press('b')
  await expect(page.locator('#brin-panel')).toBeVisible()
  await expect(page.locator('#brin-panel .panel-search')).toBeVisible()
})

test("panneau brins : taper 'mon' cache 'Autre brin'", async ({ page }) => {
  await goToEventLister(page, 'with-brins-and-persos')
  await page.keyboard.press('b')
  await expect(page.locator('.brin-row')).toHaveCount(2)
  await page.locator('.panel-search').fill('mon')
  await expect(page.locator('.brin-row:not(.hidden)')).toHaveCount(1)
  await expect(page.locator('.brin-row.hidden')).toHaveCount(1)
})

test("panneau brins : vider le champ réaffiche tout", async ({ page }) => {
  await goToEventLister(page, 'with-brins-and-persos')
  await page.keyboard.press('b')
  await page.locator('.panel-search').fill('mon')
  await expect(page.locator('.brin-row:not(.hidden)')).toHaveCount(1)
  await page.locator('.panel-search').fill('')
  await expect(page.locator('.brin-row:not(.hidden)')).toHaveCount(2)
})

test("panneau brins : filtre remis à zéro à la fermeture/réouverture", async ({ page }) => {
  await goToEventLister(page, 'with-brins-and-persos')
  await page.keyboard.press('b')
  await page.locator('.panel-search').fill('mon')
  await expect(page.locator('.brin-row:not(.hidden)')).toHaveCount(1)
  await page.keyboard.press('Escape') // fermer
  await page.keyboard.press('b')     // rouvrir
  await expect(page.locator('.brin-row:not(.hidden)')).toHaveCount(2)
  const inputVal = await page.locator('.panel-search').inputValue()
  expect(inputVal).toBe('')
})

// ─── PersoLister ─────────────────────────────────────────────────────────────

test("panneau persos : champ .panel-search présent", async ({ page }) => {
  await goToEventLister(page, 'with-brins-and-persos')
  await page.keyboard.press('p')
  await expect(page.locator('#perso-panel')).toBeVisible()
  await expect(page.locator('#perso-panel .panel-search')).toBeVisible()
})

test("panneau persos : taper 'cyr' cache 'Roxane'", async ({ page }) => {
  await goToEventLister(page, 'with-brins-and-persos')
  await page.keyboard.press('p')
  await expect(page.locator('.perso-row')).toHaveCount(2)
  await page.locator('.panel-search').fill('cyr')
  await expect(page.locator('.perso-row:not(.hidden)')).toHaveCount(1)
  await expect(page.locator('.perso-row.hidden')).toHaveCount(1)
})

// ─── StyleLister ─────────────────────────────────────────────────────────────

test("panneau styles : champ .panel-search présent", async ({ page }) => {
  await goToEventLister(page, 'with-styles')
  await page.keyboard.press('s')
  await expect(page.locator('#style-panel')).toBeVisible()
  await expect(page.locator('#style-panel .panel-search')).toBeVisible()
})

test("panneau styles : taper 'titre' cache 'note-rouge'", async ({ page }) => {
  await goToEventLister(page, 'with-styles')
  await page.keyboard.press('s')
  await expect(page.locator('.style-row')).toHaveCount(2)
  await page.locator('.panel-search').fill('titre')
  await expect(page.locator('.style-row:not(.hidden)')).toHaveCount(1)
  await expect(page.locator('.style-row.hidden')).toHaveCount(1)
})

// ─── EventLister ─────────────────────────────────────────────────────────────

test("liste events : champ .panel-search toujours présent", async ({ page }) => {
  await goToEventLister(page, 'with-brins-and-persos')
  await expect(page.locator('#main-panel .panel-search')).toBeVisible()
})

test("liste events : absent dans la liste des projets", async ({ page }) => {
  installFixtures('with-brins-and-persos')
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await expect(page.locator('#main-panel .panel-search')).toHaveCount(0)
})

test("liste events : taper '1' cache 'Événement 2'", async ({ page }) => {
  await goToEventLister(page, 'with-brins-and-persos')
  await expect(page.locator('.event-item')).toHaveCount(2)
  await page.locator('#main-panel .panel-search').fill('1')
  await expect(page.locator('.event-item:not(.hidden)')).toHaveCount(1)
  await expect(page.locator('.event-item.hidden')).toHaveCount(1)
})

test("liste events : vider le champ réaffiche tout", async ({ page }) => {
  await goToEventLister(page, 'with-brins-and-persos')
  await page.locator('#main-panel .panel-search').fill('1')
  await expect(page.locator('.event-item:not(.hidden)')).toHaveCount(1)
  await page.locator('#main-panel .panel-search').fill('')
  await expect(page.locator('.event-item:not(.hidden)')).toHaveCount(2)
})

test("liste events : filtre remis à zéro quand on revient à la liste", async ({ page }) => {
  await goToEventLister(page, 'with-brins-and-persos')
  await page.locator('#main-panel .panel-search').fill('1')
  await expect(page.locator('.event-item:not(.hidden)')).toHaveCount(1)
  await page.keyboard.press('ArrowLeft') // retour projets
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight') // retour events
  await expect(page.locator('.event-item:not(.hidden)')).toHaveCount(2)
  const inputVal = await page.locator('#main-panel .panel-search').inputValue()
  expect(inputVal).toBe('')
})
