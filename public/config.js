export const SHORTCUTS = [
  {
    contextName: "Liste d'éléments",
    description: "Liste de projets, d'event, de brins…",
    shorcuts: [
      {sc: '↑', ef: 'choisir l’élément au-dessus'},
      {sc: '↓', ef: 'choisir l’élément au-dessous'}
    ]
  },
  {
    contextName: "édition des éléments",
    description: "Création, modification, suppression…",
    shortcuts: [
      {sc: 'n', ef: 'Création de l’élément au-dessus du sélectionné'},
      {sc: '⌥ + n', ef: 'Création de l’élément en dessous du sélectionné'},
      {sc: '↩︎', ef: 'Édition de l’élément sélectionné'},
      {mode: 'ÉDITION', sc: '⇥', ef: 'Passer en revue les propriétés'},
      {mode: 'ÉDITION', sc: '↩︎', ef: 'Enregitrer les changements'},
      {mode: 'ÉDITION', sc: '␛', ef: 'Annuler les modifications'},
    ]
  }
]

window.APP_UI_MODES = {
  projects: [
    ['↑ ↓', 'choisir'],
    ['⏎', 'renommer'],
    ['n', 'nouveau projet'],
    ['⌥n', 'nouveau projet sous le projet courant'],
    ['⌘↑ ⌘↓', 'déplacer'],
    ['⌦', 'supprimer'],
    ['→', 'ouvrir']
  ],
  listerRoot: [
    ['↑ ↓', 'choisir'],
    ['⏎', 'éditer'],
    ['n', 'nouveau'],
    ['⌥n', 'nouveau sous le courant'],
    ['⌘c', 'copier'],
    ['⌘x', 'couper'],
    ['⌘v', 'coller avant'],
    ['⌦', 'supprimer'],
    ['←', 'parent'],
    ['→', 'éléments'],
    ['/', 'filtrer'],
    ['␣', 'cocher']
  ],
  "eventsRoot explaination": "Seulement pour les items de type event (pas project)",
  eventsRoot: [
    ['b', 'brins'],
    ['p', 'personnages'],
    ['o', 'options']
  ],
  itemEditing: [
    ['⇥', 'propriété suivante'],
    ['⏎', 'enregistrer'],
    ['␛', 'annuler']
  ],
  modalPanel: [
    ['⌘⏎', 'fermer']
  ]
}

window.APP_CONFIG = {
  brinTypes: [
    'intrigue principale',
    'intrigue amoureuse',
    'intrigue',
    'personnage',
    'relation',
    'thème',
    'accessoire',
    'autre'
  ],
  brinColors: [
    '#d9c8a9', '#c8d9a9', '#a9d9c8', '#a9c8d9',
    '#c8a9d9', '#d9a9c8', '#d9b0a9', '#d9d1a9',
    '#b0d9a9', '#a9d1d9', '#b0a9d9', '#d9a9b0'
  ]
}
