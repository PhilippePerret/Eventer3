import { ListerLi } from './Lister.js'

export const EventLi = {
    b: { nokey: 'openBrinPanel', maj: 'openBrinPanel' /* cochés */ }
  , p: { nokey: 'openPersoPanel', maj: 'openPersoPanel' /* cochés */ }
  , s: { nokey: 'openStylePanel'    , maj: 'openStylePanel' /* cochés */}
}

export const ListerEventLi = {
  ...ListerLi,
  ArrowLeft: { nokey: 'leaveToParent', 'ctrl+maj': 'movePanelLeft' },
  m:         { meta:  'toggleDisplayMode' },
  t:         { nokey: 'openNaturePanel', meta: 'openToolsPanel' },
}