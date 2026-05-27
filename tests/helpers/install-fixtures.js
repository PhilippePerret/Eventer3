import fs from 'fs'
import path from 'path'

export function installFixtures(fixtureName) {

  const fixturesFolder = path.resolve(
    'fixtures',
    fixtureName
  )

  const dataFolder = path.resolve(
    '..',
    'data'
  )

  const projectsFolder = path.join(
    dataFolder,
    'projects'
  )

  fs.rmSync(dataFolder, {
    recursive: true,
    force: true
  })

  fs.mkdirSync(projectsFolder, {
    recursive: true
  })

  fs.copyFileSync(
    path.join(fixturesFolder, 'projects.json'),
    path.join(dataFolder, 'projects.json')
  )

  const files = fs.readdirSync(fixturesFolder)

  files
    .filter(filename => filename !== 'projects.json')
    .forEach(filename => {
      fs.copyFileSync(
        path.join(fixturesFolder, filename),
        path.join(projectsFolder, filename)
      )
    })

}