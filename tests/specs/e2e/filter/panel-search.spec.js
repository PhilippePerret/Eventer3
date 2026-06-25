import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

// Fixtures:
//   with-brins-and-persos : b1="Mon brin", b2="Autre brin", c1="Cyrano", c2="Roxane"
//   with-styles           : titre, note-rouge

async function goToListerEvent(page, fixture) {
  installFixtures(fixture)
  await page.goto('/')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
}

async function revealFilter(page, panelSelector = '#main-panel') {
  await expect(pane1(page).locator(panelSelector)).toBeVisible()
  await pane1(page).locator('#main-panel').press(':')
  await expect(pane1(page).locator(`${panelSelector} .filter-bar`)).toBeVisible()
}

// ─── ListerBrin ───────────────────────────────────────────────────────────────

test("panneau brins : champ .panel-search visible après ':'", async ({ page }) => {
  await goToListerEvent(page, 'with-brins-and-persos')
  await pane1(page).locator('#main-panel').press('b')
  await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  await revealFilter(page, '#brins-panel')
  await expect(pane1(page).locator('#brins-panel .panel-search')).toBeVisible()
})

test("panneau brins : taper 'mon' cache 'Autre brin'", async ({ page }) => {
  await goToListerEvent(page, 'with-brins-and-persos')
  await pane1(page).locator('#main-panel').press('b')
  await expect(pane1(page).locator('.brin-row')).toHaveCount(2)
  await revealFilter(page, '#brins-panel')
  await pane1(page).locator('#brins-panel .panel-search').fill('mon')
  await expect(pane1(page).locator('.brin-row:not(.hidden)')).toHaveCount(1)
  await expect(pane1(page).locator('.brin-row.hidden')).toHaveCount(1)
})

test("panneau brins : vider le champ réaffiche tout", async ({ page }) => {
  await goToListerEvent(page, 'with-brins-and-persos')
  await pane1(page).locator('#main-panel').press('b')
  await revealFilter(page, '#brins-panel')
  await pane1(page).locator('#brins-panel .panel-search').fill('mon')
  await expect(pane1(page).locator('.brin-row:not(.hidden)')).toHaveCount(1)
  await pane1(page).locator('#brins-panel .panel-search').fill('')
  await expect(pane1(page).locator('.brin-row:not(.hidden)')).toHaveCount(2)
})

test("panneau brins : filtre remis à zéro à la fermeture/réouverture", async ({ page }) => {
  await goToListerEvent(page, 'with-brins-and-persos')
  await pane1(page).locator('#main-panel').press('b')
  await revealFilter(page, '#brins-panel')
  await pane1(page).locator('#brins-panel .panel-search').fill('mon')
  await expect(pane1(page).locator('.brin-row:not(.hidden)')).toHaveCount(1)
  await pane1(page).locator('#main-panel').press('Escape') // fermer
  await pane1(page).locator('#main-panel').press('b')     // rouvrir
  await expect(pane1(page).locator('.brin-row:not(.hidden)')).toHaveCount(2)
  const inputVal = await pane1(page).locator('#brins-panel .panel-search').inputValue()
  expect(inputVal).toBe('')
})

// ─── ListerPerso ─────────────────────────────────────────────────────────────

test("panneau persos : champ .panel-search visible après ':'", async ({ page }) => {
  await goToListerEvent(page, 'with-brins-and-persos')
  await pane1(page).locator('#main-panel').press('p')
  await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  await revealFilter(page, '#persos-panel')
  await expect(pane1(page).locator('#persos-panel .panel-search')).toBeVisible()
})

test("panneau persos : taper 'cyr' cache 'Roxane'", async ({ page }) => {
  await goToListerEvent(page, 'with-brins-and-persos')
  await pane1(page).locator('#main-panel').press('p')
  await expect(pane1(page).locator('.perso-row')).toHaveCount(2)
  await revealFilter(page, '#persos-panel')
  await pane1(page).locator('#persos-panel .panel-search').fill('cyr')
  await expect(pane1(page).locator('.perso-row:not(.hidden)')).toHaveCount(1)
  await expect(pane1(page).locator('.perso-row.hidden')).toHaveCount(1)
})

// ─── ListerStyle ─────────────────────────────────────────────────────────────

test("panneau styles : champ .panel-search visible après ':'", async ({ page }) => {
  await goToListerEvent(page, 'with-styles')
  await pane1(page).locator('#main-panel').press('s')
  await expect(pane1(page).locator('#style-panel')).toBeVisible()
  await revealFilter(page, '#style-panel')
  await expect(pane1(page).locator('#style-panel .panel-search')).toBeVisible()
})

test("panneau styles : taper 'titre' cache 'note-rouge'", async ({ page }) => {
  await goToListerEvent(page, 'with-styles')
  await pane1(page).locator('#main-panel').press('s')
  await expect(pane1(page).locator('.style-row')).toHaveCount(2)
  await revealFilter(page, '#style-panel')
  await pane1(page).locator('#style-panel .panel-search').fill('titre')
  await expect(pane1(page).locator('.style-row:not(.hidden)')).toHaveCount(1)
  await expect(pane1(page).locator('.style-row.hidden')).toHaveCount(1)
})

// ─── ListerEvent ─────────────────────────────────────────────────────────────

test("liste events : champ .panel-search visible après ':'", async ({ page }) => {
  await goToListerEvent(page, 'with-brins-and-persos')
  await revealFilter(page, '#main-panel')
  await expect(pane1(page).locator('#main-panel .panel-search')).toBeVisible()
})

test("liste projets : champ .panel-search visible après ':'", async ({ page }) => {
  installFixtures('with-brins-and-persos')
  await page.goto('/')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await revealFilter(page, '#main-panel')
  await expect(pane1(page).locator('#main-panel .panel-search')).toBeVisible()
})

test("liste events : taper '1' cache 'Événement 2'", async ({ page }) => {
  await goToListerEvent(page, 'with-brins-and-persos')
  await revealFilter(page, '#main-panel')
  await expect(pane1(page).locator('.event-item')).toHaveCount(2)
  await pane1(page).locator('#main-panel .panel-search').fill('1')
  await expect(pane1(page).locator('.event-item:not(.hidden)')).toHaveCount(1)
  await expect(pane1(page).locator('.event-item.hidden')).toHaveCount(1)
})

test("liste events : vider le champ réaffiche tout", async ({ page }) => {
  await goToListerEvent(page, 'with-brins-and-persos')
  await revealFilter(page, '#main-panel')
  await pane1(page).locator('#main-panel .panel-search').fill('1')
  await expect(pane1(page).locator('.event-item:not(.hidden)')).toHaveCount(1)
  await pane1(page).locator('#main-panel .panel-search').fill('')
  await expect(pane1(page).locator('.event-item:not(.hidden)')).toHaveCount(2)
})

test("liste events : filtre remis à zéro quand on revient à la liste", async ({ page }) => {
  await goToListerEvent(page, 'with-brins-and-persos')
  await revealFilter(page, '#main-panel')
  await pane1(page).locator('#main-panel .panel-search').fill('1')
  await expect(pane1(page).locator('.event-item:not(.hidden)')).toHaveCount(1)
  await pane1(page).locator('#main-panel').press('ArrowLeft') // retour projets
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await pane1(page).locator('#main-panel').press('ArrowRight') // retour events
  await expect(pane1(page).locator('.event-item:not(.hidden)')).toHaveCount(2)
  const inputVal = await pane1(page).locator('#main-panel .panel-search').inputValue()
  expect(inputVal).toBe('')
})
