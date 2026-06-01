# Eventer3

### Bug

-  

## Todo

* GROSSE RÉFLEXION SUR LA FAÇON D’ENREGISTRER LES ITEMS. Je ne suis plus du tout sûr les enregistrer dans des fichier `__items.json` dans leur hiérarchie soit la vraie bonne solution. Pour deux raisons principales :
  1. on doit pouvoir les changer de place facilement, or, tel que c’est pour le moment etc.
  2. pour l’affichage de « panneaux de niveaux », ça oblige à ouvrir et gérer de nombreux fichiers, quand il suffirait de ne rien faire avec un id et une base de données.
* Propriété `flag` pour les `Lister` — première option : le mode d’affichage des fond d’Event, soit par couleur de premier brin, soit par « climat » (météo + effet).
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
