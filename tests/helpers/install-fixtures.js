import fs from 'fs'
import path from 'path'

export function installFixtures(fixtureName) {

  const fixturesFolder = path.resolve(
    'fixtures',
    fixtureName
  )

  const dataFolder = path.resolve(
    'public/data/projects'
  )

  fs.rmSync(dataFolder, {
    recursive: true,
    force: true
  })

  fs.mkdirSync(dataFolder, {
    recursive: true
  })

  const files = fs.readdirSync(fixturesFolder)

  files.forEach(filename => {

    fs.copyFileSync(
      path.join(fixturesFolder, filename),
      path.join(dataFolder, filename)
    )

  })

}