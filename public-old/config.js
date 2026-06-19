window.APP_UI_MODES = {
  projects: [
    ['↑ ↓', 'choisir'],
    ['⏎', 'renommer'],
    ['n', 'nouveau projet après'],
    ['⌥n', 'nouveau projet avant'],
    ['⌘↑ ⌘↓', 'déplacer'],
    ['⌦', 'supprimer'],
    ['→', 'ouvrir']
  ],
  listerRoot: [
    ['↑ ↓', 'choisir'],
    ['⏎', 'éditer'],
    ['n', 'nouveau après'],
    ['⌥n', 'nouveau avant'],
    ['⌘c', 'copier'],
    ['⌘x', 'couper'],
    ['⌘v', 'coller avant'],
    ['⌦', 'supprimer'],
    ['←', 'parent'],
    ['→', 'éléments'],
    ['⌘:', 'filtrer'],
    ['␣', 'cocher']
  ],
  "eventsRoot explaination": "Seulement pour les items de type event (pas project)",
  eventsRoot: [
    ['b', 'brins'],
    ['p', 'personnages'],
    ['s', 'styles'],
    ['o', 'options']
  ],
  itemEditing: [
    ['⇥', 'propriété suivante'],
    ['⏎', 'enregistrer'],
    ['␛', 'annuler']
  ],
  stylePanel: [
    ['↑ ↓', 'choisir'],
    ['␣', 'cocher / décocher'],
    ['⌘↓ ⌘↑', 'déplacer (le dernier style l\'emporte)']
  ],
  modalPanel: [
    ['⌘⏎', 'fermer'],
    ['⌥↓ ⌥↑', 'Event suivant/précédent']
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
