import ProjectLister from './models/ProjectLister.js'
import LOG from '../system/LOG.js'

export default class App {

  async start() {
    LOG.on(0)
    // LOG.on(1)

    LOG.m(1, 'Start application')

    await ProjectLister.init()

    LOG.m(1, 'Application started, projets affichés')

  }

}