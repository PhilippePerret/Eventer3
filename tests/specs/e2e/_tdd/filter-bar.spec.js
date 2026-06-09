import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect } from '../__setup__.js'

// Fixture with-event-states :
//   e1="Scène du bal"    state=1(ébauche)      meteo='ps' effet='ma'
//   e2="Arrivée à Paris" state=2(développement) meteo='pl' effet='nu'
//   e3="La trahison"     state=1(ébauche)      meteo='ps' effet='jr'

async function goToEventLister(page, fixture = 'with-event-states') {
  installFixtures(fixture)
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
}

// ─── Structure ────────────────────────────────────────────────────────────────

test("EventLister : barre de filtres présente", async ({ page }) => {
  await goToEventLister(page)
  await expect(page.locator('#main-panel .filter-bar')).toBeVisible()
})

test("EventLister : widget titre présent dans la barre", async ({ page }) => {
  await goToEventLister(page)
  await expect(page.locator('#main-panel .filter-bar .filter-widget[data-field="title"] .panel-search')).toBeVisible()
})

test("EventLister : widget état présent dans la barre", async ({ page }) => {
  await goToEventLister(page)
  await expect(page.locator('#main-panel .filter-bar .filter-widget[data-field="state"]')).toBeVisible()
})

test("EventLister : widget météo présent dans la barre", async ({ page }) => {
  await goToEventLister(page)
  await expect(page.locator('#main-panel .filter-bar .filter-widget[data-field="meteo"]')).toBeVisible()
})

test("EventLister : widget effet présent dans la barre", async ({ page }) => {
  await goToEventLister(page)
  await expect(page.locator('#main-panel .filter-bar .filter-widget[data-field="effet"]')).toBeVisible()
})

// ─── Navigation clavier ───────────────────────────────────────────────────────

test("':' focus le champ titre", async ({ page }) => {
  await goToEventLister(page)
  await page.keyboard.press(':')
  await expect(page.locator('#main-panel .panel-search')).toBeFocused()
})

test("TAB depuis titre : focus widget état", async ({ page }) => {
  await goToEventLister(page)
  await page.locator('#main-panel .panel-search').focus()
  await page.keyboard.press('Tab')
  await expect(page.locator('#main-panel .filter-widget[data-field="state"] .filter-widget__btn')).toBeFocused()
})

// ─── Filtre état ──────────────────────────────────────────────────────────────

test("état : cliquer le bouton ouvre le dropdown", async ({ page }) => {
  await goToEventLister(page)
  await page.locator('#main-panel .filter-widget[data-field="state"] .filter-widget__btn').click()
  await expect(page.locator('#main-panel .filter-widget[data-field="state"] .filter-widget__dropdown')).toBeVisible()
})

test("état : sélectionner 'ébauche' → 2 events visibles", async ({ page }) => {
  await goToEventLister(page)
  await page.locator('#main-panel .filter-widget[data-field="state"] .filter-widget__btn').click()
  await page.locator('#main-panel .filter-widget[data-field="state"] .filter-widget__option[data-value="1"]').click()
  await expect(page.locator('.event-item:not(.hidden)')).toHaveCount(2)
  await expect(page.locator('.event-item.hidden')).toHaveCount(1)
})

test("état : multi-sélection ébauche + développement → 3 events", async ({ page }) => {
  await goToEventLister(page)
  await page.locator('#main-panel .filter-widget[data-field="state"] .filter-widget__btn').click()
  await page.locator('#main-panel .filter-widget[data-field="state"] .filter-widget__option[data-value="1"]').click()
  await page.locator('#main-panel .filter-widget[data-field="state"] .filter-widget__option[data-value="2"]').click()
  await expect(page.locator('.event-item:not(.hidden)')).toHaveCount(3)
})

test("état : désélectionner réaffiche tout", async ({ page }) => {
  await goToEventLister(page)
  await page.locator('#main-panel .filter-widget[data-field="state"] .filter-widget__btn').click()
  await page.locator('#main-panel .filter-widget[data-field="state"] .filter-widget__option[data-value="1"]').click()
  await expect(page.locator('.event-item:not(.hidden)')).toHaveCount(2)
  await page.locator('#main-panel .filter-widget[data-field="state"] .filter-widget__option[data-value="1"]').click()
  await expect(page.locator('.event-item:not(.hidden)')).toHaveCount(3)
})

