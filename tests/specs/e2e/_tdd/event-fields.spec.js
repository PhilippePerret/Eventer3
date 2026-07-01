import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

// Fixture with-event-states :
//   e1="Scène du bal"    meteo='ps'(☀️)  effet='ma'(Matin) lieu=null
//   e2="Arrivée à Paris" meteo='pl'(🌨️) effet='nu'(Nuit)  lieu=null
//   e3="La trahison"     meteo='ps'(☀️)  effet='jr'(Jour)  lieu=null

async function goToListerEvent(page) {
  await installFixtures('with-event-states')
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
}

async function enterEditionOnFirst(page) {
  await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
  await press(page, 'Enter')
  await expect(pane1(page).locator('.event-item.editing')).toBeVisible()
  await expect(pane1(page).locator('.event-item.editing [data-field="title"]')).toBeFocused()
}

// ─── Affichage ────────────────────────────────────────────────────────────────

test("event row : badge météo affiché (e1 → ☀️)", async ({ page }) => {
  await goToListerEvent(page)
  await expect(pane1(page).locator('.event-item').first().locator('.event-meteo')).toHaveText('☀️')
})

test("event row : badge effet affiché (e1 → Matin)", async ({ page }) => {
  await goToListerEvent(page)
  await expect(pane1(page).locator('.event-item').first().locator('.event-effet')).toHaveText('Matin')
})

test("event row : badge lieu vide si non défini", async ({ page }) => {
  await goToListerEvent(page)
  await expect(pane1(page).locator('.event-item').first().locator('.event-lieu')).toHaveText('')
})

// ─── TAB en mode édition ──────────────────────────────────────────────────────

test("édition : TAB depuis titre focus trigger état", async ({ page }) => {
  await goToListerEvent(page)
  await enterEditionOnFirst(page)
  await press(page, 'Tab')
  await expect(pane1(page).locator('.event-item.editing [data-field="state"]')).toBeFocused()
})

test("édition : TAB depuis état focus trigger météo", async ({ page }) => {
  await goToListerEvent(page)
  await enterEditionOnFirst(page)
  await press(page, 'Tab') // → state
  await press(page, 'Tab') // → meteo
  await expect(pane1(page).locator('.event-item.editing [data-field="meteo"]')).toBeFocused()
})

test("édition : TAB depuis météo focus trigger effet", async ({ page }) => {
  await goToListerEvent(page)
  await enterEditionOnFirst(page)
  await press(page, 'Tab') // → state
  await press(page, 'Tab') // → meteo
  await press(page, 'Tab') // → effet
  await expect(pane1(page).locator('.event-item.editing [data-field="effet"]')).toBeFocused()
})

test("édition : TAB depuis effet focus trigger lieu", async ({ page }) => {
  await goToListerEvent(page)
  await enterEditionOnFirst(page)
  await press(page, 'Tab') // → state
  await press(page, 'Tab') // → meteo
  await press(page, 'Tab') // → effet
  await press(page, 'Tab') // → lieu
  await expect(pane1(page).locator('.event-item.editing [data-field="lieu"]')).toBeFocused()
})

test("édition : TAB depuis lieu revient au titre", async ({ page }) => {
  await goToListerEvent(page)
  await enterEditionOnFirst(page)
  for (let i = 0; i < 5; i++) await press(page, 'Tab') // titre→state→meteo→effet→lieu→titre
  await expect(pane1(page).locator('.event-item.editing [data-field="title"]')).toBeFocused()
})

// ─── Ouverture popup ─────────────────────────────────────────────────────────

test("édition : ArrowDown sur trigger météo ouvre popup", async ({ page }) => {
  await goToListerEvent(page)
  await enterEditionOnFirst(page)
  await press(page, 'Tab') // → state
  await press(page, 'Tab') // → meteo
  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
})

test("édition : ArrowDown sur trigger effet ouvre popup", async ({ page }) => {
  await goToListerEvent(page)
  await enterEditionOnFirst(page)
  await press(page, 'Tab') // → state
  await press(page, 'Tab') // → meteo
  await press(page, 'Tab') // → effet
  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
})

test("édition : ArrowDown sur trigger lieu ouvre popup", async ({ page }) => {
  await goToListerEvent(page)
  await enterEditionOnFirst(page)
  await press(page, 'Tab') // → state
  await press(page, 'Tab') // → meteo
  await press(page, 'Tab') // → effet
  await press(page, 'Tab') // → lieu
  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
})

// ─── Persistance ─────────────────────────────────────────────────────────────

