// Constantes Project

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
      {label: 'roman'    , value: 'roman'     }
   ,  {label: 'film'     , value: 'film'      }
   ,  {label: 'BD'       , value: 'bd'        }
   ,  {label: 'Theatre'  , value: 'theatre'   }
]
