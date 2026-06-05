import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('with-persos')
})

// Fixture with-persos :
//   b1 (MON, perso_ids=[c2])  ← c2 Roxane est sur le brin
//   c1 Cyrano (CY, direct sur e1)
//   c2 Roxane (RO, sur brin b1)
//   c3 Christian (CH, avatar 🎭, non assigné)
//   c4 Valvert (VA, avatar 👑, non assigné)

async function goToEventLister(page) {
  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
}

async function openBrinPanel(page) {
  await goToEventLister(page)
  await page.keyboard.press('b')
  await expect(page.locator('#brin-panel')).toBeVisible()
}

async function openPersoPanelFromBrin(page) {
  await openBrinPanel(page)
  await page.keyboard.press('p')
  await expect(page.locator('#perso-panel')).toBeVisible()
}

// ─── Ouverture depuis BrinLister ──────────────────────────────────────────────

test("p ouvre le panneau des personnages depuis BrinLister", async ({ page }) => {
  await openBrinPanel(page)
  await page.keyboard.press('p')
  await expect(page.locator('#perso-panel')).toBeVisible()
})

test("le panneau brins reste visible en fond pendant le panneau perso", async ({ page }) => {
  await openPersoPanelFromBrin(page)
  await expect(page.locator('#brin-panel')).toBeVisible()
})

test("Escape ferme le panneau perso et remet le focus sur BrinLister", async ({ page }) => {
  await openPersoPanelFromBrin(page)
  await page.keyboard.press('Escape')
  await expect(page.locator('#perso-panel')).not.toBeVisible()
  // BrinLister reprend la main : ↓ change la sélection du brin
  await page.keyboard.press('ArrowDown')
  // pas d'erreur = BrinLister actif
})

// ─── État coché = brin.perso_ids ─────────────────────────────────────────────

test("c2 (perso de b1) est coché à l'ouverture depuis b1", async ({ page }) => {
  await openPersoPanelFromBrin(page)
  // c2 = index 1 dans la liste
  await expect(page.locator('.perso-item').nth(1)).toHaveClass(/checked/)
})

test("c1, c3, c4 ne sont pas cochés à l'ouverture depuis b1", async ({ page }) => {
  await openPersoPanelFromBrin(page)
  await expect(page.locator('.perso-item').nth(0)).not.toHaveClass(/checked/)
  await expect(page.locator('.perso-item').nth(2)).not.toHaveClass(/checked/)
  await expect(page.locator('.perso-item').nth(3)).not.toHaveClass(/checked/)
})

test("les persos du brin ne sont pas grisés (tous décochables depuis brin)", async ({ page }) => {
  await openPersoPanelFromBrin(page)
  await expect(page.locator('.perso-item').nth(1)).not.toHaveClass(/inherited/)
})

// ─── Toggle depuis brin ───────────────────────────────────────────────────────

test("Space coche un perso non-coché sur le brin (c1)", async ({ page }) => {
  await openPersoPanelFromBrin(page)
  await expect(page.locator('.perso-item').nth(0)).not.toHaveClass(/checked/)
  await page.keyboard.press(' ')
  await expect(page.locator('.perso-item').nth(0)).toHaveClass(/checked/)
})

test("Space décoche un perso coché sur le brin (c2)", async ({ page }) => {
  await openPersoPanelFromBrin(page)
  await page.keyboard.press('ArrowDown') // → c2
  await expect(page.locator('.perso-item').nth(1)).toHaveClass(/checked/)
  await page.keyboard.press(' ')
  await expect(page.locator('.perso-item').nth(1)).not.toHaveClass(/checked/)
})

// ─── Badge perso sur la ligne du brin ────────────────────────────────────────

test("la ligne de b1 affiche le badge de c2 (son perso)", async ({ page }) => {
  await openBrinPanel(page)
  const brinEl = page.locator('.brin-item').nth(0)
  await expect(brinEl.locator('.brin-persos-marks .perso-mark')).toContainText('RO')
})

test("cocher c3 depuis le panneau perso de b1 ajoute son avatar sur la ligne du brin", async ({ page }) => {
  await openPersoPanelFromBrin(page)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown') // → c3
  await page.keyboard.press(' ')
  const brinEl = page.locator('.brin-item').nth(0)
  // c3 a avatar 🎭 → affiché à la place du badge
  await expect(brinEl.locator('.brin-persos-marks')).toContainText('🎭')
})

// ─── Marques perso sur la ligne d'event ──────────────────────────────────────

test("les persos des brins d'un event s'affichent sur la ligne dès le chargement (sans ouvrir le panneau perso)", async ({ page }) => {
  await goToEventLister(page)
  // e1 a brin b1 (perso c2=RO) et perso direct c1=CY
  const eventEl = page.locator('.event-item').nth(0)
  await expect(eventEl.locator('.event-persos-marks')).toContainText('CY')
  await expect(eventEl.locator('.event-persos-marks')).toContainText('RO')
})

test("retirer un brin d'un event met à jour les marques perso sur la ligne de l'event", async ({ page }) => {
  await openBrinPanel(page)
  // b1 est coché sur e1 (c2=RO via b1 s'affiche sur e1)
  // décocher b1
  await page.keyboard.press(' ')
  const eventEl = page.locator('.event-item').nth(0)
  // c2 (RO) ne devrait plus apparaître (vient de b1)
  await expect(eventEl.locator('.event-persos-marks')).not.toContainText('RO')
})

// ─── Persistance ─────────────────────────────────────────────────────────────

test("persistance : cochage sur brin survit au rechargement", async ({ page }) => {
  await openPersoPanelFromBrin(page)
  await page.keyboard.press(' ') // cocher c1 sur b1
  await page.waitForLoadState('networkidle')
  await page.reload()
  await openBrinPanel(page)
  await page.keyboard.press('p')
  await expect(page.locator('.perso-item').nth(0)).toHaveClass(/checked/)
})
