# Eventer3

CE FICHIER N’EST PAS À LIRE PAR CLAUDE code

## SUPRA TODO

## Bug

## Todo

- Formatage du texte

  - ~~on recherche les badges des personnages, on les remplace par les pseudos~~

  - ~~remplacement des constantes (penser aux régulières)~~

  - ~~on recherche \*italiques\*, \_\_souligné__, \*\*gras**, \~\~barré\~\~ (attention : si déjà appliqué, retirer)~~

  - ~~on recherche les `[titre](lien)` (lien toujours externe, target _blank)~~

  - ~~on recherche les références internes (je ne sais pas encore quelle forme elles doivent avoir. On prend de toute façon `[titre](path)` comme modèle, mais `path` sera remplacé par un identifiant d’event, par exemple.~~ 

    ~~Possibilité d’ouvrir la référence dans la même fenêtre ou dans l’autre fenêtre (la division de la fenêtre est une fonctionnalité requise)~~
    
    ​	~~=> implémenter le raccourci pour 1) atteindre le lien et 2) ouvrir dans la fenêtre courante ou l’autre fenêtre~~

- Traitement des cibles : vérifier qu’elles existent toujours. Sinon, notification.

- panneau(x) des options

  - il faut commencer à pouvoir déterminer les options
  - quelle option et où agit-elle ? Note : seulement les options indispensables (cf. le fichier réfs)

- import/export

  - choix du format (en export, garder les identifiant car il pourra y être fait référecence

- héritage : option « les sous-events héritent automatiquement des brins et personnages (seulement des brins ? des personnages ? de la météo ? de l’effet ? du lieu ? de la dyndate ?)

  - l’héritage doit-il être réel ou virtuel ? (i.e. en cache ou persistant)

- déplacement de panneau  : est-ce que la position est persistante ? (sinon => préférences de l’application)

- Implémenter le comportement spécial avec la touche ⇧ qui signifie « à tous les events cochés ». Au lieu d’appliquer simplement un choix à l’event sélectionné, il s’applique à tous les events cochés (ça doit être indiqué dans le titre, clairement. Fonctionne pour : 

  - le choix des brins
  - le choix des personnages
  - les styles

  Attention aux conflits : quel comportement adopté si un event coché ne comporte pas les mêmes caractéristiques que les autres (=> signaler et prendre le principe que les choix d’un event sont automatiquement ajouté. Si l’event E1 est dans Br1, E2 est dans Br2, si les deux sont cochés et que le panneau des brins est ouvert avec ⇧, les deux brins Br1 et Br2 sont cochés. Si on annule ça ne fait rien. Si on ferme, on doit appliquer les deux brins.

- Un affichage « total » qui affiche tous les évènements, avec une indentation qui montre l’imbrication. Peut-être, dans cet affichage, se limiter au title des events

  - 3e mode d’affichage => cmd+m doit afficher une petite fenêtre affichant :

    ~~~
    Affichage par imbrication
    Affichage par niveau
    Affichage total
    ~~~

    (sélection avec les flèches en Enter, comme pour tout)

* Propriété `flags` pour les `Lister` — première option : le mode d’affichage des fond d’Event, soit par couleur de premier brin, soit par « climat » (météo + effet). UTILE ?

* Des options générale de l’application
  * `open-with-project-list` : une option détermine si l’application doit s’ouvrir sur la liste des projets ou sur le dernier évènemencier travaillé.
  
* Console pour commander Eventer de l’intérieur « en ligne de console »

* Rendre la propriété `active` propre à `Project < Item` et à personne d’autre. Les autres, lorsqu’ils sont détruits, le sont vraiment (fichiers si nécessaire et dans les données)

* Ajouter les classes `ScriptLister < Lister` et `ScritptItem < Item` comme classes majeures. Noter qu’un évènemencier entier peut être un Lister, mais qu’on peut aussi se contenter de définir certains `Event`s comme des `ScriptItem`s qui permettront de définir le texte final. Noter aussi qu’il peut y avoir des `ScriptEvent`s intermédiaire pour les synopsis par exemple.

  * On peut même imaginer de faire le synopsis à partir d’un niveau d’imbrication moindre, par exemple :

    ~~~
    NIV 0	|	NIV 1	|	NIV 2	| NIV 3	| NIV 4
    projet
    			Actes			Séquence
    ~~~

    

* les dates dans l’histoire (trouver le système)

* le climat (météo et « effet » comme on dit en scénario)

* Pouvoir rechercher dans tout le projet courant des évènements (recherche), qu’ils soient affichés dans un panneau, et qu’on puisse en choisir (Space pour les choisir ou courant, Cmd+c/x, puis Cmd+v)

* Système d’ouverture mac-like : fichiers .evt qui ouvrent automatiquement le serveur de Eventer
