import { test, expect, pane1 } from '../__setup__.js'
import fs from 'node:fs/promises'
import path from 'node:path'

const appRoot = path.resolve(process.cwd(), '..')
const dataDir = path.join(appRoot, 'data')

test('des données minimales existent toujours à chaque requête serveur', async ({ page }) => {



  await fs.rm(dataDir, { recursive: true, force: true })

  let dataExists = true

  try {
    await fs.access(dataDir)
  } catch(err) {
    dataExists = false
  }


  expect(dataExists).toBe(false)

  const response = await page.goto('/')


  expect(response.ok()).toBe(true)


  try {
    await fs.access(dataDir)
  } catch(err) {
    throw err
  }


})