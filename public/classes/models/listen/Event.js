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
  Tab:       { nokey: 'cycleLink', maj: 'cycleLinkBack' },
  o:         { nokey: 'openActiveLink' },
  g:         { nokey: 'goLink' },
  a:         { nokey: 'splitLink' },
  t:         { nokey: 'openNaturePanel', meta: 'openToolsPanel' },
}