import fs from 'fs'
import path from 'path'
import { installFixtures } from '../../../helpers/install-fixtures'
installFixtures('many-projects')
import { test, expect } from '../../e2e/__setup__.js'

test('la touche Escape après n annule complètement la création du projet', async ({ page }) => {

  console.log('\n=== TEST ANNULATION NOUVEAU PROJET ===\n')

  const projectsPath = path.resolve('../data/lof-projects.json')

  console.log('-> ouverture application')
  await page.goto('/')

  const itemsBefore = page.locator('.project-item')

  console.log('-> vérification nombre initial projets')
  await expect(itemsBefore).toHaveCount(3)

  console.log('-> vérification sélection initiale')
  await expect(itemsBefore.nth(0)).toHaveClass(/selected/)
  await expect(itemsBefore.nth(1)).not.toHaveClass(/selected/)
  await expect(itemsBefore.nth(2)).not.toHaveClass(/selected/)

  console.log('-> lecture backend avant création')
  const projectsBefore = JSON.parse(fs.readFileSync(projectsPath, 'utf8'))

  console.log('-> création nouveau projet')
  await page.keyboard.press('n')

  console.log('-> annulation création')
  await page.keyboard.press('Escape')

  const itemsAfter = page.locator('.project-item')

  console.log('-> vérification nombre final projets')
  await expect(itemsAfter).toHaveCount(3)

  console.log('-> vérification disparition inputs')
  await expect(page.locator('input')).toHaveCount(0)

  console.log('-> vérification restauration sélection')
  await expect(itemsAfter.nth(0)).toHaveClass(/selected/)
  await expect(itemsAfter.nth(1)).not.toHaveClass(/selected/)
  await expect(itemsAfter.nth(2)).not.toHaveClass(/selected/)

  console.log('-> lecture backend après annulation')
  const projectsAfter = JSON.parse(fs.readFileSync(projectsPath, 'utf8'))

  console.log('-> vérification backend inchangé')
  expect(projectsAfter).toEqual(projectsBefore)

  console.log('\n=== FIN TEST ANNULATION NOUVEAU PROJET ===\n')

})