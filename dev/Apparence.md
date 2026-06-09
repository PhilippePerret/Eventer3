# Eventer3 — Apparence

Cette partie concerne l’apparence des évènemenciers et particulièrement des styles qu’on peut leur appliquer avec des classes CSS.

## Principes

* Pour l’affichage, on profite de la capacité de « cascade de styles » des pages HTML. On peut donc enchainer les classes et leur ordre est important.
* La classe finale est consignée dans la nouvelle propriété `css` de l’event (vide par défaut).
* les styles sont définissables « à chaud » (on peut ajouter des fichiers ou modifier les fichiers — vérification par la date de dernière modification).
* par défaut de fichier thème, l’application produit un fichier css `data/theme/default.css` avec le sélecteur des events par défaut (`div.event-body .event-text` etc.)
* Les classes définies s’appliquent toutes aux `div.event-body`. On peut, de cette manière, utiliser les `margin-left`

---

## Panneau de choix du style

Pour le moment, les styles sont consignés dans une ou des feuilles dans le dossier `/data/themes`. Tous les fichiers de ce dossier doivent être chargés, même à chaud.

Une fenêtre présente les styles à choisir, avec leur aspect réel, la même phrase répétée et stylisée pour chaque style.

Comme on a de la place, on va choisir la première solution

## Fonctionnement

1. On sélectionne l’évènement à styliser,
2. on presse « s » pour définir son aspect (ou ⇧+s pour définir le style de tous les events cochés — nouveau comportement qui sera à reproduire pour tous les mode d’éditions, choix des brins, des personnages, etc.)
3. le panneau des styles s’ouvre (avec les styles ordonnés de l’event sélectionné). Chaque style présente son aspect avec une phrase identique. Noter que : 
   1. les styles de l’event doivent être sélectionnés
   2. ils doivent être affichés dans l’ordre exact (order matters, dans ce système.
4. on se déplace de style en style avec ↓/↑
5. on coche/décoche les styles voulus
   1. => Aussitôt, leur aspect dans l’évènemencier change, dans l’ordre exact où ils se trouvent dans la fenêtre (simple application de la classe du style)
6. on définit leur ordre avec ⌘↓↑
   1. => l’ordre est aussitôt répercuté dans la classe de l’event et son aspect change.

---





## Développements ultérieurs

Ultérieurement, on pourra imaginer un combo permettant de définir précisément les styles.