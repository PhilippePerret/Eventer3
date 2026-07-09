// Origine : tests/specs/e2e/filter/panel-search.spec.js
//
// CES TESTS N'ONT PEUT-ÊTRE PLUS LIEU D'ÊTRE OU DOIVENT
// ÊTRE FUSIONNÉS, LE CAS ÉCHÉANT, AVEC LES TESTS DU FILTRE
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

// Fixtures:
//   with-brins-and-persos : b1="Mon brin", b2="Autre brin", c1="Cyrano", c2="Roxane"
//   with-styles           : titre, note-rouge

// SKIP : fonctionnalité panel-search (touche ':' → .filter-bar) non encore implémentée

async function goToListerEvent(page, fixture) {
  installFixtures(fixture)
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
}

async function revealFilter(page, panelSelector = '#events-panel') {
  await expect(pane1(page).locator(panelSelector)).toBeVisible()
  await press(page, ':')
  await expect(pane1(page).locator(`${panelSelector} .filter-bar`)).toBeVisible()
}

test.describe('panel-search', () => {

// ─── ListerBrin ───────────────────────────────────────────────────────────────

test("panneau brins : champ .panel-search visible après ':'", async ({ page }) => {
  await goToListerEvent(page, 'with-brins-and-persos')
  await press(page, 'b')
  await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  await revealFilter(page, '#brins-panel')
  await expect(pane1(page).locator('#brins-panel .panel-search')).toBeVisible()
})

test("panneau brins : taper 'mon' cache 'Autre brin'", async ({ page }) => {
  await goToListerEvent(page, 'with-brins-and-persos')
  await press(page, 'b')
  await expect(pane1(page).locator('.brin-item')).toHaveCount(2)
  await revealFilter(page, '#brins-panel')
  await pane1(page).locator('#brins-panel .panel-search').fill('mon')
  await expect(pane1(page).locator('.brin-item:not(.hidden)')).toHaveCount(1)
  await expect(pane1(page).locator('.brin-item.hidden')).toHaveCount(1)
})

test("panneau brins : vider le champ réaffiche tout", async ({ page }) => {
  await goToListerEvent(page, 'with-brins-and-persos')
  await press(page, 'b')
  await revealFilter(page, '#brins-panel')
  await pane1(page).locator('#brins-panel .panel-search').fill('mon')
  await expect(pane1(page).locator('.brin-item:not(.hidden)')).toHaveCount(1)
  const brinSearch = pane1(page).locator('#brins-panel .panel-search')
  await brinSearch.click({ clickCount: 3 })
  await brinSearch.press('Backspace')
  await expect(pane1(page).locator('.brin-item:not(.hidden)')).toHaveCount(2)
})

test("panneau brins : filtre remis à zéro à la fermeture/réouverture", async ({ page }) => {
  await goToListerEvent(page, 'with-brins-and-persos')
  await press(page, 'b')
  await revealFilter(page, '#brins-panel')
  await pane1(page).locator('#brins-panel .panel-search').fill('mon')
  await expect(pane1(page).locator('.brin-item:not(.hidden)')).toHaveCount(1)
  await press(page, 'b') // fermer
  await press(page, 'b') // rouvrir
  await expect(pane1(page).locator('.brin-item:not(.hidden)')).toHaveCount(2)
  const inputVal = await pane1(page).locator('#brins-panel .panel-search').inputValue()
  expect(inputVal).toBe('')
})

// ─── ListerPerso ─────────────────────────────────────────────────────────────

test("panneau persos : champ .panel-search visible après ':'", async ({ page }) => {
  await goToListerEvent(page, 'with-brins-and-persos')
  await press(page, 'p')
  await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  await revealFilter(page, '#persos-panel')
  await expect(pane1(page).locator('#persos-panel .panel-search')).toBeVisible()
})

test("panneau persos : taper 'cyr' cache 'Roxane'", async ({ page }) => {
  await goToListerEvent(page, 'with-brins-and-persos')
  await press(page, 'p')
  await expect(pane1(page).locator('.perso-item')).toHaveCount(2)
  await revealFilter(page, '#persos-panel')
  await pane1(page).locator('#persos-panel .panel-search').fill('cyr')
  await expect(pane1(page).locator('.perso-item:not(.hidden)')).toHaveCount(1)
  await expect(pane1(page).locator('.perso-item.hidden')).toHaveCount(1)
})

// ─── ListerStyle ─────────────────────────────────────────────────────────────

test("panneau styles : champ .panel-search visible après ':'", async ({ page }) => {
  await goToListerEvent(page, 'with-styles')
  await press(page, 's')
  await expect(pane1(page).locator('#style-panel')).toBeVisible()
  await revealFilter(page, '#style-panel')
  await expect(pane1(page).locator('#style-panel .panel-search')).toBeVisible()
})

test("panneau styles : taper 'titre' cache 'note-rouge'", async ({ page }) => {
  await goToListerEvent(page, 'with-styles')
  await press(page, 's')
  await expect(pane1(page).locator('.style-row')).toHaveCount(2)
  await revealFilter(page, '#style-panel')
  await pane1(page).locator('#style-panel .panel-search').fill('titre')
  await expect(pane1(page).locator('.style-row:not(.hidden)')).toHaveCount(1)
  await expect(pane1(page).locator('.style-row.hidden')).toHaveCount(1)
})

// ─── ListerEvent ─────────────────────────────────────────────────────────────

test("liste events : champ .panel-search visible après ':'", async ({ page }) => {
  await goToListerEvent(page, 'with-brins-and-persos')
  await revealFilter(page, '#events-panel')
  await expect(pane1(page).locator('#events-panel .panel-search')).toBeVisible()
})

test("liste projets : champ .panel-search visible après ':'", async ({ page }) => {
  installFixtures('with-brins-and-persos')
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await revealFilter(page, '#projects-panel')
  await expect(pane1(page).locator('#projects-panel .panel-search')).toBeVisible()
})

test("liste events : taper '1' cache 'Événement 2'", async ({ page }) => {
  await goToListerEvent(page, 'with-brins-and-persos')
  await revealFilter(page, '#events-panel')
  await expect(pane1(page).locator('.event-item')).toHaveCount(2)
  await pane1(page).locator('#events-panel .panel-search').fill('1')
  await expect(pane1(page).locator('.event-item:not(.hidden)')).toHaveCount(1)
  await expect(pane1(page).locator('.event-item.hidden')).toHaveCount(1)
})

test("liste events : vider le champ réaffiche tout", async ({ page }) => {
  await goToListerEvent(page, 'with-brins-and-persos')
  await revealFilter(page, '#events-panel')
  await pane1(page).locator('#events-panel .panel-search').fill('1')
  await expect(pane1(page).locator('.event-item:not(.hidden)')).toHaveCount(1)
  await pane1(page).locator('#events-panel .panel-search').press('Backspace')
  await expect(pane1(page).locator('.event-item:not(.hidden)')).toHaveCount(2)
})

test("liste events : filtre remis à zéro quand on revient à la liste", async ({ page }) => {
  await goToListerEvent(page, 'with-brins-and-persos')
  await revealFilter(page, '#events-panel')
  await pane1(page).locator('#events-panel .panel-search').fill('1')
  await expect(pane1(page).locator('.event-item:not(.hidden)')).toHaveCount(1)
  await press(page, 'ArrowLeft') // retour projets
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await press(page, 'ArrowRight') // retour events
  await expect(pane1(page).locator('.event-item:not(.hidden)')).toHaveCount(2)
  const inputVal = await pane1(page).locator('#events-panel .panel-search').inputValue()
  expect(inputVal).toBe('')
})

}) // test.describe.skip
