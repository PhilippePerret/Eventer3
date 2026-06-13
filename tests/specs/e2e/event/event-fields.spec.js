import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

// Fixture with-event-states :
//   e1="Scène du bal"    meteo='ps'(☀️)  effet='ma'(Matin) lieu=null
//   e2="Arrivée à Paris" meteo='pl'(🌨️) effet='nu'(Nuit)  lieu=null
//   e3="La trahison"     meteo='ps'(☀️)  effet='jr'(Jour)  lieu=null

async function goToEventLister(page) {
  installFixtures('with-event-states')
  await page.goto('/')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
}

async function enterEditionOnFirst(page) {
  await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
  await page.keyboard.press('Enter')
  await expect(pane1(page).locator('.event-item.editing')).toBeVisible()
  await expect(pane1(page).locator('.event-item.editing input[name="title"]')).toBeFocused()
}

// ─── Affichage ────────────────────────────────────────────────────────────────

test("event row : badge météo affiché (e1 → ☀️)", async ({ page }) => {
  await goToEventLister(page)
  await expect(pane1(page).locator('.event-item').first().locator('.event-meteo')).toHaveText('☀️')
})

test("event row : badge effet affiché (e1 → Matin)", async ({ page }) => {
  await goToEventLister(page)
  await expect(pane1(page).locator('.event-item').first().locator('.event-effet')).toHaveText('Matin')
})

test("event row : badge lieu vide si non défini", async ({ page }) => {
  await goToEventLister(page)
  await expect(pane1(page).locator('.event-item').first().locator('.event-lieu')).toHaveText('')
})

// ─── TAB en mode édition ──────────────────────────────────────────────────────

test("édition : TAB depuis titre focus trigger état", async ({ page }) => {
  await goToEventLister(page)
  await enterEditionOnFirst(page)
  await page.keyboard.press('Tab')
  await expect(pane1(page).locator('.event-item.editing button[data-field-name="state"]')).toBeFocused()
})

test("édition : TAB depuis état focus trigger météo", async ({ page }) => {
  await goToEventLister(page)
  await enterEditionOnFirst(page)
  await page.keyboard.press('Tab') // → state
  await page.keyboard.press('Tab') // → meteo
  await expect(pane1(page).locator('.event-item.editing button[data-field-name="meteo"]')).toBeFocused()
})

test("édition : TAB depuis météo focus trigger effet", async ({ page }) => {
  await goToEventLister(page)
  await enterEditionOnFirst(page)
  await page.keyboard.press('Tab') // → state
  await page.keyboard.press('Tab') // → meteo
  await page.keyboard.press('Tab') // → effet
  await expect(pane1(page).locator('.event-item.editing button[data-field-name="effet"]')).toBeFocused()
})

test("édition : TAB depuis effet focus trigger lieu", async ({ page }) => {
  await goToEventLister(page)
  await enterEditionOnFirst(page)
  await page.keyboard.press('Tab') // → state
  await page.keyboard.press('Tab') // → meteo
  await page.keyboard.press('Tab') // → effet
  await page.keyboard.press('Tab') // → lieu
  await expect(pane1(page).locator('.event-item.editing button[data-field-name="lieu"]')).toBeFocused()
})

test("édition : TAB depuis lieu revient au titre", async ({ page }) => {
  await goToEventLister(page)
  await enterEditionOnFirst(page)
  for (let i = 0; i < 5; i++) await page.keyboard.press('Tab') // titre→state→meteo→effet→lieu→titre
  await expect(pane1(page).locator('.event-item.editing input[name="title"]')).toBeFocused()
})

// ─── Ouverture popup ─────────────────────────────────────────────────────────

test("édition : ArrowDown sur trigger météo ouvre popup", async ({ page }) => {
  await goToEventLister(page)
  await enterEditionOnFirst(page)
  await page.keyboard.press('Tab') // → state
  await page.keyboard.press('Tab') // → meteo
  await page.keyboard.press('ArrowDown')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
})

test("édition : ArrowDown sur trigger effet ouvre popup", async ({ page }) => {
  await goToEventLister(page)
  await enterEditionOnFirst(page)
  await page.keyboard.press('Tab') // → state
  await page.keyboard.press('Tab') // → meteo
  await page.keyboard.press('Tab') // → effet
  await page.keyboard.press('ArrowDown')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
})

test("édition : ArrowDown sur trigger lieu ouvre popup", async ({ page }) => {
  await goToEventLister(page)
  await enterEditionOnFirst(page)
  await page.keyboard.press('Tab') // → state
  await page.keyboard.press('Tab') // → meteo
  await page.keyboard.press('Tab') // → effet
  await page.keyboard.press('Tab') // → lieu
  await page.keyboard.press('ArrowDown')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
})

// ─── Persistance ─────────────────────────────────────────────────────────────

