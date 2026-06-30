import { ListerLi } from './Lister.js'

export const StyleLi = {
    ' ': { nokey: 'toggleSelectedItemChecked' }
  , s:   { nokey: 'closePanel'               }
}

export const ListerStyleLi = {
    ...ListerLi
  , ...StyleLi
}
