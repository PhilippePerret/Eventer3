# Eventer3

CE FICHIER N’EST PAS À LIRE PAR CLAUDE code

## SUPRA TODO

- Vérifier le filtre en live, car pour le moment, si je ne me trompe pas, ça n’est pas encore effectif.

## Bug

## Todo

- réflexion : ne faudrait-il pas une base par projet ? de cette manière il serait possible de giter un projet pour garder tout l’historique.

  - -> documenter (une main DB qui persiste les fichiers/des fichiers eventer.db pour chaque projet)

- formatage du texte (markdown-like, badge de personnages)

  - on recherche les badges des personnages, on les remplace par les pseudos

  - on recherche \*italiques\*, \_\_souligné__, \*\*gras**, \~\~barré\~\~

  - on recherche les `[titre](lien)` (lien toujours externe, target _blank)

  - on recherche les références internes (je ne sais pas encore quelle forme elles doivent avoir. On prend de toute façon `[titre](path)` comme modèle, mais `path` sera remplacé par un identifiant d’event, par exemple. Par exemple : 

    ~~~
    il faut [voir la séquence](e256) qui parle de…
    ~~~

    Possibilité d’ouvrir la référence dans la même fenêtre ou dans l’autre fenêtre (la division de la fenêtre est une fonctionnalité requise)

    ​	=> implémenter le raccourci pour 1) atteindre le lien et 2) ouvrir dans la fenêtre courante ou l’autre fenêtre

- suppression : indiquer le nombre d’events supprimés et confirmer avec ce nombre. Donc, à la suppression : l’application regarde le nombre d’events que ça supprimerait (cout ?) 

  - la suppression doit-elle vraiment supprimer tous les events enfants ou seulement les liens : suppression réelle

- possibilité de diviser la fenêtre en deux parties, chacune avec leur évènemencier (le plus courant : l’évènemencier de niveau 1 du projet courant)

- panneau des options

  - il faut commencer à pouvoir déterminer les options
  - quelle option et où agit-elle ?

- import/export

  - system : reproduire une fenêtre comme le Finder pour choisir un dossier (pour exporter) ou choisir un fichier (pour importer)
  - choix du format (en export, garder les identifiant car il pourra y être fait référecence

- héritage : option « les sous-events héritent automatiquement des brins et personnages (seulement des brins ? des personnages ? de la météo ? de l’effet ? du lieu ? de la dyndate ?)

  - l’héritage doit-il être réel ou virtuel ?

- déplacement de panneau  : est-ce que la position est persistante ? (sinon => préférences de l’application)

- Implémenter le comportement spécial avec la touche ⇧ qui signifie « à tous les events cochés ». Au lieu d’appliquer simplement un choix à l’event sélectionné, il s’applique à tous les events cochés (ça doit être indiqué dans le titre, clairement. Fonctionne pour : 

  - le choix des brins
  - le choix des personnages
  - les styles

  Attention aux conflits : quel comportement adopté si un event coché ne comporte pas les mêmes caractéristiques que les autres (=> signaler et prendre le principe que les choix d’un event sont automatiquement ajouté. Si l’event E1 est dans Br1, E2 est dans Br2, si les deux sont cochés et que le panneau des brins est ouvert avec ⇧, les deux brins Br1 et Br2 sont cochés. Si on annule ça ne fait rien. Si on ferme, on doit appliquer les deux brins.

- Modifier partout le fait que `Item.depth` n’existe plus et que `Lister.depth` prend le relais. La correction a déjà été faite dans dev/Specs-SQLite.md

- En tirer les conséquences :

  - [ ] la propriété doit être définie pour tout Lister enregistré . Le premier, celui des projets, doit avoir le niveau 0 — le premier `Lister` du premier projet doit donc avoir le niveau 1 (depth 1). Ensuite, le Lister de tout Event aura le depth 2.

- système de référence : une marque permet de faire référence à un event/brin/personnage particulier (mais surtout un event) et permet de l’afficher pour le voir. Peut-être même pour s’y rendre concrètemen

  - utilisation particulière des références : un système de note sur le projet avec un dossier « Notes » en dernier event de niveau acte qui contiendrait toutes les notes au fil du développement, avec `[cf. note xxx](e125)` -- possibilité de rejoindre l’endroit où la note est appelée (attention, il peut y en avoir plusieurs : tous les afficher => TESTS)

  => Possibilité de diviser la fenêtre en deux parties 



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
