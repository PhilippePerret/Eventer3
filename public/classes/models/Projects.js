import Lister from './Lister.js'
import Project from './Project.js'
import EventLister from './EventLister.js'
import KeyboardController from '../../KeyboardController.js'
import LOG from '../../system/LOG.js'

export default class Projects extends Lister {

  static async init() {
    LOG.m(1, 'Init projects')
    const keyboardController = new KeyboardController()
    keyboardController.observe()
    window.__keyboardController = keyboardController
    const projects = new Projects({ id: 'projects', keyboardController })
    await projects.loadDefinition()
    await projects.loadItems()
    projects.render()
    LOG.m(1, 'Projects ready')
    return projects
  }

  constructor(data = {}) {
    super(data)
    this.itemClass = Project
  }

  get uiModes() { return ['projects'] }

  get childListerClass() {
    return EventLister
  }

  renderHeader() {
    const h1 = document.createElement('h1')
    h1.className = 'project-screen-title'
    h1.textContent = 'Liste des projets'
    return h1
  }

}