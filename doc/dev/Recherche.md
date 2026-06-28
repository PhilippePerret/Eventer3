# Recherche et expérimentations

## 19 juin 2026

Je ne voudrais aucun test de condition dans les raccourcis clavier.

Travail sur « p » doit ouvrir le panneau des personnages pour un event et pour un brin

~~~javascript
Item {
  get Dom(){ return this._dom || (this._dom = new ItemDom(this)) }
 
  
class ItemDom {
  constructor(item){ this.item = item }
  
  /**
  @dm Data méthod définie dans LISTENERS
  @ev Keyboard Event 
  */
  getMethod(ev, dm){
    var m = null
    const meta = ev.metaKey,
    			alt = ev.altKey,
    			maj = ev.shiftKey,
          ctrl = ev.ctrlKey;
    
		if (meta) {
     	if (alt && m = dm['meta+alt']) return m
    	if (ctrl && m = dm['meta+ctrl']) return m
      if (maj  && m = dm['meta+maj']) return m
      if (m = dm['meta']) return m
    } else if (alt) {
      if (ctrl && m = dm['ctrl+alt']) return m
      if (maj  && m = dm['maj+alt']) return m
      if (m = dm['alt']) return m
    } else if (ctrl) {
      if ( m = dm['ctrl']) return m
    }
    if (m = dm['nokey']) return m
  }
    
  onkeydown(ev) {
    let dmethod
  	if (dmethod = this.LISTENERS[ev.key]) {
      const method = this.getMethod(ev, dmethod)
			method && this[method](ev /* on a besoin de shift, ou target, originalTarget…*/)
    }
  }

const LISTER_LISTENERS = {
  ArrowDown: {},
  
}
  
const ITEM_LISTENERS = {
  k: {meta: 'openTargetPanel', nokey: 'targetItem'},
  p: {nokey: 'openPersoPanel'},
  c: {meta: 'copyItem'}
}
  
EventLister.Dom.LISTENERS = Object.assign(LISTER_LISTENER,{
  
}
// idem pour les autres
Event.Dom.LISTENERS = Object.assign(ITEM_LISTENERS, {
  // hérite de k, p, ↓ etc.
})

Project.Dom.LISTENERS = Object.assign(ITEM_LISTENERS, {
  // hérite de k, p, ↓ etc.
})

Style.Dom.LISTENERS = {
	// pas 'k' un style ne peut pas être une cible
  k: null,
  p: null, // pas de personnages pour les styles
}
  
//---
Brin.Dom.LISTENERS = {
  b: null // pas de brins pour les brins…
  
~~~

