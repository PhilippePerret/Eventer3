import fs from 'fs'
import path from 'path'

export function installFixtures(fixtureName) {
  const fixturesFolder = path.resolve('fixtures', fixtureName)
  const dataFolder = path.resolve('..', 'data')

  fs.rmSync(dataFolder, { recursive: true, force: true })
  fs.cpSync(fixturesFolder, dataFolder, { recursive: true })
}
