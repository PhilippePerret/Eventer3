import { test, expect } from '@playwright/test'
import fs from 'node:fs/promises'
import path from 'node:path'

const appRoot = path.resolve(process.cwd(), '..')
const dataDir = path.join(appRoot, 'data')

async function showTree(dir, level = 0) {

  const entries = await fs.readdir(dir, { withFileTypes: true })

  for (const entry of entries) {

    console.log(
      `${'  '.repeat(level)}- ${entry.name}`
    )

    if (entry.isDirectory()) {
      await showTree(
        path.join(dir, entry.name),
        level + 1
      )
    }

  }

}



test('un projet démo minimal complet est créé et affiché', async ({ page }) => {

  console.log('\n=== TEST PROJET DÉMO MINIMAL ===')

  console.log(`Application root : ${appRoot}`)
  console.log(`Dossier data     : ${dataDir}`)

  console.log('\n-> destruction du dossier data')
  await fs.rm(dataDir, { recursive: true, force: true })

  console.log('\n-> ouverture application')
  const response = await page.goto('/')

  expect(response.ok()).toBe(true)

  console.log('\n=== ARBORESCENCE DATA ===')

  await showTree(dataDir)

  console.log('=== FIN ARBORESCENCE DATA ===\n')



  console.log('\n-> vérification structure minimale')

  const projectsFile = path.join(dataDir, 'projects.json')
  const projectFile  = path.join(dataDir, 'projects', 'demo.json')

  const brinsFile  = path.join(dataDir, 'projects', 'demo', '__brins.json')
  const persosFile = path.join(dataDir, 'projects', 'demo', '__persos.json')
  const eventsFile = path.join(dataDir, 'projects', 'demo', '__items.json')

  await expect(async () => {
    await fs.access(projectsFile)
  }).not.toThrow()

  console.log('-> projects.json OK')

  await expect(async () => {
    await fs.access(projectFile)
  }).not.toThrow()

  console.log('-> demo.json OK')

  await expect(async () => {
    await fs.access(brinsFile)
  }).not.toThrow()

  console.log('-> __brins.json OK')

  await expect(async () => {
    await fs.access(persosFile)
  }).not.toThrow()

  console.log('-> __persos.json OK')

  await expect(async () => {
    await fs.access(eventsFile)
  }).not.toThrow()

  console.log('-> __items.json OK')

  console.log('\n-> vérification DOM')

  await expect(page.locator('body')).toContainText('Projet modèle')

  console.log('-> projet affiché dans le DOM')

  console.log('\n=== FIN TEST PROJET DÉMO MINIMAL ===\n')

})