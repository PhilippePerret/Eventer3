// Constantes Project

export const PROJECT_COLORS = [
  '#d9d1a9', '#a9d1d9', '#b0a9d9', '#d9a9b0',
  '#a9d9b0', '#d9b0a9', '#b0d9c8', '#c8b0d9'
]

import {DEV_STATES} from './common.js'
export const PROJECT_STATES = [
  ...DEV_STATES,
  { value: 10, label: 'mise en ß-lecture' },
  { value: 11, label: 'recolte ß-lecture' },
  { value: 12, label: 'reecriture' },
  { value: 15, label: 'version finale' },
  { value: 20, label: 'envoi M.E.' },
  { value: 25, label: 'publication' },
  { value: 30, label: 'fin de vie' },
]

export const PROJECT_TYPES = [
      {label: 'roman'       , value: 'roman'    , man: 'manuscrit'  }
   ,  {label: 'film'        , value: 'film'     , man: 'scénario'   }
   ,  {label: 'BD'          , value: 'bd'       , man: 'scénario'   }
   ,  {label: 'Théâtre'     , value: 'theatre'  , man: 'texte'      }
   ,  {label: 'Pièce radio' , value: 'radio'    , man: 'script'     }
]
