




export const MANUSCRIT_WIDTH = 680 // largeur texte en mode manuscrit/roman (px)

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
