# Eventer3

[TOC]

---

## But

Le but premier d’Eventer est de permettre à l’autrice ou l’auteur, la ou le scénariste, de développer en toute agilité **la structure de son histoire** et de mettre cette structure au cœur même de son processus d’écriture.

Deux façons (au moins) de se servir de l’application : 1) on peut s’en servir uniquement pour construire l’histoire, donc définir la structure seulement ou 2) s’en servir d’un bout à l’autre, de la définition des actes jusqu’au texte final, roman ou scénario, ou tout autre document intermédiaire comme le synopsis complet.

---

## Philosophie

- outil local (pour le moment)
- entièrement pilotable au clavier, zéro souris
- interface silencieuse
- priorité absolue à la fluidité
- zéro sensation « base de données »
- développement en TDD
- aucune complexité inutile (=> cf. « tout basé sur `Lister`  et `Item`)

---

## Spécifications

* Application ruby Sinatra (cf. app.rb)
* l’enregistrement est automatique, transparent
* tout clavier, rien à la souris
* ~~sauvegarde en JSON~~. SQLite maintenant.
  * une base par projet (un fichier `eventer.db`)
  * un main-db pour maintenir les références aux projets

* produire du code verbeux (comme le mode verbose, `--verbose`, des commandes unix) pour pouvoir suivre le message. Mais désactivable facilement. Cf. `LOG` en backend (ruby) et en frontend (JavaScript).



---

## Architecture générale

```text
Eventer2/
│
├── app.rb
│
├── data/ (les données)
│	 	│	
│   └── main.db
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
│   └── style.css
│
├── tests/ (tout, vraiment tout ce qui concerne les tests)
│
└── exports/ (servira pour les exportations)

Projet A
└── eventer.db
Projet B
└── eventer.db
...
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

Ce sont principalement `ProjectLister` (liste des projets), `EventLister` (liste des évènements = évènemencier, `BrinLister` (liste des brins brin = intrigue par exemple), `PersoLister` (liste des personnages) qui héritent tous de `Lister` (gestionnaire de listes). Un `Lister` gère une liste ordonnée d’`Item`s

Et `Project` (projet), `Event` (évènement), `Brin` (brin ~= intrigue), `Perso` (personnage) qui héritent tous de `Item`.

Voir le fichier [Specs](Specs-modeles.md) pour le détail.

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

Ensuite, une fois le projet choisi, un panneau des évènements (appartenant au *Lister* courant) est toujours affiché (il peut y en avoir une infinité, par imbrication, mais un seul affiché dans ce mode normal — ensuite, d’autres panneaux pourront afficher aussi des listes d’events). Les panneaux des brins et des personnages s’affichent au besoin, en modal, au-dessus de lui).

Tous ces panneaux, quels qu’ils soient, sont des `Lister`s et fonctionnent donc de la même façon. Cf. les [Interactions](#interactions).

### Autres panneaux

D’autres panneaux ponctuels permettent de régler les options ou les valeurs particulières des diffférents éléments. Par exemple le panneau des données de l’event, qui permet de régler sa météo, son effet et son lieu/décor (si on l’enregistre un jour).

---

<a name="interactions"></a>

# Interactions

Cf. [Spécifications Keyboard](Specs-Keyboard.md).

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

# Application

## Options

Cf. [options](Options.md).
