# Eventer3 - Keyboard

[TOC]

Comme défini dans les spécifications générales, l’application est 100 % pilotable au clavier (jusqu’au placement de la fenêtre elle-même, si possible). Dès qu’on pense une fonctionnalité, on doit lui attribuer un raccourci.

Les traitements sont centralisés dans `KeyboardManager`.



Note : Ci-dessous, lorsqu’on parle d’*élément* (`Item`), on parle évidemment d’objet qui héritent de *Item* (donc de `Project`, `Event`, `Brin`, `Perso`).

| Action                                                       | Raccourci |
| ------------------------------------------------------------ | --------- |
| Nouvel élément quelconque *au-dessus de sélectionné*         | n         |
| Nouvel élément quelconque au-dessous de séletionné           | ⌥+n       |
| Choisir l’élément avant ou après                             | ↑ / ↓     |
| Déplacer l’élément vers le haut                              | ⌘+↑       |
| Déplacer l’élément vers le bas                               | ⌘+↓       |
| Activation du filtre (cf. [Filtrage](Specs-Filtre.md)).      | /         |
| Mise en édition de l’élément (principalement `title` + autres fonctions en fonction du type de l’élément) | ↩︎         |
| Déplacement de propriété en propriété lorsque l’élément est en édition. | ⇥         |
| Définir les styles de l’item                                 | s         |
| Définir les styles (cette combinaison ouvre la fenêtre pour définir les styles. | ⌘+s       |
| Fin de l’édition de l’élément (enregistrement)               | ↩︎         |
| Annulation de l’édition de l’élément.                        | ␛         |
| Suppression de l’item sélectionné (même s’il y a des cochés et sauf si ce n’est pas le dernier) | ⌦         |
| Suppression des items cochés (et pas le sélectionné s’il n’est pas coché) après confirmation. | ⇧+ ⌦      |
| Copie de l’item sélectionné (toutes ses propriétés sauf l’identifiant) | ⌘ `c`     |
| Copier tous les items cochés et seulement les cochés.        | ⇧+⌘+ `c`  |
| Couper l’item sélectionné (toutes ses propriétés même l’identifiant) | ⌘ `x`     |
| Couper les items cochés (et seulement les items cochés.      | ⇧+⌘+ `x`  |
| Coller l’item ou les items copiés/collés à la place de l’item sélectionné. | ⌘ `v`     |
| Coller les items copiés/coupés SOUS l’item sélectionné.      | ⌘+⌥+`v`   |
| Basculer du mode d’affichage « par imbrication » au mode « par niveau » | ⌘+m       |

Combinaisons propres à certains panneaux

## Les Listers

### ProjectLister (Liste unique des projets)

| Action                                          | Raccourci |
| ----------------------------------------------- | --------- |
| « Entrer » dans le projet (premier évènemencier | →         |



### EventLister (évènemenciers)

| Action                                                       | Raccourci |
| ------------------------------------------------------------ | --------- |
| Choisir les brins (=> afficher panneau modal)                | `b`       |
| Choisir les personnages (=> panneau modal)                   | `p`       |
| « Entrer » dans l’évènemencier de l’event courant            | →         |
| Revenir à la liste des projets (si 1<exp>er</exp> évènemencier) ou à l’évènemencier parent. | ←         |

### BrinLister (panneau des brins)

| Action                                                       | raccourci |
| ------------------------------------------------------------ | --------- |
| Choisir les personnages du brin (=> panneau modal des personnages) | `p`       |
| Fermeture du panneau des brins.                              | ⌘ ↩︎       |

### PersoLister (panneau des personnages)

| Action                                | Raccourci |
| ------------------------------------- | --------- |
| Fermeture du panneau des personnages. | ⌘ ↩︎       |

---

## Aide contextuelle

Dans les premières versions de l’application, une aide contextuelle était affichée dans le footer, appelée « aide footer ». Cette aide a été abandonnée au profit de l’**aide contextuelle** qui s’affiche dès qu’on joue la combinaison « ⌘ ? » (donc ⇧+⌘+,). 

> Cette combinaison permet d’afficher l’aide contextuelle dans tous les contextes, même l’édition des éléments.

Comme son nom l’indique, en fonction du context, le panneau de cette aide fournit les renseignements utiles et efficients.

Ces contextes sont définis très précisément dans la donnée `HELP_PER_CONTEXT` dans le fichier `public/constants.js`.
