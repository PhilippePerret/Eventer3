import Item from '../abstract/Item.js'
import { ProjectLi } from '../listen/Project.js'
import Lister from '../abstract/Lister.js'
import ListerBrin  from './ListerBrin.js'
import ListerPerso from './ListerPerso.js'
import ListerEvent from './ListerEvent.js'
import ListerStyle from './ListerStyle.js'
import TargetsManager from '../../ui/TargetsManager.js'
import { PROJECT_STATES, PROJECT_TYPES, PROJECT_COLORS } from '../constants/Project.js'
import { WORD_FORMS } from '../../../constants/constants.js'
import LOG from '../../../system/LOG.js'


export default class Project extends Item {
  static COLORS    = PROJECT_COLORS
  static LISTENERS = ProjectLi
  static get thingName() { return WORD_FORMS.Project }

  constructor(data = {}) {
    super(data)
    this.project = this   // un Project est son propre contexte projet
  }

  get listerBrins()    { return this._lbrins  ?? (this._lbrins  = new ListerBrin({ project: this }))       }
  get listerPersos()   { return this._lpersos ?? (this._lpersos = new ListerPerso({ project: this }))     }
  get listerStyle()    { return this._lstyle  ?? (this._lstyle  = new ListerStyle({ project: this }))     }
  get targetsManager() { return this._tmgr   ?? (this._tmgr   = new TargetsManager(this))                }

  // Seul point à tenir à jour si on ajoute une classe d'item : type → table { id → item }
  get itemsById() {
    return {
      brins:  this.listerBrins.byId,
      persos: this.listerPersos.byId,
    }
  }

  async enterInside() {
    await this.listerBrins.load()
    this.listerBrins.build()
    try { await this.listerPersos.load() } catch(e) { LOG.m(1, 'ERREUR persos.load', e.message) }
    this.listerPersos.build()
    await this.listerStyle.load()
    this.listerStyle.build()
    await this._enterChildLister(ListerEvent, this.lister_id)
    await this.targetsManager.load()
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

  static async onCreated(project) {
    const evtLister = await Lister.createLister({ type: 'events', itemId: project.id, project: project })
    if (evtLister?.id) await new Lister({ id: evtLister.id, project: project }).createItem({ title: 'Acte I' })
    await new ListerBrin({ project }).load()
    await new ListerPerso({ project }).load()
  }

}