test("météo : sélection 'pl' persiste après sauvegarde", async ({ page }) => {
  await goToEventLister(page)
  await enterEditionOnFirst(page)
  await page.keyboard.press('Tab') // → state
  await page.keyboard.press('Tab') // → meteo
  await page.keyboard.press('ArrowDown') // ouvre popup
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  await pane1(page).locator('.popup-select__option[data-value="pl"]').click()
  await page.keyboard.press('Enter') // confirme edition
  await expect(pane1(page).locator('.event-item').first().locator('.event-meteo')).toHaveText('🌨️')
  // Reload et vérifier persistance
  await page.reload()
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  await expect(pane1(page).locator('.event-item').first().locator('.event-meteo')).toHaveText('🌨️')
})

test("lieu : sélection 'ext' persiste après sauvegarde", async ({ page }) => {
  await goToEventLister(page)
  await enterEditionOnFirst(page)
  await page.keyboard.press('Tab') // → state
  await page.keyboard.press('Tab') // → meteo
  await page.keyboard.press('Tab') // → effet
  await page.keyboard.press('Tab') // → lieu
  await page.keyboard.press('ArrowDown') // ouvre popup
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  await pane1(page).locator('.popup-select__option[data-value="ext"]').click()
  await page.keyboard.press('Enter') // confirme edition
  await expect(pane1(page).locator('.event-item').first().locator('.event-lieu')).toHaveText('Extérieur')
  // Reload et vérifier persistance
  await page.reload()
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  await expect(pane1(page).locator('.event-item').first().locator('.event-lieu')).toHaveText('Extérieur')
})

// ─── Incompatibilités ────────────────────────────────────────────────────────

// e1 a meteo='ps' → effets incompatibles : au, cr, nu
test("incompatibilité : meteo=ps → effet popup grise au/cr/nu", async ({ page }) => {
  await goToEventLister(page)
  await enterEditionOnFirst(page) // e1 : meteo='ps'
  await page.keyboard.press('Tab') // → state
  await page.keyboard.press('Tab') // → meteo
  await page.keyboard.press('Tab') // → effet
  await page.keyboard.press('ArrowDown') // ouvre popup effet
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  await expect(pane1(page).locator('.popup-select__option[data-value="au"]')).toHaveClass(/disabled/)
  await expect(pane1(page).locator('.popup-select__option[data-value="cr"]')).toHaveClass(/disabled/)
  await expect(pane1(page).locator('.popup-select__option[data-value="nu"]')).toHaveClass(/disabled/)
  await expect(pane1(page).locator('.popup-select__option[data-value="ma"]')).not.toHaveClass(/disabled/)
  await page.keyboard.press('Escape')
})

// e2 a effet='nu' → météos incompatibles : ps, vo, di
test("incompatibilité : effet=nu → météo popup grise ps/vo/di", async ({ page }) => {
  await goToEventLister(page)
  // sélectionner e2
  await page.keyboard.press('ArrowDown')
  await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)
  await page.keyboard.press('Enter') // ouvre édition sur e2
  await expect(pane1(page).locator('.event-item.editing')).toBeVisible()
  await expect(pane1(page).locator('.event-item.editing input[name="title"]')).toBeFocused()
  await page.keyboard.press('Tab') // → state
  await page.keyboard.press('Tab') // → meteo
  await page.keyboard.press('ArrowDown') // ouvre popup meteo
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  await expect(pane1(page).locator('.popup-select__option[data-value="ps"]')).toHaveClass(/disabled/)
  await expect(pane1(page).locator('.popup-select__option[data-value="vo"]')).toHaveClass(/disabled/)
  await expect(pane1(page).locator('.popup-select__option[data-value="di"]')).toHaveClass(/disabled/)
  await expect(pane1(page).locator('.popup-select__option[data-value="pl"]')).not.toHaveClass(/disabled/)
  await page.keyboard.press('Escape')
})

test("incompatibilité : option grisée non sélectionnable (Space ignoré)", async ({ page }) => {
  await goToEventLister(page)
  await enterEditionOnFirst(page) // e1 : meteo='ps', effet='ma'
  await page.keyboard.press('Tab') // → state
  await page.keyboard.press('Tab') // → meteo
  await page.keyboard.press('Tab') // → effet
  await page.keyboard.press('ArrowDown') // ouvre popup effet
  // Navigate to 'nu' (nuit) which is disabled
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  // trouver index de 'nu' dans la liste et naviguer
  const nuOption = pane1(page).locator('.popup-select__option[data-value="nu"]')
  await expect(nuOption).toHaveClass(/disabled/)
  await nuOption.click() // clic sur option désactivée
  // le popup doit rester ouvert
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  await page.keyboard.press('Escape')
  // l'effet n'a pas changé
  await page.keyboard.press('Escape') // annule édition
  await expect(pane1(page).locator('.event-item').first().locator('.event-effet')).toHaveText('Matin')
})
