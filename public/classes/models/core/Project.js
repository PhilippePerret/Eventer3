import Item from '../abstract/Item.js'
import ListerRepo from '../abstract/ListerRepo.js'
import {PROJECT_STATES, PROJECT_TYPES} from '../constants/Project.js'


export default class Project extends Item {

  get PROPS(){ return this._props || (this._props = [
        {name: 'title', type: 'text',   warper: 'body'}
      , {name: 'state', type: 'select', warper: 'left-col', values: PROJECT_STATES }
      , {name: 'type',  type: 'select', warper: 'left-col', values: PROJECT_TYPES}
    ])}

  static async onCreated(id) {
    const evtLister = await ListerRepo.createLister({ type: 'events', parent_item_id: id, project_id: id })
    if (evtLister?.id) await ListerRepo.createItem(evtLister.id, { title: 'Acte I' }, { project_id: id })
  }

}