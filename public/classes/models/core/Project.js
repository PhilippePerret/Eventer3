import Item from '../abstract/Item.js'

import {PROJECT_STATES, PROJECT_TYPES} from '../constants/Project.js'


export default class Project extends Item {

  get PROPS(){ return this._props || (this._props = [
        {name: 'title', type: 'text'}
      , {name: 'state', type: 'select', values: PROJECT_STATES }
      , {name: 'type', type: 'select', values: PROJECT_TYPES}
    ])}
  
}