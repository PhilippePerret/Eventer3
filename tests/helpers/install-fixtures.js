import fs from 'fs'
import path from 'path'

export function installFixtures(fixtureName) {
  const fixtureDir = path.resolve('fixtures', fixtureName)
  const dataDir    = path.resolve('..', 'data')

  fs.rmSync(dataDir, { recursive: true, force: true })
  fs.cpSync(fixtureDir, dataDir, { recursive: true })
}
