import Lister from '../abstract/Lister.js'
import Project from './Project.js'
import LOG from '../../../system/LOG.js'

export default class ProjectLister extends Lister {
  static ITEM_CLASS = Project

  static async init() {
    LOG.m(1, 'Init projects')
    const lister = new ProjectLister({ id: 1 })
    await lister.Repo.load()
    lister.Dom.render()
    LOG.m(1, 'ProjectLister ready')
    return lister
  }
}