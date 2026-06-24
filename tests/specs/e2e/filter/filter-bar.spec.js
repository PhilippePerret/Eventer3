import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

// Fixture with-event-states :
//   e1="Scène du bal"    state=1(ébauche)      meteo='ps' effet='ma'
//   e2="Arrivée à Paris" state=2(développement) meteo='pl' effet='nu'
//   e3="La trahison"     state=1(ébauche)      meteo='ps' effet='jr'

async function goToListerEvent(page, fixture = 'with-event-states') {
  installFixtures(fixture)
  await page.goto('/')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  await pane1(page).locator('#main-panel').press(':')
  await expect(pane1(page).locator('#main-panel .filter-bar')).toBeVisible()
}

async function openWidgetPopup(page, field) {
  await pane1(page).locator(`#main-panel .filter-widget[data-field="${field}"] .filter-widget__btn`).click()
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
}

// ─── Structure ────────────────────────────────────────────────────────────────

test("ListerEvent : barre de filtres cachée par défaut", async ({ page }) => {
  installFixtures('with-event-states')
  await page.goto('/')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  await expect(pane1(page).locator('#main-panel .filter-bar')).toBeHidden()
})

test("ListerEvent : ':' révèle la barre et focus le titre", async ({ page }) => {
  installFixtures('with-event-states')
  await page.goto('/')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  await pane1(page).locator('#main-panel').press(':')
  await expect(pane1(page).locator('#main-panel .filter-bar')).toBeVisible()
  await expect(pane1(page).locator('#main-panel .panel-search')).toBeFocused()
})

test("ListerEvent : widget titre présent dans la barre", async ({ page }) => {
  await goToListerEvent(page)
  await expect(pane1(page).locator('#main-panel .filter-bar .filter-widget[data-field="title"] .panel-search')).toBeVisible()
})

test("ListerEvent : widget état présent dans la barre", async ({ page }) => {
  await goToListerEvent(page)
  await expect(pane1(page).locator('#main-panel .filter-bar .filter-widget[data-field="state"]')).toBeVisible()
})

test("ListerEvent : widget météo présent dans la barre", async ({ page }) => {
  await goToListerEvent(page)
  await expect(pane1(page).locator('#main-panel .filter-bar .filter-widget[data-field="meteo"]')).toBeVisible()
})

test("ListerEvent : widget effet présent dans la barre", async ({ page }) => {
  await goToListerEvent(page)
  await expect(pane1(page).locator('#main-panel .filter-bar .filter-widget[data-field="effet"]')).toBeVisible()
})

// ─── Navigation clavier ───────────────────────────────────────────────────────

test("TAB depuis titre : focus widget état", async ({ page }) => {
  await goToListerEvent(page)
  await pane1(page).locator('#main-panel').press('Tab')
  await expect(pane1(page).locator('#main-panel .filter-widget[data-field="state"] .filter-widget__btn')).toBeFocused()
})

test("TAB depuis état : focus widget météo", async ({ page }) => {
  await goToListerEvent(page)
  await pane1(page).locator('#main-panel .filter-widget[data-field="state"] .filter-widget__btn').focus()
  await pane1(page).locator('#main-panel').press('Tab')
  await expect(pane1(page).locator('#main-panel .filter-widget[data-field="meteo"] .filter-widget__btn')).toBeFocused()
})

test("TAB depuis météo : focus widget effet", async ({ page }) => {
  await goToListerEvent(page)
  await pane1(page).locator('#main-panel .filter-widget[data-field="meteo"] .filter-widget__btn').focus()
  await pane1(page).locator('#main-panel').press('Tab')
  await expect(pane1(page).locator('#main-panel .filter-widget[data-field="effet"] .filter-widget__btn')).toBeFocused()
})

test("TAB depuis dernier widget : revient au champ titre", async ({ page }) => {
  await goToListerEvent(page)
  await pane1(page).locator('#main-panel .filter-widget[data-field="effet"] .filter-widget__btn').focus()
  await pane1(page).locator('#main-panel').press('Tab')
  await expect(pane1(page).locator('#main-panel .panel-search')).toBeFocused()
})

test("widget état focusé : ArrowDown ouvre le popup", async ({ page }) => {
  await goToListerEvent(page)
  await pane1(page).locator('#main-panel .filter-widget[data-field="state"] .filter-widget__btn').focus()
  await pane1(page).locator('#main-panel').press('ArrowDown')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
})

test("widget état focusé : ArrowDown n'affecte pas la sélection d'items", async ({ page }) => {
  await goToListerEvent(page)
  const firstItem = pane1(page).locator('.event-item').first()
  await expect(firstItem).toHaveClass(/selected/)
  await pane1(page).locator('#main-panel .filter-widget[data-field="state"] .filter-widget__btn').focus()
  await pane1(page).locator('#main-panel').press('ArrowDown')
  await expect(firstItem).toHaveClass(/selected/)
})

test("TAB depuis popup ouvert : ferme popup et focus widget suivant", async ({ page }) => {
  await goToListerEvent(page)
  await openWidgetPopup(page, 'state')
  await pane1(page).locator('#main-panel').press('Tab')
  await expect(pane1(page).locator('.popup-select')).toBeHidden()
  await expect(pane1(page).locator('#main-panel .filter-widget[data-field="meteo"] .filter-widget__btn')).toBeFocused()
})

