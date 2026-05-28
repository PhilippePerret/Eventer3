import fs from 'fs'
import path from 'path'

export function installFixtures(fixtureName) {
  const fixturesFolder = path.resolve('fixtures', fixtureName)
  const dataFolder = path.resolve('..', 'data')
  fs.rmSync(dataFolder, { recursive: true, force: true })
  fs.mkdirSync(dataFolder, { recursive: true })
  copyDirectory(fixturesFolder, dataFolder)
}

function copyDirectory(sourceFolder, targetFolder) {
  fs.mkdirSync(targetFolder, { recursive: true })
  fs.readdirSync(sourceFolder, { withFileTypes: true }).forEach(entry => {
    const sourcePath = path.join(sourceFolder, entry.name)
    const targetPath = path.join(targetFolder, entry.name)
    if (entry.isDirectory()) copyDirectory(sourcePath, targetPath)
    else fs.copyFileSync(sourcePath, targetPath)
  })
}
