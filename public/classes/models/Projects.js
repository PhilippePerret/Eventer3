import Lister from './Lister.js'
import Project from './Project.js'
import EventLister from './EventLister.js'
import KeyboardController from '../../KeyboardController.js'
import LOG from '../../system/LOG.js'

export default class Projects extends Lister {

  static async init() {
    LOG.m(1, 'Init projects')
    let projectsData = {}
    try {
      const response = await fetch('/data/lof-projects.json')
      if (response.ok) projectsData = await response.json()
    } catch(error) {
      projectsData = {}
    }
    const keyboardController = new KeyboardController()
    keyboardController.observe()
    window.__keyboardController = keyboardController
    const projects = new Projects({ ...projectsData, keyboardController })
    LOG.m(1, 'BEFORE LOAD ITEMS')
    await projects.loadItems()
    LOG.m(1, 'ITEMS', projects.items)
    projects.render()
    LOG.m(1, 'Projects ready')
    return projects
  }

  constructor(data = {}) {
    super(data)
    this.itemClass = Project
  }

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