import Lister from '../abstract/Lister.js'
import Project from './Project.js'
import ListerEvent from './ListerEvent.js'
import FilePicker from '../../ui/FilePicker.js'
import ConfirmDialog from '../../ui/ConfirmDialog.js'
import LOG from '../../../system/LOG.js'

export default class ListerProject extends Lister {
  static ITEM_CLASS  = Project
  static CHILD_CLASS = ListerEvent

  static async init() {
    LOG.m(1, 'Init projects')
    const lister = new ListerProject({ id: 1 })
    await lister.load()
    lister.render()
    lister.attach(lister.container)
    LOG.m(1, 'ListerProject ready')
    return lister
  }

  async createNew() {
    const folderPath = await FilePicker.open({ mode: 'folder' })
    if (!folderPath) { this.focusSelected(); return }

    const folderName = folderPath.split('/').at(-1)
    const dbPath     = folderPath + '/eventer.db'
    const insertIdx  = this.selectedIndex + 1
    const prevIds    = [...this.item_ids]

    const existsResp = await fetch(`/api/fs/exists?path=${encodeURIComponent(dbPath)}`, { cache: 'no-store' })
    const { exists } = await existsResp.json()

    if (exists) {
      const choice = await ConfirmDialog.open({
        title:   'Projet existant',
        message: 'Ce dossier contient déjà un projet (eventer.db). Que faire ?',
        buttons: [
          { label: 'Importer', type: '',       value: 'use'     },
          { label: 'Détruire', type: 'danger', value: 'destroy' },
          { label: 'Annuler',  type: 'cancel', value: false     },
        ],
      })
      if (!choice) { this.focusSelected(); return }

      if (choice === 'use') {
        const resp = await fetch('/api/projects/open', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ folder_path: folderPath }),
        })
        if (!resp.ok) return
        const { id: newId } = await resp.json()
        await this._appendToOrder(prevIds, newId, insertIdx)
        return
      }

      // choice === 'destroy'
      await fetch(`/api/fs?path=${encodeURIComponent(dbPath)}`, { method: 'DELETE' })
    }

    const resp = await fetch('/api/listers/1/items', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ title: folderName, folder_path: folderPath, db_path: dbPath }),
    })
    if (!resp.ok) return
    const { id: newId } = await resp.json()

    await fetch(`/api/items/${newId}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ db_path: dbPath }),
    })

    await this.constructor.ITEM_CLASS.onCreated?.(newId)

    await this._appendToOrder(prevIds, newId, insertIdx)
  }

  async _appendToOrder(prevIds, newId, insertIdx) {
    const newOrder = [...prevIds]
    newOrder.splice(insertIdx, 0, newId)
    await fetch('/api/settings/project_order', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ value: JSON.stringify(newOrder) }),
    })
    await this._reloadAt(insertIdx)
  }
}
