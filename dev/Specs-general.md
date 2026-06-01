# Eventer3

[TOC]

---

## But

Le but premier d’Eventer est de permettre à l’autrice ou l’auteur, la ou le scénariste, de développer en toute agilité **la structure de son histoire** et de mettre cette structure au cœur même de son processus d’écriture.

Elle ou il peut s’en servir uniquement pour construire l’histoire, donc définir la structure seulement ou alors s’en servir complètement jusqu’au texte final, roman ou scénario, ou tout autre document intermédiaire comme le synopsis complet.

---

## Philosophie

- outil local
- aucune complexité inutile (=> cf. « tout basé sur `Lister`  et `Item`)
- interface silencieuse
- priorité absolue à la fluidité
- zéro sensation « base de données »
- développement en TDD
- entièrement pilotable au clavier, zéro souris

---

## Spécifications

* Application ruby Sinatra (cf. app.rb)
* l’enregistrement est automatique, transparent
* tout clavier, rien à la souris
* sauvegarde en JSON
* identifiants les plus courts possible
* produire du code verbeux (comme le mode verbose, `--verbose`, des commandes unix) pour pouvoir suivre le message. Mais désactivable facilement.



---

## Architecture générale

```text
Eventer2/
│
├── app.rb
│
├── data/ (les données)
│	 	│	
│   ├── projects.json
│   └── projects/ (liste des Items Project)
│
├── public/
│   ├── app.js
│   ├── config.js
│		├── classes/
│		│		(les classes utiles)
│		│		├── App.js
│		│		├── etc.
│		│		├── Texte.js  (gestion des textes)
│		│
│   ├── index.html
│   v── style.css
│
├── tests/ (tout, vraiment tout ce qui concerne les tests)
│
└── exports/ (servira pour les exportations)
```



---

# Tests

## Infrastructure Playwright

**Tous les tests Playwright doivent importer :**

~~~js
# Régler "../.." en fonction de la profondeur
import { test, expect } from '../../e2e/__setup__.js'
~~~

et jamais directement depuis '@playwright/test'.

Le fichier __setup__.js centralise :
- remontée console navigateur
- hooks globaux
- instrumentation Playwright
- futures extensions runtime de test

---



# Backend

Le backend est minimal, il sert principalement à enregistrer les informations transmises par le front.

IL gère également tout ce qui relève de l’export, c’est-à-dire de la (re)construction des évènemenciers et des document finaux (manuscrit et scénario).


---

# Frontend

Ruby + Sinatra.

Responsabilités :

- servir l’interface
- charger/sauvegarder les évènements/projets
- exporter
- ouvrir des fichiers externes (chaque évènement/projet peut avoir son fichier)

Aucune logique métier compliquée.

---

## Modèles

Voir le fichier [Specs](Specs-modeles.md).

---

## Interface

### Structure

- colonne centrale unique
- une ligne = un évènement/un projet
  - à gauche : son intitulé 
  - à droite : badges des brins, badges des personnages, état

- édition directe
- déplacement immédiat
- filtres escamotables

---

### Panneaux (panel.js)

Le premier panneau quand on lance l’application est le **panneau des projets**.

Ensuite, une fois le projet choisi, le panneau des évènements (appartenant au *Lister* courant) est toujours affiché. Les panneaux des brins et des personnages s’affichent au besoin, en modal, au-dessus de lui).

Tous ces panneaux, quels qu’ils soient, sont des `Lister`s et fonctionnent donc de la même façon. Cf. les [Interactions](#interactions).

### Autres panneaux

D’autres panneaux ponctuels permettent de régler les options ou les valeurs particulières des diffférents éléments.

---

<a name="interactions"></a>

# Interactions

Comme défini tout en haut, l’application est 100 % pilotable au clavier (jusqu’au placement de la fenêtre, si possible).

D’après ChatGPT, le mieux pour ça est de centraliser les traitements dans un `KeyboardManager`.



---

## Clavier

Note : Ci-dessous, lorsqu’on parle d’*élément*, on parle évidemment d’objet qui héritent de *Item* (`Project`, `Event`, `Brin`, etc.)

| Action | Raccourci |
|---|---|
| Nouveau Project/Event/Brin/Character suivant panneau | n |
| Choisir l’élément avant ou après | ↑↓ |
| Déplacer l’élément | ⌘ ↑↓ |
| Filtrer (par le panneau des brins + divers) | / |
| Choisir les brins (=> afficher panneau modal) | b |
| Choisir les personnages (=> afficher panneau modal) | p |
| Mise en édition de l’élément (principalement `title` + autres fonctions en fonction du type de l’élément) | ↩︎ |
| Déplacement de propriété en propriété lorsque l’élément est en édition. | ⇥ |
| Fin de l’édition de l’élément (enregistrement) | ↩︎ |
| Fermeture du panneau (seulement pour Brins et Characters) | ⌘ ↩︎ |
| Annulation de l’édition de l’élément. | ␛ |
| « Entrer » dans le projet ou le « Lister » de l’Item courant | → |
| Revenir à l’Item parent. | ← |
| Suppression de l’item sélectionné | `Delete` |
| Suppression des items cochés (et pas le sélectionné s’il n’est pas coché) | `Shift`+`Delete` |
| Copie de l’item sélectionné (toutes ses propriétés sauf l’identifiant) | ⌘ `c` |
| Couper l’item sélectionné (toutes ses propriétés même l’identifiant) | ⌘ `x` |
| Coller l’item ou les items copiés/collés à la place de l’item sélectionné. | ⌘ `v` |

---

## Filtres

Le filtre principal est le **filtrage de la liste des évènements par brin**. 

> Il y aura à l’avenir d’autres façons de filtrer, par personnages, par texte, par nature ou type, etc. Mais pour le moment, on se limite aux brins, l’utilisation la plus classique.

Donc, quand on joue la touche « / », ça ouvre le panneau des brins (ça les décoche tous, donc ça fait disparaitre tous les évènements dessous) et on se déplace + Space pour choisir les brins. Au fur et à mesure, les évènements réapparaissent.

---

# Style visuel

## Principes

- très peu de chrome
- peu de couleurs
- typographie dominante
- densité faible
- animations discrètes
- fond neutre
- pas d’effets “application moderne”

---

# Technique front

- HTML
- CSS
- JavaScript vanilla

Le DOM suffit largement.

---

# Sauvegarde

- sauvegarde automatique discrète
- un seul fichier JSON
- export possible

