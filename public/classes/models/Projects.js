import Lister from './Lister.js'
import Project from './Project.js'
import KeyboardController from '../../KeyboardController.js'
import LOG from '../../system/LOG.js'

export default class Projects extends Lister {

  static async init() {
    LOG.m(1, 'Init projects')
    let projectsData = {}
    try {
      const response = await fetch('/data/projects.json')
      if (response.ok) projectsData = await response.json()
    } catch(error) {
      projectsData = {}
    }
    const keyboardController = new KeyboardController()
    keyboardController.observe()
    const projects = new Projects({ ...projectsData, keyboardController })
    await projects.loadItems()
    const projectsListElement = projects.render()
    const mainPanel = document.querySelector('#main-panel')
    mainPanel.appendChild(projectsListElement)
    LOG.m(1, 'Projects ready')
    return projects
  }

  constructor(data = {}) {
    super(data)
    this.itemClass = Project
  }

}