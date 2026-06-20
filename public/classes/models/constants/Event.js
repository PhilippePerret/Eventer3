// Constantes Event

export const EVENT_METEO = {
 ps: '☀️', //"ps" pour "plein soleil"
 vo: '🌤️', //"vo" pour "voilé"
 di:'🌦️',  // "di" pour "soleil discret"
 nu: '☁️', // "nu" pour "nuageux"
 gr:' 💨', // "gr" pour "ciel gris/nuageux de nuit"
 ne: '⛈️', // "ne" pour "neigeux"
 to:'🌪️',  // "to" pour "tornade"
 pl:'🌨️'    // pl" pour "pluvieux"
}


// Définition des incompatibilés (il ne peut pas faire "plein soleil"
// pendant la nuit)
export const EVENT_METEO_EXLUSIONS = {
  ps: ['au', 'cr', 'nu'],
  vo: ['au', 'nu', 'cr'],
  di: ['au', 'nu', 'cr']
}
export const EVENT_EFFET = {
  au: 'Aube',
  ma: 'Matin',
  mi: 'Midi',
  jr: 'Jour',
  so: 'Soir',
  cr: 'Crépuscule',
  nu: 'Nuit'
}


export const EVENT_LIEU = {
  ext: 'Extérieur',
  int: 'Intérieur',
  blk: 'Noir',
  ind: 'Indéfini',
}


import {DEV_STATES} from './common.js'
export const EVENT_STATE = [...DEV_STATES]
