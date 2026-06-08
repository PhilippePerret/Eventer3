import Lister from './Lister.js'
import Project from './Project.js'
import EventLister from './EventLister.js'
import Brin from './Brin.js'
import Perso from './Perso.js'
import ListerRepository from '../repositories/ListerRepository.js'
import KeyboardController from '../../KeyboardController.js'
import LOG from '../../system/LOG.js'
import StatusBar from '../ui/StatusBar.js'

export default class ProjectLister extends Lister {

  static async init() {
    LOG.m(1, 'Init projects')
    const keyboardController = new KeyboardController()
    keyboardController.observe()
    window.__keyboardController = keyboardController
    const projects = new ProjectLister({ id: 1, keyboardController })
    await projects.loadDefinition()
    await projects.loadItems()
    projects.render()
    LOG.m(1, 'ProjectLister ready')
    return projects
  }

  constructor(data = {}) {
    super(data)
    this.itemClass = Project
  }

  get depth() { return 0 }

  get uiModes() { return ['projects'] }

  get childListerClass() {
    return EventLister
  }

  async commitNewItem(item, itemElement, insertionIndex) {
    await super.commitNewItem(item, itemElement, insertionIndex)
    const eventLister = await ListerRepository.createLister({ type: 'events', parent_item_id: item.id })
    item.lister_id = eventLister.id
    await ListerRepository.createItem(eventLister.id, { title: 'Acte I', type: 'event' })
    const brinLister = await ListerRepository.createLister({ type: 'brins', parent_item_id: item.id })
    await ListerRepository.createItem(brinLister.id, {
      title: 'Intrigue principale',
      type: 'brin',
      badge: Brin.generateBadge('Intrigue principale'),
      color: Brin.colorFor(1)
    })
    const persoLister = await ListerRepository.createLister({ type: 'persos', parent_item_id: item.id })
    await ListerRepository.createItem(persoLister.id, {
      title: 'Votre protagoniste',
      badge: Perso.generateUniqueBadge('Votre protagoniste', [])
    })
  }

  render() {
    const result = super.render()
    StatusBar.update('projects')
    return result
  }

  renderHeader() {
    const h1 = document.createElement('h1')
    h1.className = 'project-screen-title'
    h1.textContent = 'Liste des projets'
    return h1
  }

}