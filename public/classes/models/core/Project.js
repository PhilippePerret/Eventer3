import Item from '../abstract/Item.js'
import Lister from '../abstract/Lister.js'
import ListerBrin from './ListerBrin.js'
import ListerPerso from './ListerPerso.js'
import ListerEvent from './ListerEvent.js'
import { PROJECT_STATES, PROJECT_TYPES, PROJECT_COLORS } from '../constants/Project.js'
import { WORD_FORMS } from '../../../constants/constants.js'


export default class Project extends Item {
  static COLORS    = PROJECT_COLORS
  static get thingName() { return WORD_FORMS.Project }
  static get current() { return Project._current }

  get listerBrins()  { return this._lbrins  ?? (this._lbrins  = new ListerBrin({ project_id: this.id })) }
  get listerPersos() { return this._lpersos ?? (this._lpersos = new ListerPerso({ project_id: this.id })) }

  async enterInside() {
    Project._current = this
    await this.listerBrins.load()
    await this.listerPersos.load()
    await this._enterChildLister(ListerEvent, this.lister_id, this.id)
  }

  async onChildListerCreated(child) {
    child.project = this
  }

  // INTERDICTION FORMELLE D'AJOUTER UNE PROPRIÉTÉ cssClass OU CONSORT !!! TOUTES LES PROPRIÉTÉS CSS DÉCOULENT NATURELLEMENT DE LA CLASSE MINUSCULE, DU :name ET DU :warper. CES TROIS VALEURS SUFFISENT AMPLEMENT POUR DÉSIGNER PRÉCISÉMENT L'ÉLÉMENT.
  get PROPS(){ return this._props || (this._props = [
        {name: 'title', type: 'text',   warper: 'body'}
      , {name: 'state', type: 'select', warper: 'edits', values: PROJECT_STATES }
      , {name: 'type',  type: 'select', warper: 'edits', values: PROJECT_TYPES}
    ])}

  static async onCreated(id) {
    const evtLister = await Lister.createLister({ type: 'events', itemId: id, project_id: id })
    if (evtLister?.id) await new Lister({ id: evtLister.id, project_id: id }).createItem({ title: 'Acte I' })
  }

}
