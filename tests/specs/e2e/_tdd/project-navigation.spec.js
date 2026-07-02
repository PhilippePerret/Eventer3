// Origine : tests/specs/e2e/project/project-listing-content.spec.js
//         + tests/specs/e2e/project/open-existing-project.spec.js
//         + tests/specs/e2e/project/seed-projet-complet.spec.js
//         + tests/specs/e2e/project/regression-project-id.spec.js
import { test, expect, pane1, press, getErr } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { setupProjectFolder, createAndSelectFolderInPicker } from '../../../helpers/create-project-helper.js'
import fs from 'node:fs/promises'
import path from 'node:path'

// ─── Liste des projets ────────────────────────────────────────────────────────

test.describe('Liste des projets', () => {

  test.beforeEach(() => installFixtures('many-projects'))

  test('la liste affiche uniquement les projets actifs', async ({ page }) => {
    await page.goto('/')
    await expect(pane1(page).locator('.project-item')).toHaveCount(3)
    await expect(pane1(page).locator('text=Projet A')).toBeVisible()
    await expect(pane1(page).locator('text=Projet B')).toBeVisible()
    await expect(pane1(page).locator('text=Projet C')).toBeVisible()
    await expect(pane1(page).locator('text=Projet caché')).toHaveCount(0)
  })

})

// ─── Ouverture / navigation ───────────────────────────────────────────────────
// Scénario : projet créé via FilePicker, puis retrouvé à la prochaine session

test.describe('Ouverture et navigation', () => {

  test.beforeEach(() => installFixtures('many-projects'))

  async function createProjectAndGetFolderInfo(page, expect) {
    await page.goto('/')
    const { folderName, workDir } = await setupProjectFolder(page)
    await expect(pane1(page).locator('#projects-panel')).toHaveClass(/project-list/)
    await press(page, 'n')
    await createAndSelectFolderInPicker(page, expect, folderName)
    await page.waitForLoadState('networkidle')
    return { folderName, workDir }
  }

  async function tryPickExistingFolder(page, expect, workDir) {
    await page.request.patch('/api/settings/last_path', {
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({ value: workDir })
    })
    await expect(pane1(page).locator('#projects-panel')).toHaveClass(/project-list/)
    await press(page, 'n')
    await expect(pane1(page).locator('.file-picker')).toBeVisible()
    await press(page, 'Enter')
  }

  test('choisir un dossier avec eventer.db affiche une boîte de confirmation', async ({ page }) => {
    const { workDir } = await createProjectAndGetFolderInfo(page, expect)
    await page.goto('/')
    await tryPickExistingFolder(page, expect, workDir)
    await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
    await expect(pane1(page).locator('.ftpanel.kpanel')).toContainText('projet')
  })

  test("confirmer l'ouverture : le projet apparaît dans la liste", async ({ page }) => {
    const { workDir } = await createProjectAndGetFolderInfo(page, expect)
    const countAfterFirst = await pane1(page).locator('.project-item').count()
    await page.goto('/')
    await tryPickExistingFolder(page, expect, workDir)
    await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
    await press(page, 'Enter')
    await page.waitForLoadState('networkidle')
    await expect(pane1(page).locator('.project-item')).toHaveCount(countAfterFirst + 1)
  })

  test('→ sur un projet ouvre la liste de ses events', async ({ page }) => {
    const { workDir } = await createProjectAndGetFolderInfo(page, expect)
    await page.goto('/')
    await tryPickExistingFolder(page, expect, workDir)
    await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
    await press(page, 'Enter')
    await page.waitForLoadState('networkidle')
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toHaveClass(/event-list/)
    await expect(pane1(page).locator('.event-item')).toHaveCount(1)
    await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Acte I')
  })

  test('annuler : aucun projet créé', async ({ page }) => {
    const { workDir } = await createProjectAndGetFolderInfo(page, expect)
    const countAfterFirst = await pane1(page).locator('.project-item').count()
    await page.goto('/')
    await tryPickExistingFolder(page, expect, workDir)
    await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
    await press(page, 'Tab')
    await press(page, 'Enter')
    await expect(pane1(page).locator('.ftpanel.kpanel')).not.toBeVisible()
    await expect(pane1(page).locator('.project-item')).toHaveCount(countAfterFirst)
  })

  test("ouverture d'un projet existant : ses events affichent les marques de brins et de personnages", async ({ page }) => {
    installFixtures('with-brins-and-persos')
    await page.goto('/')
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toHaveClass(/event-list/)
    await expect(pane1(page).locator('.event-item')).toHaveCount(2)
    const e1 = pane1(page).locator('.event-item').nth(0)
    await expect(e1.locator('.event-brins-marks')).toContainText('MON')
    await expect(e1.locator('.event-persos-marks')).toContainText('CY')
  })

  test('persistance : le projet survit au rechargement', async ({ page }) => {
    const { workDir } = await createProjectAndGetFolderInfo(page, expect)
    const countAfterFirst = await pane1(page).locator('.project-item').count()
    await page.goto('/')
    await tryPickExistingFolder(page, expect, workDir)
    await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
    await press(page, 'Enter')
    await page.waitForLoadState('networkidle')
    await page.reload()
    await expect(pane1(page).locator('.project-item')).toHaveCount(countAfterFirst + 1)
  })

  test("entrer dans un projet cache le panneau des projets", async ({ page }) => {
    installFixtures('with-brins-and-persos')
    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    await expect(pane1(page).locator('#projects-panel')).not.toBeVisible()
  })

  test("→ ouvre directement le PREMIER projet à l'ouverture de l'app", async ({ page }) => {
    installFixtures('with-brins-and-persos')
    await page.goto('/')
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    await expect(pane1(page).locator('.event-item')).toHaveCount(2)
  })

  test("→ ← ↓ → : navigation entre projets et leurs évènemenciers", async ({ page }) => {
    installFixtures('two-projects-events')
    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()

    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#projects-panel')).not.toBeVisible()
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    await expect(pane1(page).locator('.event-item')).toHaveCount(3)

    await press(page, 'ArrowLeft')
    await expect(pane1(page).locator('#events-panel')).not.toBeVisible()
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()

    await press(page, 'ArrowDown')
    await expect(pane1(page).locator('.project-item').nth(1)).toHaveClass(/selected/)

    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#projects-panel')).not.toBeVisible()
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    await expect(pane1(page).locator('.event-item')).toHaveCount(2)
  })

})

