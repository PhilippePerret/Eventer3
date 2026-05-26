import fs from 'node:fs/promises'
import path from 'node:path'

const testsDir = process.cwd()
const projectRoot = path.resolve(testsDir, '..')
const dataDir = path.join(projectRoot, 'data')
const fallbackBackupDir = path.join(projectRoot, '.data_before_tests')
const markerFile = path.join(testsDir, '.data-backup-path')

async function readBackupDir() {
  try {
    const value = await fs.readFile(markerFile, 'utf8')
    return value.trim() || fallbackBackupDir
  } catch {
    return fallbackBackupDir
  }
}

export default async function globalTeardown() {
  const backupDir = await readBackupDir()

  await fs.rm(dataDir, { recursive: true, force: true })
  await fs.cp(backupDir, dataDir, { recursive: true })

  await fs.rm(backupDir, { recursive: true, force: true })
  await fs.rm(markerFile, { force: true })
}
