import fs from 'fs'
import path from 'path'

export function installFixtures(fixtureName) {
  const fixtureDb = path.resolve('fixtures', fixtureName, 'eventer.db')
  const dataDir   = path.resolve('..', 'data')
  const dataDb    = path.join(dataDir, 'eventer.db')

  fs.mkdirSync(dataDir, { recursive: true })
  fs.rmSync(dataDb, { force: true })
  fs.copyFileSync(fixtureDb, dataDb)
}
