// Refactorisé — nouvelle architecture (2026-06-25)
import { test, expect, pane1 } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { setupProjectFolder, createAndSelectFolderInPicker } from '../../../helpers/create-project-helper.js'

test.beforeEach(() => {
  installFixtures('many-projects')
})

async function createProjectAndGetFolderInfo(page, expect) {
  await page.goto('/')
  const { folderName, workDir } = await setupProjectFolder(page)
  await expect(pane1(page).locator('#projects-panel')).toHaveClass(/project-list/)
  await pane1(page).locator('.project-item.selected').press('n')
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
  await pane1(page).locator('.project-item.selected').press('n')
  await expect(pane1(page).locator('.file-picker')).toBeVisible()
  await pane1(page).locator('.file-picker').press('Enter')
}

// ─────────────────────────────────────────────────────────────────────────────

test('choisir un dossier avec eventer.db affiche une boîte de confirmation', async ({ page }) => {
  const { workDir } = await createProjectAndGetFolderInfo(page, expect)

  await page.goto('/')
  await tryPickExistingFolder(page, expect, workDir)

  await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
  await expect(pane1(page).locator('.ftpanel.kpanel')).toContainText('projet')
})

test('confirmer l\'ouverture : le projet apparaît dans la liste', async ({ page }) => {
  const { workDir } = await createProjectAndGetFolderInfo(page, expect)

  const countAfterFirst = await pane1(page).locator('.project-item').count()

  await page.goto('/')
  await tryPickExistingFolder(page, expect, workDir)
  await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()

  await pane1(page).locator('.ftpanel.kpanel').press('Enter')
  await page.waitForLoadState('networkidle')

  await expect(pane1(page).locator('.project-item')).toHaveCount(countAfterFirst + 1)
})

test('→ sur un projet ouvre la liste de ses events', async ({ page }) => {
  const { workDir } = await createProjectAndGetFolderInfo(page, expect)

  await page.goto('/')
  await tryPickExistingFolder(page, expect, workDir)
  await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
  await pane1(page).locator('.ftpanel.kpanel').press('Enter')
  await page.waitForLoadState('networkidle')

  await pane1(page).locator('.project-item.selected').press('ArrowRight')
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

  await pane1(page).locator('.ftpanel.kpanel').press('Tab')
  await pane1(page).locator('.ftpanel.kpanel').press('Enter')
  await expect(pane1(page).locator('.ftpanel.kpanel')).not.toBeVisible()

  await expect(pane1(page).locator('.project-item')).toHaveCount(countAfterFirst)
})

// Fixture with-brins-and-persos : Projet A, e1 (brin b1 'MON', perso c1 'CY'), e2 (sans brin/perso)

test('ouverture d\'un projet existant : ses events affichent les marques de brins et de personnages', async ({ page }) => {
  installFixtures('with-brins-and-persos')
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)

  await pane1(page).locator('.project-item.selected').press('ArrowRight')
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
  await pane1(page).locator('.ftpanel.kpanel').press('Enter')
  await page.waitForLoadState('networkidle')

  await page.reload()
  await expect(pane1(page).locator('.project-item')).toHaveCount(countAfterFirst + 1)
})

// ─── Lancement / navigation projets ↔ events ─────────────────────────────────

test("entrer dans un projet cache le panneau des projets", async ({ page }) => {
  installFixtures('with-brins-and-persos')
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()

  await pane1(page).locator('.project-item.selected').press('ArrowRight')

  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await expect(pane1(page).locator('#projects-panel')).not.toBeVisible()
})

test("→ ouvre directement le PREMIER projet à l'ouverture de l'app", async ({ page }) => {
  installFixtures('with-brins-and-persos')
  await page.goto('/')
  await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)

  await pane1(page).locator('.project-item.selected').press('ArrowRight')

  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await expect(pane1(page).locator('.event-item')).toHaveCount(2)
})

test("→ ← ↓ → : navigation entre projets et leurs évènemenciers", async ({ page }) => {
  installFixtures('two-projects-events')
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()

  // entrer dans Projet A
  await pane1(page).locator('.project-item.selected').press('ArrowRight')
  await expect(pane1(page).locator('#projects-panel')).not.toBeVisible()
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await expect(pane1(page).locator('.event-item')).toHaveCount(3) // e1,e2,e3

  // revenir à la liste des projets
  await pane1(page).locator('.event-item.selected').press('ArrowLeft')
  await expect(pane1(page).locator('#events-panel')).not.toBeVisible()
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()

  // choisir Projet B
  await pane1(page).locator('.project-item.selected').press('ArrowDown')
  await expect(pane1(page).locator('.project-item').nth(1)).toHaveClass(/selected/)

  // entrer dans Projet B
  await pane1(page).locator('.project-item.selected').press('ArrowRight')
  await expect(pane1(page).locator('#projects-panel')).not.toBeVisible()
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await expect(pane1(page).locator('.event-item')).toHaveCount(2) // e4,e5
})
