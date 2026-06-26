import { test, expect, pane1 } from '../__setup__.js'
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
    if (entry.isDirectory()) {
      await showTree(path.join(dir, entry.name), level + 1)
    }
  }
}

test('un projet démo minimal complet est créé et affiché', async ({ page }) => {


  await fs.rm(dataDir, { recursive: true, force: true })

  const response = await page.goto('/')
  expect(response.ok()).toBe(true)

  await showTree(dataDir)

  const mainDb     = path.join(dataDir, 'main.db')
  const modelDb    = path.join(dataDir, 'model', 'eventer.db')


  expect(await pathExists(mainDb)).toBe(true)

  expect(await pathExists(modelDb)).toBe(true)

  await expect(pane1(page).locator('body')).toContainText('Projet modèle')


})
