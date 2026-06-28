import test from 'node:test'
import assert from 'node:assert/strict'

import ListerBrin from '../../../../../public/classes/models/core/ListerBrin.js'

// Invariant : quand on coche un brin pour un event, les persos portés par ce brin
// sont retirés des persos DIRECTS de l'event (un perso ne peut être direct + hérité).

function makeLister() {
  return new ListerBrin({ project: { id: 'p1' } })
}

test.only('cocher un brin retire de l_event les persos directs portés par le brin', () => {
  const lister = makeLister()
  const brin = { checked: true, perso_ids: ['c1', 'c2'] }
  const ev   = { perso_ids: ['c1', 'c3'], el: null }
  lister._afterToggle(brin, ev)
  assert.deepEqual(ev.perso_ids, ['c3'])
})

test.only('decocher un brin ne touche pas aux persos directs de l_event', () => {
  const lister = makeLister()
  const brin = { checked: false, perso_ids: ['c1', 'c2'] }
  const ev   = { perso_ids: ['c1', 'c3'], el: null }
  lister._afterToggle(brin, ev)
  assert.deepEqual(ev.perso_ids, ['c1', 'c3'])
})
