// Origine : tests/specs/e2e/project/open-existing-project.spec.js
import { test, expect, pane1 } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { setupProjectFolder, createAndSelectFolderInPicker } from '../../../helpers/create-project-helper.js'

test.beforeEach(() => {
  installFixtures('many-projects')
})

async function createProjectAndGetFolderInfo(page, expect) {
  await page.goto('/')
  const { folderName, workDir } = await setupProjectFolder(page)
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
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
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await pane1(page).locator('.project-item.selected').press('n')
  await expect(pane1(page).locator('.file-picker')).toBeVisible()
  await pane1(page).locator('.file-picker').press('Enter')
}

// ─────────────────────────────────────────────────────────────────────────────

test.skip('choisir un dossier avec eventer.db affiche une boîte de confirmation', async ({ page }) => {
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
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)

  await expect(pane1(page).locator('.event-item')).toHaveCount(1)
  await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Acte I')
})

test.skip('annuler : aucun projet créé', async ({ page }) => {
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

test.skip('persistance : le projet survit au rechargement', async ({ page }) => {
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
