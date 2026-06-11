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

export const WORD_FORMS = {
  Event: { e:'', elle:'eau', thing: 'évènement', THING: 'ÉVÈNEMENT', Thing: 'Évènement', things: 'évènements', THINGS: 'ÉVÈNEMENTS', Things: 'Évènements', the: 'l’', THE: 'L’', The: 'L’', of: 'de l’', Le: 'Le', le: 'le' /* "Le supprimer"*/ },
  Project: { e:'', elle:'eau', thing: 'projet', THING: 'PROJET', Thing: 'Projet', things: 'projets', THINGS: 'PROJETS', Things: 'Projets', the: 'le ', THE: 'LE ', The: 'Le ', of: 'du ', Le: 'Le', le: 'le'/* pronom */},
  Brin: { e: '', elle:'eau', thing: 'brin', THING: 'BRIN', Thing: 'Brin', things: 'brins', THINGS: 'BRINS', Things: 'Brins', the: 'le ', THE: 'LE ', The: 'Le ', of: 'du ' , Le: 'Le', le: 'le'},
  Perso: { e: '', elle:'eau', thing: 'personnage', THING: 'PERSONNAGE', Thing: 'Personnage', things: 'personnages', THINGS: 'PERSONNAGES', Things: 'Personnages', the: 'le ', THE: 'LE ', The: 'Le ', of: 'du ', Le: 'Le', le: 'le' },
  Style: { e:'', elle:'eau', thing: 'style', THING: 'STYLE', Thing: 'Style', things: 'styles', THINGS: 'STYLES', Things: 'Styles', the: 'le ', THE: 'LE ', The: 'Le ', of: 'du ', Le: 'Le', le: 'le' }
}
  
/**
 * Aide contextuelle : raccourcis par contexte exact.
 * Chaque shortcut a : sc (symbole affiché), ef (effet), key (KeyboardEvent.key),
 * et optionnellement metaKey/shiftKey/altKey.
 * 
 * ContextualHelp.resetContext('contexte') => reset complètement la pile des contextes
 * ContextualHelp.setContext('contexte') => emplile (ajoute) le contexte provisoire
 * ContextualHelp.restoreContext() => dépile, donc revient au contexte précédent.
 * g
 */
