# Eventer3 - Keyboard

[TOC]

Comme défini dans les spécifications générales, l’application est 100 % pilotable au clavier (jusqu’au placement de la fenêtre elle-même, si possible). Dès qu’on pense une fonctionnalité, on doit lui attribuer un raccourci.

~~Les traitements sont centralisés dans `KeyboardManager`.~~ Chaque élément a la propre responsabilité de ses combinaisons (traitement POO).

---

## Liste complète des raccourcis

*(cette liste doit être absolument tenue à jour et présenter tous les raccourcis et leurs attachements)*



| Combinaison                     | Responsabilité      | Description                                                  |
| ------------------------------- | ------------------- | ------------------------------------------------------------ |
| ` ⌥` + 0/1/2/3                  | `App`               | Splits de fenêtre.                                           |
| `⌘` + `→`/`←`                   | `App`               | Passer de fenêtre en fenêtre (en mode Split de fenêtre).     |
| `⌃ + ⇧` <br />+ `→`/`↓`/`←`/`↑` | `KeyboardablePanel` | Tous les panneaux doivent en hériter.                        |
|                                 | `KeyboardablePanel` | Cycle Tab (item ⇥ bouton 1 ⇥ bouton 2 ⇥ bouton N ⇥ item ⇥ etc. |

​			

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
