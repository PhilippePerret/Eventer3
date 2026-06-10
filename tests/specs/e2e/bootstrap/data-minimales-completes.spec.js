import { test, expect } from '../__setup__.js'
import fs from 'node:fs/promises'
import path from 'node:path'

const appRoot = path.resolve(process.cwd(), '..')
const dataDir = path.join(appRoot, 'data')

async function pathExists(pth) {
  try {
    await fs.access(pth)
    return true
  } catch(err) {
    return false
  }
}

async function showTree(dir, level = 0) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    console.log(`${'  '.repeat(level)}- ${entry.name}`)
    if (entry.isDirectory()) {
      await showTree(path.join(dir, entry.name), level + 1)
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

  const mainDb     = path.join(dataDir, 'main.db')
  const modelDb    = path.join(dataDir, 'model', 'eventer.db')

  console.log('\n-> vérification structure minimale')

  expect(await pathExists(mainDb)).toBe(true)
  console.log('-> main.db OK')

  expect(await pathExists(modelDb)).toBe(true)
  console.log('-> model/eventer.db OK')

  console.log('\n-> vérification DOM')
  await expect(page.locator('body')).toContainText('Projet modèle')
  console.log('-> projet affiché dans le DOM')

  console.log('\n=== FIN TEST PROJET DÉMO MINIMAL ===\n')

})
