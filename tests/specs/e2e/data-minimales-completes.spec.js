import { test, expect } from '@playwright/test'
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

  await fs.rm(
    dataDir,
    { recursive: true, force: true }
  )

  console.log('\n-> ouverture application')

  const response = await page.goto('/')

  expect(response.ok()).toBe(true)

  console.log('\n=== ARBORESCENCE DATA ===')

  await showTree(dataDir)

  console.log('=== FIN ARBORESCENCE DATA ===\n')

  const projectsFile = path.join(
    dataDir,
    'projects.json'
  )

  const projectFile = path.join(
    dataDir,
    'projects',
    'demo.json'
  )

  const projectFolder = path.join(
    dataDir,
    'projects',
    'demo'
  )

  const brinsFile = path.join(
    projectFolder,
    '__brins.json'
  )

  const persosFile = path.join(
    projectFolder,
    '__persos.json'
  )

  const eventsFile = path.join(
    projectFolder,
    '__items.json'
  )

  console.log('\n-> vérification structure minimale')

  expect(
    await pathExists(projectsFile)
  ).toBe(true)

  console.log('-> projects.json OK')

  expect(
    await pathExists(projectFile)
  ).toBe(true)

  console.log('-> projects/demo.json OK')

  const errors = []

if (!(await pathExists(projectFolder))) {
  errors.push('Le dossier projects/demo est absent')
}

if (!(await pathExists(brinsFile))) {
  errors.push('__brins.json absent')
}

if (!(await pathExists(persosFile))) {
  errors.push('__persos.json absent')
}

if (!(await pathExists(eventsFile))) {
  errors.push('__items.json absent')
}

expect(errors).toEqual([])
  console.log('-> dossier projects/demo OK')

  expect(
    await pathExists(brinsFile)
  ).toBe(true)

  console.log('-> __brins.json OK')

  expect(
    await pathExists(persosFile)
  ).toBe(true)

  console.log('-> __persos.json OK')

  expect(
    await pathExists(eventsFile)
  ).toBe(true)

  console.log('-> __items.json OK')

  console.log('\n-> vérification DOM')

  await expect(
    page.locator('body')
  ).toContainText('Projet modèle')

  console.log('-> projet affiché dans le DOM')

  console.log(
    '\n=== FIN TEST PROJET DÉMO MINIMAL ===\n'
  )

})