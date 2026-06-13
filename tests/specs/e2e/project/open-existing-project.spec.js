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
  await page.keyboard.press('n')
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
  await page.keyboard.press('n')
  await expect(pane1(page).locator('.file-picker')).toBeVisible()
  await page.keyboard.press('Enter')
}

// ─────────────────────────────────────────────────────────────────────────────

test('choisir un dossier avec eventer.db affiche une boîte de confirmation', async ({ page }) => {
  const { workDir } = await createProjectAndGetFolderInfo(page, expect)

  await page.goto('/')
  await tryPickExistingFolder(page, expect, workDir)

  await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  await expect(pane1(page).locator('.confirm-dialog')).toContainText('projet')
})

test('confirmer l\'ouverture : le projet apparaît dans la liste avec ses events', async ({ page }) => {
  const { workDir } = await createProjectAndGetFolderInfo(page, expect)

  const countAfterFirst = await pane1(page).locator('.project-item').count()

  await page.goto('/')
  await tryPickExistingFolder(page, expect, workDir)
  await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()

  await page.keyboard.press('Enter')
  await page.waitForLoadState('networkidle')

  await expect(pane1(page).locator('.project-item')).toHaveCount(countAfterFirst + 1)

  await page.keyboard.press('ArrowRight')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)

  await expect(pane1(page).locator('.event-item')).toHaveCount(1)
  await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Acte I')
})

test('annuler : aucun projet créé', async ({ page }) => {
  const { workDir } = await createProjectAndGetFolderInfo(page, expect)

  const countAfterFirst = await pane1(page).locator('.project-item').count()

  await page.goto('/')
  await tryPickExistingFolder(page, expect, workDir)
  await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()

  await expect(pane1(page).locator('.project-item')).toHaveCount(countAfterFirst)
})

test('persistance : le projet survit au rechargement', async ({ page }) => {
  const { workDir } = await createProjectAndGetFolderInfo(page, expect)

  const countAfterFirst = await pane1(page).locator('.project-item').count()

  await page.goto('/')
  await tryPickExistingFolder(page, expect, workDir)
  await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  await page.keyboard.press('Enter')
  await page.waitForLoadState('networkidle')

  await page.reload()
  await expect(pane1(page).locator('.project-item')).toHaveCount(countAfterFirst + 1)
})