// ─── Projet seed (données initiales à la première ouverture) ──────────────────

test.describe('Projet seed', () => {

  const appRoot = path.resolve(process.cwd(), '..')
  const dataDir = path.join(appRoot, 'data')

  test.beforeEach(async ({ page }) => {
    await fs.rm(dataDir, { recursive: true, force: true })
    await page.goto('/')
    await expect(pane1(page).locator('.project-item')).toHaveCount(1)
  })

  test('projet seed → "Intrigue principale" dans le panneau brins', async ({ page }) => {
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    await press(page, 'b')
    await expect(pane1(page).locator('#brins-panel')).toBeVisible()
    await expect(pane1(page).locator('.brin-item').first()).toContainText('Intrigue principale')
  })

  test('projet seed → "Votre protagoniste" dans le panneau persos', async ({ page }) => {
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    await press(page, 'p')
    await expect(pane1(page).locator('#persos-panel')).toBeVisible()
    await expect(pane1(page).locator('.perso-item__title').first()).toContainText('Votre protagoniste')
  })

})

// ─── Régression : project_id propagé aux sous-listers ─────────────────────────

test.describe('Régression : project_id propagé', () => {

  test.beforeEach(() => installFixtures('many-events'))

  async function enterProject(page) {
    await page.goto('/')
    await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    await expect(pane1(page).locator('.event-item').first()).toBeVisible()
  }

  test('créer un event imbriqué → persiste après rechargement', async ({ page }) => {
    await enterProject(page)

    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()

    await press(page, 'n')
    const input = pane1(page).locator('.event-item input[name="title"]')
    await expect(input).toBeFocused()
    await input.fill('Sous-event persistant')
    await press(page, 'Enter')
    await expect(pane1(page).locator('.event-item').first()).toContainText('Sous-event persistant')
    await page.waitForLoadState('networkidle')

    await page.reload()
    await enterProject(page)
    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    await expect(pane1(page).locator('.event-item').first()).toContainText('Sous-event persistant')
  })

  test('créer un brin → persiste après rechargement', async ({ page }) => {
    await enterProject(page)

    await press(page, 'b')
    await expect(pane1(page).locator('#brins-panel')).toBeVisible()

    await press(page, 'n')
    const input = pane1(page).locator('.brin-item input[name="title"]')
    await expect(input).toBeFocused()
    await input.fill('Brin régression')
    await press(page, 'Enter')

    await expect(pane1(page).locator('.brin-item').filter({ hasText: 'Brin régression' })).toBeVisible()

    await press(page, 'Meta+Enter')
    await page.reload()
    await enterProject(page)
    await press(page, 'b')
    await expect(pane1(page).locator('#brins-panel')).toBeVisible()
    await expect(pane1(page).locator('.brin-item').filter({ hasText: 'Brin régression' })).toBeVisible()
  })

  test('créer un perso → persiste après rechargement', async ({ page }) => {
    await enterProject(page)

    await press(page, 'p')
    await expect(pane1(page).locator('#persos-panel')).toBeVisible()

    await press(page, 'n')
    const input = pane1(page).locator('.perso-item input[name="title"]')
    await expect(input).toBeFocused()
    await input.fill('Perso régression')
    await press(page, 'Enter')

    await expect(pane1(page).locator('.perso-item').filter({ hasText: 'Perso régression' })).toBeVisible()

    await press(page, 'Meta+Enter')
    await page.reload()
    await enterProject(page)
    await press(page, 'p')
    await expect(pane1(page).locator('#persos-panel')).toBeVisible()
    await expect(pane1(page).locator('.perso-item').filter({ hasText: 'Perso régression' })).toBeVisible()
  })

  test('entrer ListerEvent depth-2 → aucun 500 sur brins/persos', async ({ page }) => {
    const errors = []
    page.on('response', r => { if (r.status() >= 500) errors.push(r.url()) })

    await enterProject(page)
    await page.waitForLoadState('networkidle')
    errors.length = 0

    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()
    await page.waitForLoadState('networkidle')

    expect(errors).toHaveLength(0)
  })

})
