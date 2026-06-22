import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'
import { MANUSCRIT_WIDTH } from '../../../../public/constants.js'

test.beforeEach(() => {
  installFixtures('with-styles')
})

async function goToProjectList(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
}

async function goToEventLister(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
}

// Tab Tab Enter = activer le bouton "Appliquer" (dernier bouton footer)
async function applyNaturePanel(page) {
  await pane1(page).locator('#main-panel').press('Tab')   // footer focus → Annuler
  await pane1(page).locator('#main-panel').press('Tab')   // footer focus → Appliquer
  await pane1(page).locator('#main-panel').press('Enter') // appliquer
}

// Ouvre le panneau, sélectionne roman+manuscrit, applique, refuse man_depth
async function setRomanMan(page) {
  await pane1(page).locator('#main-panel').press('t')
  await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  await pane1(page).locator('#main-panel').press('Enter')                          // ouvre popup projet
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  await pane1(page).locator('#main-panel').press('ArrowUp')                        // film/BD
  await pane1(page).locator('#main-panel').press('ArrowUp')                        // roman
  await pane1(page).locator('#main-panel').press('Enter')                          // roman
  await pane1(page).locator('#main-panel').press('ArrowDown')                      // champ évènemencier
  await pane1(page).locator('#main-panel').press('Enter')                          // ouvre popup évènemencier
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  await pane1(page).locator('#main-panel').press('ArrowUp')                        // manuscrit
  await pane1(page).locator('#main-panel').press('Enter')                          // manuscrit
  await applyNaturePanel(page)
  await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  await pane1(page).locator('#main-panel').press('Escape')                         // refuser man_depth
  await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
}

// ─── Structure du panneau ─────────────────────────────────────────────────────

test("'t' dans project list → popup projet nature (pas nature-panel)", async ({ page }) => {
  await goToProjectList(page)
  await pane1(page).locator('#main-panel').press('t')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  await expect(pane1(page).locator('.nature-panel')).not.toBeVisible()
})

test("'t' dans event lister → panneau .nature-panel s'ouvre", async ({ page }) => {
  await goToEventLister(page)
  await pane1(page).locator('#main-panel').press('t')
  await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  await expect(pane1(page).locator('.popup-select')).not.toBeVisible()
})

test("panneau nature → titre mentionne le niveau courant", async ({ page }) => {
  await goToEventLister(page)
  await pane1(page).locator('#main-panel').press('t')
  await expect(pane1(page).locator('.nature-panel .floating-panel__title')).toContainText('niv. 1')
})

test("panneau nature → contient 'Nature projet' et 'Nature évènemencier'", async ({ page }) => {
  await goToEventLister(page)
  await pane1(page).locator('#main-panel').press('t')
  const panel = pane1(page).locator('.nature-panel')
  await expect(panel).toContainText('Nature projet')
  await expect(panel).toContainText('Nature évènemencier')
})

test("panneau nature → footer a boutons 'Annuler' et 'Appliquer' alternables par Tab", async ({ page }) => {
  await goToEventLister(page)
  await pane1(page).locator('#main-panel').press('t')
  const footer = pane1(page).locator('.nature-panel .floating-panel__footer')
  await expect(footer).toBeVisible()
  const btns = footer.locator('.panel-btn')
  await expect(btns).toHaveCount(2)
  await expect(btns.first()).toContainText('Annuler')
  await expect(btns.last()).toContainText('Appliquer')
})

// ─── Navigation et menus ──────────────────────────────────────────────────────

test("Enter sur champ projet → popup avec 'roman' et 'film'", async ({ page }) => {
  await goToEventLister(page)
  await pane1(page).locator('#main-panel').press('t')
  await pane1(page).locator('#main-panel').press('Enter')
  const popup = pane1(page).locator('.popup-select')
  await expect(popup).toBeVisible()
  await expect(popup).toContainText('roman')
  await expect(popup).toContainText('film')
})

test("choix 'roman' → champ évènemencier activé par ArrowDown, Enter ouvre popup 'manuscrit'", async ({ page }) => {
  await goToEventLister(page)
  await pane1(page).locator('#main-panel').press('t')
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel').press('ArrowUp')   // film/BD
  await pane1(page).locator('#main-panel').press('ArrowUp')   // roman
  await pane1(page).locator('#main-panel').press('Enter')     // roman
  await pane1(page).locator('#main-panel').press('ArrowDown')
  await pane1(page).locator('#main-panel').press('Enter')
  const popup = pane1(page).locator('.popup-select')
  await expect(popup).toBeVisible()
  await expect(popup).toContainText('manuscrit')
  await expect(popup).toContainText('défaut')
})

