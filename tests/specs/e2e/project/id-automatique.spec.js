import fs from 'fs'
import path from 'path'
import { installFixtures } from '../../../helpers/install-fixtures'
installFixtures('many-projects')
import { test, expect } from '../../e2e/__setup__.js'

test('la saisie du titre d’un nouveau projet crée automatiquement son identifiant logique', async ({ page }) => {
  console.log('\n=== TEST AUTO ID PROJET ===\n')
  const projectsPath = path.resolve('../data/lof-projects.json')
  console.log('-> ouverture application')
  await page.goto('/')
  console.log(await page.content())
  console.log('-> création nouveau projet')
  await page.locator('body').click()
  await page.keyboard.press('n')
  console.log(await page.locator('#main-panel').innerHTML())
  const inputs = page.locator('input')
  console.log('-> vérification présence champs édition')
  await expect(inputs).toHaveCount(2)
  console.log('-> saisie titre projet : "Ça c’est un Été Super !"')
  await inputs.nth(0).fill('Ça c’est un Été Super !')
  await inputs.nth(0).press('a')
  await inputs.nth(0).press('Backspace')
  console.log('-> vérification id auto généré')
  await expect(inputs.nth(1)).toHaveValue('ca-cest-un-ete-super')
  console.log('-> validation création')
  const patchDone = page.waitForResponse(resp =>
    resp.url().includes('/data/lof-projects.json') && resp.request().method() === 'PATCH'
  )
  await page.keyboard.press('Enter')
  await patchDone
  console.log('-> lecture backend')
  const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'))
  console.log(projects)
  console.log('-> vérification persistance')
  expect(projects.item_ids).toContain('ca-cest-un-ete-super')
  console.log('\n=== FIN TEST AUTO ID PROJET ===\n')
})