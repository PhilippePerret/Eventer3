import { installFixtures } from '../../../helpers/install-fixtures'
import { setupProjectFolder, createAndSelectFolderInPicker } from '../../../helpers/create-project-helper.js'
import { test, expect, pane1 } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-projects')
})

async function createProject(page, expect) {
  await page.goto('/')
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)

  const { folderName } = await setupProjectFolder(page)
  await pane1(page).locator('#main-panel').press('n')
  await createAndSelectFolderInPicker(page, expect, folderName)
  await page.waitForLoadState('networkidle')

  return await pane1(page).locator('.project-item').nth(1).getAttribute('data-id')
}

test('un nouveau projet sauvegardé a un évènemencier avec un event "Acte I"', async ({ page }) => {
  const projectId = await createProject(page, expect)

  const listerResp = await page.request.get(`/api/items/${projectId}/lister`)
  expect(listerResp.ok()).toBeTruthy()
  const listerData = await listerResp.json()
  expect(listerData.id).toBeTruthy()

  const itemsResp = await page.request.get(`/api/listers/${listerData.id}/items?project_id=${projectId}`)
  expect(itemsResp.ok()).toBeTruthy()
  const items = await itemsResp.json()
  const eventTitles = Object.values(items).map(i => i.title)
  expect(eventTitles).toContain('Acte I')
})

test('un nouveau projet sauvegardé a un brin "Intrigue principale"', async ({ page }) => {
  const projectId = await createProject(page, expect)

  const itemsResp = await page.request.get(`/api/listers/${projectId}-brins/items`)
  expect(itemsResp.ok()).toBeTruthy()
  const items = await itemsResp.json()
  const brinTitles = Object.values(items).map(i => i.title)
  expect(brinTitles).toContain('Intrigue principale')
})

test('un nouveau projet sauvegardé a un personnage "Votre protagoniste"', async ({ page }) => {
  const projectId = await createProject(page, expect)

  const itemsResp = await page.request.get(`/api/listers/${projectId}-persos/items`)
  expect(itemsResp.ok()).toBeTruthy()
  const items = await itemsResp.json()
  const persoTitles = Object.values(items).map(i => i.title)
  expect(persoTitles).toContain('Votre protagoniste')
})
