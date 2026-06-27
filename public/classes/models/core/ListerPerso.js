import Lister from '../abstract/Lister.js'
import Perso from './Perso.js'
import { raise } from '../../../system/Error.js'

export default class ListerPerso extends Lister {

  static ITEM_CLASS = Perso
  static PANEL_ID   = 'persos-panel'
  static CHECK_KEY  = 'perso_ids'
  static pool = {}

  constructor(data = {}) {
    super(data)
    this.project = data.project ?? raise(3000)
    this.id = this.project.id + '-persos'
    this._contextItem = null // Brin ou Event
  }

  openPanel(contextItem){
    this._contextItem = contextItem
    /* ???
     _directIds = ???
     _inheritedIds = ???
      - si contextItem instanceof Event : direct = perso_ids, inherited = union des perso_ids des brins de brin_ids (via ListerBrin.pool).
      - si contextItem instanceof Brin : direct = perso_ids, inherited = ∅.
  //*/
  }

  
  async _afterLoad() {
    ListerPerso.pool = Object.fromEntries(this.items.map(p => [p.id, p]))
    this._syncChecked()
  }

  /* ???
      _syncChecked(), detach lister appelant, render(). 
  //*/
  _syncChecked() {
    this.items.forEach(p => {
      const direct    = this._directIds.has(p.id)
      const inherited = !direct && this._inheritedIds.has(p.id)
      p.checked   = direct || inherited
      p.inherited = inherited
    })
  }


  get contextItem() { return this._contextEvent }

  _canToggle(item) { return !item.inherited }

  _afterToggle(_perso, ctx) {
    /* CODE DE CLAUDE = MERDIQUE (VIOLATION DE LA RÈGLE DE RESPONSABILITÉ )
      DE TOUTE FAÇON, MAINTENANT :
        L'actualisation de la ligne de l'élément contextuel (Brin ou Event) ne
        se fait qu'à la fermeture du panneau, pas en direct.
        Et pour le respect des responsabilité (on se fiche de savoir ce qu'est
        l'item contextuel), on doit faire :
        this.contextualItem.refreshPersosMarks
    */
    if (this._contextBrin) return
    const el = ctx.el?.querySelector('.event-persos-marks')
    if (!el) return
    const tmp = document.createElement('template')
    tmp.innerHTML = ctx.persosMarks()
    el.replaceWith(tmp.content.firstChild)
  }


}
