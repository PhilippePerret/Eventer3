import { ListerLi } from './Lister.js'

export const EventLi = {
    b: { nokey: 'openBrinPanel'  }
  , p: { nokey: 'openPersoPanel' }
  , s: { nokey: 'openStylePanel'    , maj: 'openStylePanel' /* cochés */}
}

export const ListerEventLi = {
  ...ListerLi,
  ArrowLeft: { nokey: 'leaveToParent', 'ctrl+maj': 'movePanelLeft' },
  m:         { meta:  'toggleDisplayMode' },
  t:         { nokey: 'openNaturePanel', meta: 'openToolsPanel' },
}