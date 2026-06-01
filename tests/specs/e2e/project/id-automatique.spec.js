import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-projects')
})

test("la saisie du titre d'un nouveau projet crée automatiquement son identifiant logique", async ({ page }) => {
  console.log('\n=== TEST AUTO ID PROJET ===\n')

  await page.goto('/')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)

  console.log('-> création nouveau projet')
  await page.keyboard.press('n')

  const titleInput = page.locator('.project-item.selected input[name="title"]')
  const idInput    = page.locator('.project-item.selected input[name="id"]')

  console.log('-> vérification présence champs édition')
  await expect(titleInput).toBeVisible()
  await expect(idInput).toBeVisible()

  console.log('-> saisie titre projet')
  await titleInput.fill("Ça c'est un Été Super !")

  console.log('-> vérification id auto généré')
  await expect(idInput).toHaveValue('ca-cest-un-ete-super')

  console.log('-> validation création')
  const savePromise = page.waitForResponse(resp =>
    resp.url().includes('/api/listers/') && resp.request().method() === 'PATCH'
  )
  await page.keyboard.press('Enter')
  await savePromise

  console.log('-> vérification persistance via API')
  const resp = await page.request.get('/api/listers/projects')
  expect(resp.ok()).toBeTruthy()
  const lister = await resp.json()
  expect(lister.item_ids).toContain('ca-cest-un-ete-super')

  console.log('\n=== FIN TEST AUTO ID PROJET ===\n')
})
