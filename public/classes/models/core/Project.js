import Item from '../abstract/Item.js'
import Lister from '../abstract/Lister.js'
import {PROJECT_STATES, PROJECT_TYPES} from '../constants/Project.js'


export default class Project extends Item {

  get PROPS(){ return this._props || (this._props = [
        {name: 'title', type: 'text',   warper: 'body'}
      , {name: 'state', type: 'select', warper: 'edits', values: PROJECT_STATES }
      , {name: 'type',  type: 'select', warper: 'edits', values: PROJECT_TYPES}
    ])}

  static async onCreated(id) {
    const evtLister = await Lister.createLister({ type: 'events', parent_item_id: id, project_id: id })
    if (evtLister?.id) await new Lister({ id: evtLister.id, project_id: id }).createItem({ title: 'Acte I' })
  }

}