export const HELP_PER_CONTEXT = {

  /*- générique : navigation dans une liste d'items -*/
  'navigate-items': {
    // title: "Navigation par item",
    shortcuts: [
      {sc: '↑',       ef: "{wf.Thing} précédent",             key: 'ArrowUp'},
      {sc: '↓',       ef: "{wf.Thing} suivant",               key: 'ArrowDown'},
      {sc: '⌘ + ↑',   ef: "Monter {wf.the}{wf.thing}",        key: 'ArrowUp',   metaKey: true},
      {sc: '⌘ + ↓',   ef: "Descendre {wf.the}{wf.thing}",     key: 'ArrowDown', metaKey: true},
    ]
  },

  /*- générique: Ce qu'on peut faire de la sélection -*/
  'with-selected':{
    title: '{wf.Thing} sélectionné{wf.e}',
    shortcuts: [
      {sc: 'n',     ef: "Nouv{wf.elle} {wf.thing}",               key: 'n'},
      {sc: '⌥ + n', ef: "Nouv{wf.elle} {wf.thing} avant", key: 'n', altkey: true},
      {sc: '↩︎',     ef: 'L’éditer',      key: 'Enter'},
      {sc: '␣',     ef: "{wf.Le} Cocher/décocher",      key: 'Space'},
      {sc: '⌦',     ef: "{wf.Le} Supprimer",            key: 'Delete'},
      {sc: '⌘ + c', ef: "{wf.Le} Copier",               key: 'c', metakey: true},
      {sc: '⌘ + x', ef: "{wf.Le} Couper",               key: 'x', metakey: true},
    ]
  },

  /*- générique: Propre aux éléments cochés -*/
  'with-checkeds': {
    title: "{wf.Things} coché{wf.e}s",
    shortcuts: [
      {sc: '⇧⌘ + c', ef: "Les copier", key: 'c', metakey: true},
      {sc: '⇧⌘ + x', ef: "Les couper", key: 'x', metakey: true},

    ]
  },

  /*- générique : édition d'un item quelconque -*/
  'item-edition': {
    title: "Édition {wf.of}{wf.thing}",
    shortcuts: [
      {sc: '⇥',   ef: "Champ suivant {fields_order}",       key: 'Tab'},
      {sc: '↩︎',   ef: "Enregistrer {wf.the}{wf.thing}",     key: 'Enter'},
      {sc: '␛',   ef: "Annuler l’édition",                    key: 'Escape'},
      {sc: '⌘ + i', ef: "Sélection en italique",  key: 'i', metaKey: true},
      {sc: '⌘ + g', ef: "Sélection en gras",      key: 'g', metaKey: true},
      {sc: '⌘ + b', ef: "Sélection barrée",       key: 'b', metaKey: true},
      {sc: '⌘ + u', ef: "Sélection soulignée",    key: 'u', metaKey: true},
      {sc: '⌘ + k', ef: "Insérer le lien…",       key: 'k', metaKey: true},
    ]
  },

  /*-- CONTEXTE : Liste des projets affiché --*/
  'project-list': {
    title: "Liste des projets",
    wf: WORD_FORMS.Project,
    shortcuts: [
      {context: 'navigate-items'},
      {sc: '→',   ef: "Entrer dans le projet",            key: 'ArrowRight'},
      {context: 'with-selected', except: ['␣']}
    ]
  },
  
  'project-edition': {
    title: "Édition du projet",
    fields_order: 'titre → état → titre',
    wf: WORD_FORMS.Project,
    shortcuts: [
      {context: 'item-edition'}
    ]
  },

  'event-list': {
    title: "Évènementier",
    wf: WORD_FORMS.Event,
    shortcuts: [
      {context: 'navigate-items'},
      {context: 'with-selected'},
      {sc: '→',   ef: 'Évènemencier de l’event',          key: 'ArrowRight'},
      {sc: '←',   ef: "Retour à la liste de projets",     key: 'ArrowLeft'},
      {sc: 'b',   ef: "Choisir les brins",                key: 'b'},
      {sc: 'p',   ef: "Choisir les personnages",          key: 'p'}
    ]
  },

  'event-edition': {
    title: "Édition d'un évènement",
    wf: WORD_FORMS.Event,
    fields_order: 'titre → état → météo → effet → titre',
    shortcuts: [
      {context: 'item-edition'}
    ]
  },

  'brin-list': {
    title: "Liste des brins",
    wf: WORD_FORMS.Brin,
    shortcuts: [
      {sc: 'p',  ef: "Panneau personnages",  key: 'p'},
      {context: 'navigate-items'},
      {context: 'with-selected'},
      {context: 'with-checkeds'}
    ]
  },
  
  'brin-edition': {
    fields_order: 'titre → type → titre',
    title: "Édition du brin",
    wf:WORD_FORMS.Brin,
    shortcuts: [
      {context: 'item-edition'}
    ]

  },

  'perso-list': {
    title: "Liste des personnages",
    wf: WORD_FORMS.Perso,
    shortcuts: [
      {context: 'navigate-items'},
      {context: 'with-selected'},
      {context: 'with-checkeds'}
    ]
  },

  'perso-edition': {
    wf: WORD_FORMS.Perso,
    fields_order: 'pseudo → patronyme → badge → avatar → fonction → pseudo',
    shortcuts: [
      {context: 'item-edition'}
    ]
  },

  'style-list': {
    wf: WORD_FORMS.Style,
    title: "Styles d'affichage",
    shortcuts: [
      {context: 'navigate-items'}
    ]
  },

}

//###################################################################

export const SHORTCUTS = [
  {
    contextName: "Liste d'éléments",
    description: "Liste de projets, d'event, de brins…",
    shortcuts: [
      {sc: '↑', ef: "sélectionner l'élément au-dessus"},
      {sc: '↓', ef: "sélectionner l'élément au-dessous"},
      {sc: '⌘ + ↑', ef: "Monter l'élément sélectionné"},
      {sc: '⌘ + ↓', ef: "Descendre l'élément sélectionné"},
      {sc: '␣', ef: "cocher/décocher l'élément sélectionné"}
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
      {sc: '⌘ + c', ef: "Copier l'élément sélectionné"},
      {sc: '⌘ + x', ef: "Couper l'élément sélectionné"},
      {sc: '⌘ + v', ef: "Coller les éléments sélectionnés"},
      {sc: '⇧ + ⌘ + c', ef: 'Copier les éléments cochés'},
      {sc: '⇧ + ⌘ + x', ef: "Couper les éléments sélectionnés"},
      {sc: '⌦', ef: "Supprimer l'élément sélectionné"},
      {sc: '⇧ + ⌦', ef: 'Supprimer les éléments cochés'},
    ]
  },
  {
    contextName: "édition des éléments",
    description: "Création, modification, suppression…",
    shortcuts: [
      {sc: 'n', ef: "Création de l'élément au-dessus du sélectionné"},
      {sc: '⌥ + n', ef: "Création de l'élément en dessous du sélectionné"},
      {sc: '↩︎', ef: "Édition de l'élément sélectionné"},
      {mode: 'ÉDITION', sc: '⇥', ef: 'Passer en revue les propriétés'},
      {mode: 'ÉDITION', sc: '↩︎', ef: 'Enregistrer les changements'},
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
