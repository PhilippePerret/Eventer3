# Eventer3

[TOC]

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
* tout clavier, (presque) rien à la souris
* sauvegarde en JSON
* identifiants les plus courts possible
* produire du code verbeux (comme le mode verbose, `--verbose`, des commandes unix) pour pouvoir suivre le message. Mais désactivable facilement.



---

## Architecture

**ATTENTION, CETTE ARCHITECTURE N’EST PAS À PRENDRE AU PIED DE LA LETTRE, ELLE EST PUREMENT INDICATIVE ET NE TIENT PAS COMPTE DES DERNIÈRES AVANCÉES.**

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
│		│		├── models/
│		│		├── views/
│		│		├── controllers/
│		│		├── repositories/
│		│		├── EditableText.js  (???)
│		│		├── Texte.js  (gestion des textes)
│		│
│   ├── index.html
│   └── style.css
│
├── tests/
│
└── exports/
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

Ensuite, une fois le projet choisi, le panneau des évènements (*Lister* courant) est toujours affiché. Les panneaux des brins et des personnages s’affichent au besoin, en modal, au-dessus de lui).

Tous ces panneaux, quels qu’ils soient, sont des `Lister`s et fonctionnent donc de la même façon. Cf. les [Interactions](#interactions).

---

# Ligne évènement

Contient :

- texte (`Event.text`)
- badges de brins (`Brin.badge`)
- avatar ou lettres de personnages (`Perso.avatar` ou `Perso.badge`)
- durée si définie (`Event.duration`)

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
| Déplacement de propriété en propriété lorsque l’élément est en mode édition. | ⇥ |
| Fin de l’édition de l’élément (enregistrement) | ↩︎ |
| Fermeture du panneau (seulement pour Brins et Characters) | ⌘ ↩︎ |
| Annulation de l’édition de l’élément. | ␛ |

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