test("projet 'film' → popup évènemencier propose 'scénario'", async ({ page }) => {
  await goToEventLister(page)
  await pane1(page).locator('#main-panel').press('t')
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel').press('ArrowUp')    // film/BD (index 1 depuis —)
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel').press('ArrowDown')  // champ évènemencier
  await pane1(page).locator('#main-panel').press('Enter')
  await expect(pane1(page).locator('.popup-select')).toContainText('scénario')
})

// ─── Escape / Annuler ─────────────────────────────────────────────────────────

test("Escape ferme le panneau sans appliquer", async ({ page }) => {
  await goToEventLister(page)
  await pane1(page).locator('#main-panel').press('t')
  await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  await pane1(page).locator('#main-panel').press('Escape')
  await expect(pane1(page).locator('.nature-panel')).not.toBeVisible()
  await expect(pane1(page).locator('#main-panel')).not.toHaveClass(/roman/)
})

// ─── Appliquer ────────────────────────────────────────────────────────────────

test("roman+manuscrit → #main-panel a la classe 'roman-man'", async ({ page }) => {
  await goToEventLister(page)
  await setRomanMan(page)
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/roman-man/)
})

test("film+scénario → #main-panel a la classe 'film-man'", async ({ page }) => {
  await goToEventLister(page)
  await pane1(page).locator('#main-panel').press('t')
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel').press('ArrowUp')   // film/BD (index 1 depuis —)
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel').press('ArrowDown') // champ évènemencier
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel').press('ArrowUp')   // scénario (index 0 depuis évènemencier)
  await pane1(page).locator('#main-panel').press('Enter')
  await applyNaturePanel(page)
  await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  await pane1(page).locator('#main-panel').press('Escape')    // refuser man_depth
  await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/film-man/)
})

// ─── Confirmation man_depth ───────────────────────────────────────────────────

test("nature man et depth ≠ man_depth → ConfirmDialog s'ouvre avec 'niveau par défaut'", async ({ page }) => {
  await goToEventLister(page)
  await pane1(page).locator('#main-panel').press('t')
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel').press('ArrowUp')   // film/BD
  await pane1(page).locator('#main-panel').press('ArrowUp')   // roman
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel').press('ArrowDown')
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel').press('ArrowUp')   // manuscrit
  await pane1(page).locator('#main-panel').press('Enter')
  await applyNaturePanel(page)
  // nature-panel fermé, confirm-dialog ouvert
  await expect(pane1(page).locator('.nature-panel')).not.toBeVisible()
  await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  await expect(pane1(page).locator('.confirm-dialog')).toContainText('niveau par défaut')
})

test("confirmer 'n' → man_depth non sauvegardé, panneau ferme", async ({ page }) => {
  installFixtures('depth-move')
  await page.goto('/')
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  await pane1(page).locator('#main-panel').press('t')
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel').press('ArrowUp')   // film/BD
  await pane1(page).locator('#main-panel').press('ArrowUp')   // roman
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel').press('ArrowDown')
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel').press('ArrowUp')   // manuscrit
  await pane1(page).locator('#main-panel').press('Enter')
  await applyNaturePanel(page)
  await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  await pane1(page).locator('#main-panel').press('Escape') // refuser man_depth
  await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  // sibling lister à même depth NE doit PAS être roman-man automatiquement
  await pane1(page).locator('#main-panel').press('ArrowLeft')
  await pane1(page).locator('#main-panel').press('ArrowDown')
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).not.toHaveClass(/roman-man/)
})

test("confirmer 'o' → man_depth sauvegardé, sibling lister devient roman-man", async ({ page }) => {
  installFixtures('depth-move')
  await page.goto('/')
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  await pane1(page).locator('#main-panel').press('t')
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel').press('ArrowUp')   // film/BD
  await pane1(page).locator('#main-panel').press('ArrowUp')   // roman
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel').press('ArrowDown')
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel').press('ArrowUp')   // manuscrit
  await pane1(page).locator('#main-panel').press('Enter')
  await applyNaturePanel(page)
  await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  await pane1(page).locator('#main-panel').press('Enter') // confirmer man_depth (oui)
  await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  await pane1(page).locator('#main-panel').press('ArrowLeft')
  await pane1(page).locator('#main-panel').press('ArrowDown')
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/roman-man/)
})

