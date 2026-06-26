import { WORD_FORMS } from './constants.js'

export const HELP_PER_CONTEXT = {

  /*-générique : fenêtre divisée -*/
  'double-panneu': {
    title: "Double panneau",
    shortcuts: [
      {sc: '⇧ + ⇥', ef: 'Changer la fenêtre active'}
    ]
  },

  /*- générique : navigation dans une liste d'items -*/
  'navigate-items': {
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

  /*- générique: Tab Cycle-*/
  'tab-cycle': {
    shortcuts: [
      {sc: '⇥', ef: '`&lt;{wf.thing}> ⇥ bouton ⇥ bouton… ⇥ &lt;{wf.thing}>`'},
      {sc: '↓', ef: '{wf.Thing} suivant'},
      {sc: '↑', ef: '{wf.Thing} précédent'}
    ]
  },

  /*- générique : édition d'un item quelconque -*/
  'item-edition': {
    title: "Édition {wf.of}{wf.thing}",
    shortcuts: [
      {sc: '⇥',   ef: "Champ suivant {fields_order}",       key: 'Tab'},
      {sc: '↩︎',   ef: "Enregistrer {wf.the}{wf.thing}",     key: 'Enter'},
      {sc: '␛',   ef: "Annuler l'édition",                    key: 'Escape'},
      {sc: '⌘ + i', ef: "Sélection en italique",  key: 'i', metaKey: true},
      {sc: '⌘ + g', ef: "Sélection en gras",      key: 'g', metaKey: true},
      {sc: '⌘ + b', ef: "Sélection barrée",       key: 'b', metaKey: true},
      {sc: '⌘ + u', ef: "Sélection soulignée",    key: 'u', metaKey: true},
      {sc: '⌘ + k', ef: "Insérer le lien…",       key: 'k', metaKey: true},
    ]
  },

  /*-- CONTEXTE : Liste des projets --*/
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
      {sc: 't', ef: 'Choisir le type du projet', key: 't'},
      {context: 'item-edition'}
    ]
  },

  'event-list': {
    title: "Évènemencier",
    wf: WORD_FORMS.Event,
    shortcuts: [
      {sc: 't', ef: 'Type de l’évènemencier…', key: 't'},
      {context: 'navigate-items'},
      {context: 'with-selected'},
      {context: 'event-selected'},
      {sc: '→',   ef: 'Évènemencier de l’event',          key: 'ArrowRight'},
      {sc: '←',   ef: "Retour à la liste de projets",     key: 'ArrowLeft'}
    ]
  },

  'event-selected':{
    title: null,
    shortcuts: [
      {sc: 'b',   ef: "Choisir ses brins",                key: 'b'},
      {sc: 'p',   ef: "Choisir ses personnages",          key: 'p'},
      {sc: 's',   ef: "Choisir ses styles",               key: 's'}
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
      {context: 'brin-selected'},
      {context: 'with-checkeds'}
    ]
  },

  'brin-selected':{
    title: null,
    shortcuts: [
      {sc: 'p',   ef: "Choisir ses personnages",          key: 'p'}
    ]
  },

  'brin-edition': {
    fields_order: 'titre → type → titre',
    title: "Édition du brin",
    wf: WORD_FORMS.Brin,
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
      {context: 'navigate-items'},
      {sc: '␣', ef: 'Cocher/décocher le style', key: 'Space'},
      {sc: '↩︎', ef: 'Cocher/décocher le style', key: 'Enter'},
      {sc: '␛', ef: 'Annuler l’édition', key: 'Escape'},
      {sc: '⌘ + ↩︎', ef: 'Enregistrer et finir', key: 'Enter', metaKey: true}
    ]
  },

  'tool-panel': {
    title: "Panneau des outils",
    wf: {thing: 'outil', Thing: 'Outil'},
    shortcuts: [
      {context: 'tab-cycle'},
      {sc: '↩︎', ef: 'Exécuter l’outil ou le bouton sélectionné'},
      {sc: '[a..z]', ef: 'Exécuter l’outil en regard de la lettre'}
    ]
  }

}
