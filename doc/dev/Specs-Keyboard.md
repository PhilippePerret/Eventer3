# Eventer3 - Keyboard

[TOC]

Comme défini dans les spécifications générales, l’application est 100 % pilotable au clavier (jusqu’au placement de la fenêtre elle-même, si possible). Dès qu’on pense une fonctionnalité, on doit lui attribuer un raccourci.

~~Les traitements sont centralisés dans `KeyboardManager`.~~ Chaque élément a la propre responsabilité de ses combinaisons (traitement POO).

---

## Liste complète des raccourcis

*(cette liste doit être absolument tenue à jour et présenter tous les raccourcis et leurs attachements)*



| Combinaison                                              | Responsabilité                                     | Description                                                  |
| -------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------ |
| `q`                                                      | `App`                                              | Ouvre le panneau des constantes pour les définir.            |
| `⌘ + c`                                                  | `Item`                                             | Copier l’Item sélectionné.                                   |
| `⇧ + ⌘ + c`                                              | `Lister`                                           | Copier TOUS les items cochés                                 |
| `⌘ + x`                                                  | `Item` (`Lister`?)                                 | Couper l’Item sélectionné.                                   |
| `⇧ + ⌘ + x`                                              | `Lister`                                           | Couper TOUS les items cochés                                 |
| `⌘ + v`                                                  | `Lister`                                           | Coller l’Item ou les Items du presse-papier.                 |
| `⌦`                                                      | `Item` > `Lister`                                  | Détruit l’Item, propagé à `Lister` pour actualiser sa liste. Après confirmation en redonnant le nombre de destructions. |
| `⇧ + ⌦`                                                  | `Lister`                                           | Détruire TOUS les items cochés (après confirmation)          |
|                                                          |                                                    | **AIDE CONTEXTUELLE**                                        |
| `⌘ + ⇧ + ?`                                              | `Item`                                             | Aide contextuelle concernant l’item sélectionné, suivant sa classe. |
|                                                          | `Lister`                                           | Aide contextuelle pour la liste courante (mais normalement il y a toujours un item sélectionné) |
|                                                          | `App`                                              | Aide suivant le contexte transmis explicitement à l’application. |
| ` ⌥` + 0/1/2/3                                           | `App`                                              | Splits de fenêtre.                                           |
| `⌘` + `→`/`←`                                            | `App`                                              | Passer de fenêtre en fenêtre (en mode Split de fenêtre).     |
| `⌘ + ↩︎`                                                  | `BrinLister`<br />`PersoLister`<br />`StyleLister` | Ferme le panneau en enregistrant les choix (de brins, de personnages, de styles, etc.). |
| `⌃ + ⇧` <br />+ `→`/`↓`/`←`/`↑`                          | `KeyboardablePanel`                                | Tous les panneaux doivent en hériter.                        |
| (`⇧` + )`⇥`                                              | `Item` (affichage)                                 | Se déplacer de lien-cible en lien-cible                      |
|                                                          | `Item` (édition)                                   | Se déplacer de widget propriété (select…) en widget propriété |
|                                                          | `KeyboardablePanel`                                | Cycle Tab (item ⇥ bouton 1 ⇥ bouton 2 ⇥ bouton N ⇥ item ⇥ etc. |
|                                                          | `FilterBar`                                        | Cycle entre les propriétés du filtre actif, suivant le type du Lister (évènemencier, panneau des brins, des personnages, des styles…). |
| `n`                                                      | `Lister`                                           | Crée un nouvel élément après le courant.<br />*Note : Le Lister se sert de l’originalTarget pour connaitre l’item courant, si néssaire* |
| `⌥ + n`                                                  | `Lister`                                           | Idem que « n » seul, mais crée le nouvel item *avant* l’item courant. |
| `↩︎`                                                      | `Item` (display)                                   | Passe en édition.                                            |
|                                                          | `Item` (édition)                                   | Sort de l’édition en enregistrant les valeurs.               |
| `␛`                                                      | `Item` (édition)                                   | Sort de l’édition en annulant les changements.               |
| `␣`                                                      | `Item` (display)                                   | Coche/décoche l’élément                                      |
|                                                          | `Item` (édition title)                             | Insère une espace                                            |
|                                                          | `Item` (édition prop)                              | En fonction de widget (popupSelect ouvre le menu ou sélectionne une valeur quand multi) |
| `b`                                                      | `Event` (display)                                  | Ouvre la panneau des brins (`BrinLister`) pour définir ceux de l’event. |
| `s`                                                      | `Event` (display)                                  | Ouvre le panneau des styles pour choisir ceux de l’event     |
|                                                          | `StyleLister`                                      | Ferme le panneau des styles.                                 |
| `p`                                                      | `Event` (display)                                  | Permet de choisir les personnages de l’event.                |
|                                                          | `Brin` (display)                                   | Permet de choisir les personnages du brin.                   |
|                                                          | `PersoLister`                                      | Ferme le panneau des personnages.                            |
| `⇧ + b`                                                  | `EventLister`                                      | Ouvre le panneau des brins pour choisir les brins à appliquer à TOUS les events cochés. |
| `⇧ + s`                                                  | `EventLister`                                      | Ouvre le panneau des styles pour choisir les styles à appliquer à TOUS les events cochés. |
| `⇧ + p`                                                  | `EventLister`<br />`BrinLister`                    | Ouvre le panneau des personnages pour choisir les personnages à appliquer à TOUS les events cochés. |
|                                                          | `BrinLister`                                       | Ferme le panneau.                                            |
| `k`                                                      | `Item` (display)                                   | Ajoute l’item quelconque aux cibles mémorisées.              |
| `⌘ + k`                                                  | `Item` (édition)                                   | Ouvre le panneau des cibles pour en insérer une dans le title de l’item. (seulement si le title est en édition ?) |
| `⌘ + m`                                                  | `EventLister`                                      | Ouvre le panneau des modes d’affichage pour choisir le mode courant. |
| `o`                                                      | lien-target                                        | Ouvre la panneau d’ouverture de la cible, pour choisir la destination. |
| `g`                                                      | Lien-cible                                         | Afficher dans la même fenêtre, dans on évènemencier, la cible du lien. |
| `c`                                                      | lien-cible                                         | Ouvrir (afficher) la carte de la cible du lien.              |
| `a`                                                      | Lien-cible                                         | Affiche dans une autre fenêtre (ou dans l’autre fenêtre) la cible, dans son évènemencier. |
| `→`                                                      | `Event`                                            | Entre dans le *Lister* de l’event. C’est lui qui connait son Lister enfant. |
| `←`                                                      | `EventLister`                                      | Remonte au Lister parent. C’est le Lister qui connait ce parent, pas l’item sélectionné. |
| `↑` / `↓`                                                | `Lister`                                           | Sélectionne les items suivants/précédents                    |
| `⌥ + ↑`                                                  | `BrinLister`                                       | Sélectionne l’event précédant, sous le panneau.              |
| `⌥ + ↓`                                                  | `BrinLister`                                       | Sélectionner l’évent suivant, sous le panneau.               |
| `⌥ + ↑`                                                  | `PersoLister`                                      | Sélectionne, suivant la situation, le brin ou l’event précédent sous son panneau. |
| `⌥ + ↓`                                                  | `PersoLister`                                      | Sélectionne, suivant la situation, le brin ou l’event suivant sous son panneau. |
| <span style="white-space:nowrap;">`⌘ + ↑`/`⌘ + ↓`</span> | `Lister`                                           | Déplace l’item sélectionné.                                  |
| `t`                                                      | `Project`                                          | Choisir le **type métier du projet** (« roman », « Film », « BD », etc.) |
| `⌘ + t`                                                  | `EventLister`                                      | Ouvre le panneau pour choisir le **type métier du projet et de l’évènemencier** (« manuscrit », « évènemencier »). |
|                                                          | **FILTRE**                                         |                                                              |
| `:`                                                      | `Lister`                                           | Focus sur le `title` de la `filter-bar` du Lister courant (évènemencier, panneau des brins, panneau des personnages. |
|                                                          |                                                    |                                                              |

​			

---

Note : Ci-dessous, lorsqu’on parle d’*élément* (`Item`), on parle évidemment d’objet qui héritent de *Item* (donc de `Project`, `Event`, `Brin`, `Perso`).

| Action                                                       | Raccourci |
| ------------------------------------------------------------ | --------- |
| Nouvel élément quelconque *au-dessus de sélectionné*         | n         |
| Nouvel élément quelconque au-dessous de séletionné           | ⌥+n       |
| Choisir l’élément avant ou après                             | ↑ / ↓     |
| Déplacer l’élément vers le haut                              | ⌘+↑       |
| Déplacer l’élément vers le bas                               | ⌘+↓       |
| Activation du filtre (cf. [Filtrage](Specs-Filtre.md)).      | :         |
| Mise en édition de l’élément (principalement `title` + autres fonctions en fonction du type de l’élément) | ↩︎         |
| Déplacement de propriété en propriété lorsque l’élément est en édition. | ⇥         |
| Choisir les styles de l’item (`Space` pour cocher/décocher)  | s         |
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