test("depth = man_depth → appliquer ferme sans confirmation", async ({ page }) => {
  installFixtures('depth-move')
  await page.goto('/')
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  // définir man_depth = 2 d'abord
  await pane1(page).locator('#main-panel').press('t')
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel').press('ArrowUp')    // film/BD
  await pane1(page).locator('#main-panel').press('ArrowUp')    // roman
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel').press('ArrowDown')
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel').press('ArrowUp')    // manuscrit
  await pane1(page).locator('#main-panel').press('Enter')
  await applyNaturePanel(page)
  await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  await pane1(page).locator('#main-panel').press('Enter') // man_depth = 2 (oui)
  await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  // rouvrir 't' : depth 2 = man_depth → pas de confirmation
  await pane1(page).locator('#main-panel').press('t')
  await applyNaturePanel(page) // appliquer sans rien changer
  await expect(pane1(page).locator('.nature-panel')).not.toBeVisible()
})

// ─── Nature null à man_depth ─────────────────────────────────────────────────

test("nature null à man_depth → panneau affiche 'manuscrit', popup focused sur 'défaut'", async ({ page }) => {
  installFixtures('depth-move')
  await page.goto('/')
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  // Définir roman + man_depth=2 sur ce lister
  await pane1(page).locator('#main-panel').press('t')
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel').press('ArrowUp')   // film/BD
  await pane1(page).locator('#main-panel').press('ArrowUp')   // roman
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel').press('ArrowDown')
  await pane1(page).locator('#main-panel').press('Enter')
  await pane1(page).locator('#main-panel').press('ArrowUp')   // manuscrit
  await pane1(page).locator('#main-panel').press('Enter')
  await applyNaturePanel(page)
  await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  await pane1(page).locator('#main-panel').press('Enter')     // oui → man_depth=2
  await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  // Naviguer vers un sibling (nature=null, depth=2=man_depth)
  await pane1(page).locator('#main-panel').press('ArrowLeft')
  await pane1(page).locator('#main-panel').press('ArrowDown')
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/roman-man/)
  // Ouvrir panneau → ligne évènemencier affiche 'manuscrit' (effectif, même si null en DB)
  await pane1(page).locator('#main-panel').press('t')
  await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  await expect(pane1(page).locator('.nature-panel__fields')).toContainText('manuscrit')
  // Ouvrir popup évènemencier → 'défaut' doit être focused (valeur stockée = null)
  await pane1(page).locator('#main-panel').press('ArrowDown')
  await pane1(page).locator('#main-panel').press('Enter')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  const focused = pane1(page).locator('.popup-select__option.focused')
  await expect(focused).toContainText('défaut')
})

// ─── CSS roman-man ────────────────────────────────────────────────────────────

test("roman-man → event-text sans white-space nowrap", async ({ page }) => {
  await goToEventLister(page)
  await setRomanMan(page)
  const ws = await pane1(page).locator('.event-text').first().evaluate(el =>
    getComputedStyle(el).whiteSpace
  )
  expect(ws).not.toBe('nowrap')
})

test(`roman-man → event-text max-width = MANUSCRIT_WIDTH`, async ({ page }) => {
  await goToEventLister(page)
  await setRomanMan(page)
  const mw = await pane1(page).locator('.event-text').first().evaluate(el =>
    getComputedStyle(el).maxWidth
  )
  expect(mw).toBe(`${MANUSCRIT_WIDTH}px`)
})

// ─── Persistance ──────────────────────────────────────────────────────────────

test("roman-man persiste → page.goto('/') puis ArrowRight → #main-panel roman-man", async ({ page }) => {
  await goToEventLister(page)
  await setRomanMan(page)
  await page.goto('/')
  await pane1(page).locator('#main-panel').press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/roman-man/)
})

// ─── Tab cycle avec retour à "aucun bouton" ───────────────────────────────────

test("Tab×3 ramène à aucun footer sélectionné → Enter ouvre le popup", async ({ page }) => {
  await goToEventLister(page)
  await pane1(page).locator('#main-panel').press('t')
  await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  // Cycler à travers tous les boutons footer
  await pane1(page).locator('#main-panel').press('Tab')   // → Annuler
  await pane1(page).locator('#main-panel').press('Tab')   // → Appliquer
  await pane1(page).locator('#main-panel').press('Tab')   // → aucun (retour à -1)
  // Enter doit ouvrir le popup du champ sélectionné, pas activer un bouton footer
  await pane1(page).locator('#main-panel').press('Enter')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
  await expect(pane1(page).locator('.nature-panel')).toBeVisible()
})
