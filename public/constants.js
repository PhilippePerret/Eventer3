export const PERSO_AVATARS = [
  '😀','🤠','🥸', '👩🏼','😎','🧑🏻','👨🏻','👩🏻‍🦱','👩🏼‍🦱','🤯',
  '👶', '👦🏽','👦🏿','👩🏽','🧑🏿', '🧑🏼','👨🏼','👩🏽‍🦱','👩🏾‍🦱','🧑🏼‍🦱','🧑🏾‍🦱',
  '🐉','👨‍🦳','👨🏽‍🦳','👱🏾‍♀️','👵🏻','👱🏻‍♀️','🧔🏻‍♀️','👵', '🧓🏼', '🕵🏻‍♀️','🕵🏻‍♂️',
  '🕵🏾‍♂️','👮🏻‍♀️','👮🏽','👩🏻‍🎓', '👩🏾‍🎓','🧑🏼‍🌾','🧑🏽‍🏫',
  '🦊','🦮','🐕‍🦺','🐩','🐴','🐒','🐈','🐈‍⬛','🦜','🦆','🐏'
]

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

export const EVENT_STATE = [ // aussi pour les projets
  { value: 0, label: '—' },
  { value: 1, label: 'ébauche' },
  { value: 2, label: 'développement' },
  { value: 3, label: 'premier jet' },
  { value: 4, label: 'réécriture' },
  { value: 5, label: 'achèvement' },
  { value: 6, label: 'à corriger' },
  { value: 7, label: 'correction' },
  { value: 8, label: 'à relire' },
  { value: 9, label: 'achevé' }

]

export const PERSO_FONCTIONS = [
  'protagoniste',
  'antagoniste',
  'deutéragoniste',
  'adjuvant',
  'opposant',
  'personnage secondaire',
  'figurant',
  'narrateur'
]

export const SHORTCUTS = [
  {
    contextName: "Liste d'éléments",
    description: "Liste de projets, d'event, de brins…",
    shortcuts: [
      {sc: '↑', ef: 'sélectionner l’élément au-dessus'},
      {sc: '↓', ef: 'sélectionner l’élément au-dessous'},
      {sc: '⌘ + ↑', ef: 'Monter l’élément sélectionné'},
      {sc: '⌘ + ↓', ef: 'Descendre l’élément sélectionné'},
      {sc: '␣', ef: 'cocher/décocher l’élément sélectionné'}
    ]
  },
  {
    contextName: "Liste des évènements",
    description: "Ce qu'on peut faire quand la liste des évènements est affichée",
    shortcuts: [
      {sc: '↩︎', ef: "Édition de l'évènement sélectionné"},
      {sc: 'b', ef: 'Affiche les brins pour les éditer et les choisir'},
      {sc: 'p', ef: 'Affiche les personnages pour les éditer et les choisir'},

    ]
  },
  {
    contextName: "Liste des brins",
    description: "Ce qu'on peut faire quand la liste des brins est affichée",
    shortcuts: [
      {sc: 'p', ef: 'Affiche les personnages pour les éditer et les choisir'}
    ]
  },
  {
    contextName: "Copier, Couper, Coller",
    description: "Pour copier, couper ou coller des éléments de tout type.",
    shortcuts: [
      {sc: '⌘ + c', ef: 'Copier l’élément sélectionné'},
      {sc: '⌘ + x', ef: 'Couper l’élément sélectionné'},
      {sc: '⌘ + v', ef: 'Coller les éléments sélectionnés'},
      {sc: '⇧ + ⌘ + c', ef: 'Copier les éléments cochés'},
      {sc: '⇧ + ⌘ + x', ef: 'Couper les éléments sélectionnés'},
      {sc: '⌘ + v', ef: 'Coller les éléments sélectionnés'},
      {sc: '⌦', ef: 'Supprimer l’élément sélectionné'},
      {sc: '⇧ + ⌦', ef: 'Supprimer les éléments cochés'},
    ]
  },
  {
    contextName: "édition des éléments",
    description: "Création, modification, suppression…",
    shortcuts: [
      {sc: 'n', ef: 'Création de l’élément au-dessus du sélectionné'},
      {sc: '⌥ + n', ef: 'Création de l’élément en dessous du sélectionné'},
      {sc: '↩︎', ef: 'Édition de l’lément sélectionné'},
      {mode: 'ÉDITION', sc: '⇥', ef: 'Passer en revue les propriétés'},
      {mode: 'ÉDITION', sc: '↩︎', ef: 'Enregitrer les changements'},
      {mode: 'ÉDITION', sc: '␛', ef: 'Annuler les modifications'},
    ]
  },
  {
    contextName: "Filtrage des éléments",
    description: "Filtrer les projets, les events, les brins…",
    shortcuts: [
      {sc: '⌘ + :', ef: 'Passer en mode filtre'},
      {mode: 'FILTRE', sc: 'b', ef: 'Filtrer les events par les brins'},
      {mode: 'FILTRE', sc: 't', ef: 'Filtrer par le texte'},
      {mode: 'FILTRE', sc: 'p', ef: 'Filtrer les events ou les brins par les personnages'}
    ]
  }
]
