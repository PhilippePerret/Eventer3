import fs from 'node:fs/promises'
import path from 'node:path'

const testsDir = process.cwd()
const projectRoot = path.resolve(testsDir, '..')
const dataDir = path.join(projectRoot, 'data')
const backupDir = path.join(projectRoot, '.data_before_tests')
const fixtureDir = path.join(testsDir, 'data_ini_state')
const markerFile = path.join(testsDir, '.data-backup-path')

async function exists(p) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

export default async function globalSetup() {
  await fs.rm(backupDir, { recursive: true, force: true })

  if (await exists(dataDir)) {
    await fs.cp(dataDir, backupDir, { recursive: true })
  } else {
    await fs.mkdir(backupDir, { recursive: true })
  }

  await fs.writeFile(markerFile, backupDir, 'utf8')

  await fs.rm(dataDir, { recursive: true, force: true })
  await fs.cp(fixtureDir, dataDir, { recursive: true })
}
