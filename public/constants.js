export const PERSO_AVATARS = [
  '😀','🤠','🥸', '👩🏼','😎','🧑🏻','👨🏻','👩🏻‍🦱','👩🏼‍🦱','🤯',
  '👶', '👦🏽','👦🏿','👩🏽','🧑🏿', '🧑🏼','👨🏼','👩🏽‍🦱','👩🏾‍🦱','🧑🏼‍🦱','🧑🏾‍🦱',
  '🐉','👨‍🦳','👨🏽‍🦳','👱🏾‍♀️','👵🏻','👱🏻‍♀️','🧔🏻‍♀️','👵', '🧓🏼', '🕵🏻‍♀️','🕵🏻‍♂️',
  '🕵🏾‍♂️','👮🏻‍♀️','👮🏽','👩🏻‍🎓', '👩🏾‍🎓','🧑🏼‍🌾','🧑🏽‍🏫',
  '🦊','🦮','🐕‍🦺','🐩','🐴','🐒','🐈','🐈‍⬛','🦜','🦆','🐏'
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
      {sc: '␣', ef: 'cocher/décocher l’élément sélectionné'},
      {sc: '⌘ + ↑', ef: 'Monter l’élément sélectionné'}
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
      {sc: '⌘ + v', ef: 'Coller les éléments sélectionnés'}
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
      {sc: '/', ef: 'Passer en mode filtre'},
      {mode: 'FILTRE', sc: '/b', ef: 'Filtrer les events par les brins'},
      {mode: 'FILTRE', sc: '/t', ef: 'Filtrer par le texte'},
      {mode: 'FILTRE', sc: '/p', ef: 'Filtrer les events ou les brins par les personnages'}
    ]
  }
]
