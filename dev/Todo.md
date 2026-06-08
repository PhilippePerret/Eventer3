# Eventer3

CE FICHIER N’EST PAS À LIRE PAR CLAUDE code

## SUPRA TODO

- Vérifier le filtre en live, car pour le moment, si je ne me trompe pas, ça n’est pas encore effectif.

## Bug

## Todo

- Modifier partout le fait que `Item.depth` n’existe plus et que `Lister.depth` prend le relais. La correction a déjà été faite dans dev/Specs-SQLite.md

- En tirer les conséquences :

  - [ ] la propriété doit être définie pour tout Lister enregistré . Le premier, celui des projets, doit avoir le niveau 0 — le premier `Lister` du premier projet doit donc avoir le niveau 1 (depth 1). Ensuite, le Lister de tout Event aura le depth 2.
  - [ ] 

  



* Implémenter les menus « météo » et « effet » pour les events, qu’on doit pouvoir atteindre après l’état. Gérer les incompatibilités qui sont définies dans le fichier constantes.js dans METEO
* Implémenter les différentes mode de vue des évènemencier : 
  * le mode normal par imbrication
  * le mode « par niveau » où tous les évènements d’un même projet et d’un même niveau sont affichés
* Implémenter LE FILTRE (le prochain gros morceau)
* Propriété `flags` pour les `Lister` — première option : le mode d’affichage des fond d’Event, soit par couleur de premier brin, soit par « climat » (météo + effet).
* Définir l’option d’EventListener qui détermine si le fond des events doit être déterminé par son premier Brin ou par son « climat », constitué 1) de sa météo et 2) de son effet. 
* ajouter la propriété `mode` de `Lister` qui permettra de définir si les items sont des projets, des évènements (event normaux ou event script), des brins ou des personnages.
* S’assurer que les propriétés `created_at`/`ca` et `updated_at`/`ua` soient toujours enregisrées (backend)
* Des options générale de l’application
  * `open-with-project-list` : une option détermine si l’application doit s’ouvrir sur la liste des projets ou sur le dernier évènemencier travaillé.
* Console pour commander Eventer de l’intérieur « en ligne de console »
* Rendre la propriété `active` propre à `Project < Item` et à personne d’autre. Les autres, lorsqu’ils sont détruits, le sont vraiment (fichiers si nécessaire et dans les données)
* Ajouter les classes `ScriptLister < Lister` et `ScritptItem < Item` comme classes majeures. Noter qu’un évènemencier entier peut être un Lister, mais qu’on peut aussi se contenter de définir certains `Event`s comme des `ScriptItem`s qui permettront de définir le texte final. Noter aussi qu’il peut y avoir des `ScriptEvent`s intermédiaire pour les synopsis par exemple.
* les dates dans l’histoire (trouver le système)
* le climat (météo et « effet » comme on dit en scénario)
* Pouvoir rechercher dans tout le projet courant des évènements (recherche), qu’ils soient affichés dans un panneau, et qu’on puisse en choisir (Space pour les choisir ou courant, Cmd+c/x, puis Cmd+v)