// ─── Filtre état ──────────────────────────────────────────────────────────────

test("état : cliquer le bouton ouvre le popup", async ({ page }) => {
  await goToListerEvent(page)
  await openWidgetPopup(page, 'state')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
})

test("état : sélectionner 'ébauche' → filtre immédiat, 2 events visibles", async ({ page }) => {
  await goToListerEvent(page)
  await openWidgetPopup(page, 'state')
  await pane1(page).locator('.popup-select__option[data-value="1"]').click()
  await expect(pane1(page).locator('.event-item:not(.hidden)')).toHaveCount(2)
  await expect(pane1(page).locator('.event-item.hidden')).toHaveCount(1)
  await pane1(page).locator('#main-panel').press('Enter')
})

test("état : multi-sélection ébauche + développement → 3 events", async ({ page }) => {
  await goToListerEvent(page)
  await openWidgetPopup(page, 'state')
  await pane1(page).locator('.popup-select__option[data-value="1"]').click()
  await expect(pane1(page).locator('.event-item:not(.hidden)')).toHaveCount(2)
  await pane1(page).locator('.popup-select__option[data-value="2"]').click()
  await expect(pane1(page).locator('.event-item:not(.hidden)')).toHaveCount(3)
  await pane1(page).locator('#main-panel').press('Enter')
})

test("état : désélectionner réaffiche tout", async ({ page }) => {
  await goToListerEvent(page)
  await openWidgetPopup(page, 'state')
  await pane1(page).locator('.popup-select__option[data-value="1"]').click()
  await expect(pane1(page).locator('.event-item:not(.hidden)')).toHaveCount(2)
  await pane1(page).locator('.popup-select__option[data-value="1"]').click()
  await expect(pane1(page).locator('.event-item:not(.hidden)')).toHaveCount(3)
  await pane1(page).locator('#main-panel').press('Enter')
})

test("état + titre : filtre cumulatif", async ({ page }) => {
  await goToListerEvent(page)
  await openWidgetPopup(page, 'state')
  await pane1(page).locator('.popup-select__option[data-value="1"]').click()
  await expect(pane1(page).locator('.event-item:not(.hidden)')).toHaveCount(2)
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel .panel-search').fill('bal')
  await expect(pane1(page).locator('.event-item:not(.hidden)')).toHaveCount(1)
})

// ─── Filtre météo ─────────────────────────────────────────────────────────────

test("météo : cliquer le bouton ouvre le popup", async ({ page }) => {
  await goToListerEvent(page)
  await openWidgetPopup(page, 'meteo')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
})

test("météo : sélectionner 'ps' → filtre immédiat, 2 events visibles (e1 + e3)", async ({ page }) => {
  await goToListerEvent(page)
  await openWidgetPopup(page, 'meteo')
  await pane1(page).locator('.popup-select__option[data-value="ps"]').click()
  await expect(pane1(page).locator('.event-item:not(.hidden)')).toHaveCount(2)
  await expect(pane1(page).locator('.event-item.hidden')).toHaveCount(1)
  await pane1(page).locator('#main-panel').press('Enter')
})

test("météo : sélectionner 'pl' → filtre immédiat, 1 event visible (e2)", async ({ page }) => {
  await goToListerEvent(page)
  await openWidgetPopup(page, 'meteo')
  await pane1(page).locator('.popup-select__option[data-value="pl"]').click()
  await expect(pane1(page).locator('.event-item:not(.hidden)')).toHaveCount(1)
  await pane1(page).locator('#main-panel').press('Enter')
})

// ─── Filtre effet ─────────────────────────────────────────────────────────────

test("effet : cliquer le bouton ouvre le popup", async ({ page }) => {
  await goToListerEvent(page)
  await openWidgetPopup(page, 'effet')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
})

test("effet : sélectionner 'nu' → filtre immédiat, 1 event visible (e2)", async ({ page }) => {
  await goToListerEvent(page)
  await openWidgetPopup(page, 'effet')
  await pane1(page).locator('.popup-select__option[data-value="nu"]').click()
  await expect(pane1(page).locator('.event-item:not(.hidden)')).toHaveCount(1)
  await pane1(page).locator('#main-panel').press('Enter')
})

test("effet : sélectionner 'jr' → filtre immédiat, 1 event visible (e3)", async ({ page }) => {
  await goToListerEvent(page)
  await openWidgetPopup(page, 'effet')
  await pane1(page).locator('.popup-select__option[data-value="jr"]').click()
  await expect(pane1(page).locator('.event-item:not(.hidden)')).toHaveCount(1)
  await pane1(page).locator('#main-panel').press('Enter')
})

test("météo + effet : filtre cumulatif (ps + jr → e3 seul)", async ({ page }) => {
  await goToListerEvent(page)
  await openWidgetPopup(page, 'meteo')
  await pane1(page).locator('.popup-select__option[data-value="ps"]').click()
  await expect(pane1(page).locator('.event-item:not(.hidden)')).toHaveCount(2)
  await pane1(page).locator('#main-panel').press('Enter')
  await openWidgetPopup(page, 'effet')
  await pane1(page).locator('.popup-select__option[data-value="jr"]').click()
  await expect(pane1(page).locator('.event-item:not(.hidden)')).toHaveCount(1)
  await pane1(page).locator('#main-panel').press('Enter')
})
