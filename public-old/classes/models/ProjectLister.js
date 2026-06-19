import Lister from './Lister.js'
import Project from './Project.js'
import EventLister from './EventLister.js'
import Brin from './Brin.js'
import Perso from './Perso.js'
import PopupSelect from '../ui/PopupSelect.js'
import ListerRepository from '../repositories/ListerRepository.js'
import KeyboardController from '../../KeyboardController.js'
import LOG from '../../system/LOG.js'
import StatusBar from '../ui/StatusBar.js'
import FilePicker from '../ui/FilePicker.js'
import ConfirmDialog from '../ui/ConfirmDialog.js'
import Notification from '../ui/Notification.js'
import ContextualHelp from '../ui/ContextualHelp.js'

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

  get depth()     { return 0 }
  get uiModes()   { return ['projects'] }
  get projectId() { return this.items[this.selectedIndex]?.id || null }

  get childListerClass() {
    return EventLister
  }

  _childListerData(item) {
    return { id: item.id, parentItem: item, project_id: item.id }
  }

  async _countCascade(_item) {
    return 0
  }

  copySelectedItem() {
    const item = this.items[this.selectedIndex]
    if (!item) return
    const data = item.toClipboardData()
    data.id = item.id
    this.keyboardController.clipboard = { minClass: this.itemClass.minClass, data }
  }

  async pasteItem() {
    const clipboard = this.keyboardController?.clipboard
    if (!clipboard) return
    if (clipboard.minClass !== this.itemClass.minClass) return
    if (clipboard.isCut) return super.pasteItem()

    const confirmed = await ConfirmDialog.open({
      message: `Voulez-vous vraiment dupliquer le projet « ${clipboard.data.title} » ?`,
      keyboardController: this.keyboardController,
    })
    if (!confirmed) return

    const response = await fetch(`/api/projects/${clipboard.data.id}/duplicate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) {
      Notification.show('Impossible de dupliquer le projet')
      return
    }
    const newProject = await response.json()

    const insertionIndex = this.selectedIndex
    const item = new Project({ id: newProject.id, title: newProject.title, type: 'roman', folder_path: newProject.folder_path, db_path: newProject.db_path })
    const itemElement = item.createElement()
    if (typeof item.render === 'function') item.render(itemElement)
    const currentEl = this.domItems[insertionIndex]
    if (currentEl) {
      currentEl.classList.remove('selected')
      currentEl.before(itemElement)
    } else {
      this.domContainer.appendChild(itemElement)
    }
    const finalEl = this._finalizeNewItemElement(item, itemElement, insertionIndex)
    item.parentLister = this
    this.items.splice(insertionIndex, 0, item)
    this.item_ids.splice(insertionIndex, 0, item.id)
    this.domItems.splice(insertionIndex, 0, finalEl)
    this.selectedIndex = insertionIndex
    finalEl.classList.add('selected')
  }

  async createNewItemAfter() {
    const folder_path = await FilePicker.open({ mode: 'folder', keyboardController: this.keyboardController })
    if (!folder_path) return

    const checkResp = await fetch(`/api/fs/exists?path=${encodeURIComponent(folder_path + '/eventer.db')}`, { cache: 'no-store' })
    const { exists } = await checkResp.json()
    if (exists) {
      const result = await ConfirmDialog.open({
        message: 'Ce dossier contient déjà un projet (eventer.db). Dois-je l\'utiliser ?',
        keyboardController: this.keyboardController,
        buttons: [
          { label: 'Annuler',          key: 'Escape', shortcut: '␛',  value: false     },
          { label: 'Non, la détruire', key: 'Delete', shortcut: '⌦',  value: 'destroy' },
          { label: 'Oui',              key: 'Enter',  shortcut: '↩︎', value: 'use'     },
        ],
      })
      if (!result) return
      if (result === 'use') {
        const importResp = await fetch('/api/projects/open', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ folder_path }),
        })
        if (!importResp.ok) return
        const imported = await importResp.json()
        await this.loadDefinition()
        await this.loadItems()
        const newIdx = this.items.findIndex(i => i.id === imported.id)
        if (newIdx >= 0) this.selectedIndex = newIdx
        this.render()
        return
      }
      // 'destroy' → supprimer l'eventer.db existant, puis créer un nouveau projet
      await fetch(`/api/fs?path=${encodeURIComponent(folder_path + '/eventer.db')}`, { method: 'DELETE' })
    }

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

    const db_path = folder_path + '/eventer.db'

    // Sauver db_path en PREMIER pour que create_lister sache utiliser le project DB
    await ListerRepository.saveItem(item, { db_path, folder_path })

    const eventLister = await ListerRepository.createLister({ type: 'events', parent_item_id: item.id })
    item.lister_id    = eventLister.id
    await ListerRepository.createItem(eventLister.id, { title: 'Acte I', type: 'event' }, { project_id: item.id })

    const brinLister = await ListerRepository.createLister({ type: 'brins', parent_item_id: item.id })
    await ListerRepository.createItem(brinLister.id, {
      title: 'Intrigue principale',
      type:  'brin',
      badge: Brin.generateBadge('Intrigue principale'),
      color: Brin.colorFor(1)
    }, { project_id: item.id })
    const persoLister = await ListerRepository.createLister({ type: 'persos', parent_item_id: item.id })
    await ListerRepository.createItem(persoLister.id, {
      title: 'Votre protagoniste',
      badge: Perso.generateUniqueBadge('Votre protagoniste', [])
    }, { project_id: item.id })
  }

  openNaturePanel() {
    const projectId = this.projectId
    if (!projectId) return
    new PopupSelect({
      options: [
        { value: 'roman', label: 'roman' },
        { value: 'film',  label: 'film/BD' },
        { value: null,    label: '— (aucun)' },
      ],
      currentValue: null,
      showSearch: false,
      keyboardController: this.keyboardController,
      onSelect: async (nature) => {
        await ListerRepository.saveProjectMeta(projectId, { nature })
      },
      onCancel: () => {}
    }).open(document.getElementById('main-panel'))
  }

  render() {
    ContextualHelp.resetContext('project-list')
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