import { test, expect } from '../__setup__.js'
import fs from 'node:fs/promises'
import path from 'node:path'

const appRoot = path.resolve(process.cwd(), '..')
const dataDir = path.join(appRoot, 'data')

test('des données minimales existent toujours à chaque requête serveur', async ({ page }) => {

  console.log('\n=== TEST DONNÉES MINIMALES ===')

  console.log(`Application root : ${appRoot}`)
  console.log(`Dossier data     : ${dataDir}`)

  console.log('\n-> destruction du dossier data')
  await fs.rm(dataDir, { recursive: true, force: true })

  let dataExists = true

  try {
    await fs.access(dataDir)
  } catch(err) {
    dataExists = false
  }

  console.log(`-> data existe avant requête : ${dataExists}`)

  expect(dataExists).toBe(false)

  console.log('\n-> requête GET /')
  const response = await page.goto('/')

  console.log(`-> réponse serveur : ${response.status()}`)

  expect(response.ok()).toBe(true)

  console.log('\n-> vérification recréation dossier data')

  try {
    await fs.access(dataDir)
    console.log('-> dossier data recréé')
  } catch(err) {
    console.log('-> dossier data INTROUVABLE')
    throw err
  }

  console.log('\n=== FIN TEST DONNÉES MINIMALES ===\n')

})