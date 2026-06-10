import Lister from './Lister.js'
import Project from './Project.js'
import EventLister from './EventLister.js'
import Brin from './Brin.js'
import Perso from './Perso.js'
import ListerRepository from '../repositories/ListerRepository.js'
import KeyboardController from '../../KeyboardController.js'
import LOG from '../../system/LOG.js'
import StatusBar from '../ui/StatusBar.js'
import FilePicker from '../ui/FilePicker.js'

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

  _childListerData(item) {
    return { id: item.lister_id ?? null, parentItem: item, project_id: item.id }
  }

  async createNewItemAfter() {
    const folder_path = await FilePicker.open({ mode: 'folder', keyboardController: this.keyboardController })
    if (!folder_path) return

    this._pendingFolderPath = folder_path
    const folderName = folder_path.split('/').at(-1)

    const originalIndex = this.selectedIndex
    const insertionIndex = originalIndex + 1
    const currentEl = this.domItems[originalIndex]
    if (currentEl) currentEl.classList.remove('selected')
    const nextEl = this.domItems[insertionIndex] ?? null
    this.selectedIndex = insertionIndex

    const item = new this.itemClass({ id: '', title: folderName })
    const itemElement = item.createElement()
    item.render(itemElement)
    if (nextEl) nextEl.before(itemElement)
    else this.domContainer.appendChild(itemElement)
    this.selectElement(itemElement)

    await this.commitNewItem(item, itemElement, insertionIndex)
  }

  async commitNewItem(item, itemElement, insertionIndex) {
    const folder_path = this._pendingFolderPath ?? null
    this._pendingFolderPath = null

    await super.commitNewItem(item, itemElement, insertionIndex)

    if (!folder_path) return

    const db_path     = folder_path + '/eventer.db'
    const eventLister = await ListerRepository.createLister({ type: 'events', parent_item_id: item.id })
    item.lister_id    = eventLister.id
    await ListerRepository.createItem(eventLister.id, { title: 'Acte I', type: 'event' })
    const brinLister = await ListerRepository.createLister({ type: 'brins', parent_item_id: item.id })
    await ListerRepository.createItem(brinLister.id, {
      title: 'Intrigue principale',
      type:  'brin',
      badge: Brin.generateBadge('Intrigue principale'),
      color: Brin.colorFor(1)
    })
    const persoLister = await ListerRepository.createLister({ type: 'persos', parent_item_id: item.id })
    await ListerRepository.createItem(persoLister.id, {
      title: 'Votre protagoniste',
      badge: Perso.generateUniqueBadge('Votre protagoniste', [])
    })
    await ListerRepository.saveItem(item, { db_path, folder_path })
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