// Constantes Project

import {DEV_STATES} from './common.js'
export const PROJECT_STATES = Object.assign(DEV_STATES, [
   { value: 10, label: 'mise en ß-lecture' },
   { value: 11, label: 'récolte ß-lecture' },
   { value: 12, label: 'réécriture' },
   { value: 15, label: 'version finale' },
   { value: 20, label: 'envoi maison d’édition' },
   { value: 25, label: 'publication' },
   { value: 30, label: 'fin de vie' }
])

export const PROJECT_TYPES = [
      {name: 'roman'    , value: 'roman'     }
   ,  {name: 'film'     , value: 'film'      }
   ,  {name: 'BD'       , value: 'bd'        }
   ,  {name: 'Théâtre'  , value: 'theatre'   }
]