test("météo : sélection 'pl' persiste après sauvegarde", async ({ page }) => {
  await goToListerEvent(page)
  await enterEditionOnFirst(page)
  await press(page, 'Tab') // → state
  await press(page, 'Tab') // → meteo
  await press(page, 'ArrowDown') // ouvre popup
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  await pane1(page).locator('.popup-select__option[data-value="pl"]').click()
  await press(page, 'Enter') // confirme edition
  await expect(pane1(page).locator('.event-item').first().locator('.event-meteo')).toHaveText('🌨️')
  // Reload et vérifier persistance
  await page.waitForLoadState('networkidle')
  await page.reload()
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await expect(pane1(page).locator('.event-item').first().locator('.event-meteo')).toHaveText('🌨️')
})

test("lieu : sélection 'ext' persiste après sauvegarde", async ({ page }) => {
  await goToListerEvent(page)
  await enterEditionOnFirst(page)
  await press(page, 'Tab') // → state
  await press(page, 'Tab') // → meteo
  await press(page, 'Tab') // → effet
  await press(page, 'Tab') // → lieu
  await press(page, 'ArrowDown') // ouvre popup
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  await pane1(page).locator('.popup-select__option[data-value="ext"]').click()
  await press(page, 'Enter') // confirme edition
  await expect(pane1(page).locator('.event-item').first().locator('.event-lieu')).toHaveText('Extérieur')
  // Reload et vérifier persistance
  await page.waitForLoadState('networkidle')
  await page.reload()
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await expect(pane1(page).locator('.event-item').first().locator('.event-lieu')).toHaveText('Extérieur')
})

// ─── Incompatibilités ────────────────────────────────────────────────────────

// e1 a meteo='ps' → effets incompatibles : au, cr, nu
test("incompatibilité : meteo=ps → effet popup grise au/cr/nu", async ({ page }) => {
  await goToListerEvent(page)
  await enterEditionOnFirst(page) // e1 : meteo='ps'
  await press(page, 'Tab') // → state
  await press(page, 'Tab') // → meteo
  await press(page, 'Tab') // → effet
  await press(page, 'ArrowDown') // ouvre popup effet
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  await expect(pane1(page).locator('.popup-select__option[data-value="au"]')).toHaveClass(/disabled/)
  await expect(pane1(page).locator('.popup-select__option[data-value="cr"]')).toHaveClass(/disabled/)
  await expect(pane1(page).locator('.popup-select__option[data-value="nu"]')).toHaveClass(/disabled/)
  await expect(pane1(page).locator('.popup-select__option[data-value="ma"]')).not.toHaveClass(/disabled/)
  await press(page, 'Escape')
})

// e2 a effet='nu' → météos incompatibles : ps, vo, di
test("incompatibilité : effet=nu → météo popup grise ps/vo/di", async ({ page }) => {
  await goToListerEvent(page)
  // sélectionner e2
  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)
  await press(page, 'Enter') // ouvre édition sur e2
  await expect(pane1(page).locator('.event-item.editing')).toBeVisible()
  await expect(pane1(page).locator('.event-item.editing [data-field="title"]')).toBeFocused()
  await press(page, 'Tab') // → state
  await press(page, 'Tab') // → meteo
  await press(page, 'ArrowDown') // ouvre popup meteo
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  await expect(pane1(page).locator('.popup-select__option[data-value="ps"]')).toHaveClass(/disabled/)
  await expect(pane1(page).locator('.popup-select__option[data-value="vo"]')).toHaveClass(/disabled/)
  await expect(pane1(page).locator('.popup-select__option[data-value="di"]')).toHaveClass(/disabled/)
  await expect(pane1(page).locator('.popup-select__option[data-value="pl"]')).not.toHaveClass(/disabled/)
  await press(page, 'Escape')
})

test("incompatibilité : option grisée non sélectionnable (Space ignoré)", async ({ page }) => {
  await goToListerEvent(page)
  await enterEditionOnFirst(page) // e1 : meteo='ps', effet='ma'
  await press(page, 'Tab') // → state
  await press(page, 'Tab') // → meteo
  await press(page, 'Tab') // → effet
  await press(page, 'ArrowDown') // ouvre popup effet
  // Navigate to 'nu' (nuit) which is disabled
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  // trouver index de 'nu' dans la liste et naviguer
  const nuOption = pane1(page).locator('.popup-select__option[data-value="nu"]')
  await expect(nuOption).toHaveClass(/disabled/)
  await nuOption.click() // clic sur option désactivée
  // le popup doit rester ouvert
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  await press(page, 'Escape')
  // l'effet n'a pas changé
  await press(page, 'Escape') // annule édition
  await expect(pane1(page).locator('.event-item').first().locator('.event-effet')).toHaveText('Matin')
})
