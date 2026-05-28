import Projects from './models/Projects.js'
import LOG from '../system/LOG.js'

export default class App {

  async start() {
    LOG.on(3)

    LOG.m(1, 'Start application')

    await Projects.init()

    LOG.m(1, 'Application started, projets affichés')

  }

}