test("état + titre : filtre cumulatif", async ({ page }) => {
  await goToEventLister(page)
  await page.locator('#main-panel .filter-widget[data-field="state"] .filter-widget__btn').click()
  await page.locator('#main-panel .filter-widget[data-field="state"] .filter-widget__option[data-value="1"]').click()
  await expect(page.locator('.event-item:not(.hidden)')).toHaveCount(2)
  await page.locator('#main-panel .panel-search').fill('bal')
  await expect(page.locator('.event-item:not(.hidden)')).toHaveCount(1)
})

// ─── Filtre météo ─────────────────────────────────────────────────────────────

test("météo : cliquer le bouton ouvre le dropdown", async ({ page }) => {
  await goToEventLister(page)
  await page.locator('#main-panel .filter-widget[data-field="meteo"] .filter-widget__btn').click()
  await expect(page.locator('#main-panel .filter-widget[data-field="meteo"] .filter-widget__dropdown')).toBeVisible()
})

test("météo : sélectionner 'ps' → 2 events visibles (e1 + e3)", async ({ page }) => {
  await goToEventLister(page)
  await page.locator('#main-panel .filter-widget[data-field="meteo"] .filter-widget__btn').click()
  await page.locator('#main-panel .filter-widget[data-field="meteo"] .filter-widget__option[data-value="ps"]').click()
  await expect(page.locator('.event-item:not(.hidden)')).toHaveCount(2)
  await expect(page.locator('.event-item.hidden')).toHaveCount(1)
})

test("météo : sélectionner 'pl' → 1 event visible (e2)", async ({ page }) => {
  await goToEventLister(page)
  await page.locator('#main-panel .filter-widget[data-field="meteo"] .filter-widget__btn').click()
  await page.locator('#main-panel .filter-widget[data-field="meteo"] .filter-widget__option[data-value="pl"]').click()
  await expect(page.locator('.event-item:not(.hidden)')).toHaveCount(1)
})

// ─── Filtre effet ─────────────────────────────────────────────────────────────

test("effet : cliquer le bouton ouvre le dropdown", async ({ page }) => {
  await goToEventLister(page)
  await page.locator('#main-panel .filter-widget[data-field="effet"] .filter-widget__btn').click()
  await expect(page.locator('#main-panel .filter-widget[data-field="effet"] .filter-widget__dropdown')).toBeVisible()
})

test("effet : sélectionner 'nu' → 1 event visible (e2)", async ({ page }) => {
  await goToEventLister(page)
  await page.locator('#main-panel .filter-widget[data-field="effet"] .filter-widget__btn').click()
  await page.locator('#main-panel .filter-widget[data-field="effet"] .filter-widget__option[data-value="nu"]').click()
  await expect(page.locator('.event-item:not(.hidden)')).toHaveCount(1)
})

test("effet : sélectionner 'jr' → 1 event visible (e3)", async ({ page }) => {
  await goToEventLister(page)
  await page.locator('#main-panel .filter-widget[data-field="effet"] .filter-widget__btn').click()
  await page.locator('#main-panel .filter-widget[data-field="effet"] .filter-widget__option[data-value="jr"]').click()
  await expect(page.locator('.event-item:not(.hidden)')).toHaveCount(1)
})

test("météo + effet : filtre cumulatif (ps + jr → e3 seul)", async ({ page }) => {
  await goToEventLister(page)
  // ps → e1 + e3 (2 events)
  await page.locator('#main-panel .filter-widget[data-field="meteo"] .filter-widget__btn').click()
  await page.locator('#main-panel .filter-widget[data-field="meteo"] .filter-widget__option[data-value="ps"]').click()
  await expect(page.locator('.event-item:not(.hidden)')).toHaveCount(2)
  // ajouter effet=jr → seul e3 (meteo=ps ET effet=jr)
  await page.locator('#main-panel .filter-widget[data-field="effet"] .filter-widget__btn').click()
  await page.locator('#main-panel .filter-widget[data-field="effet"] .filter-widget__option[data-value="jr"]').click()
  await expect(page.locator('.event-item:not(.hidden)')).toHaveCount(1)
})
