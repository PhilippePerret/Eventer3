# Eventer3 — Todo

* ajouter la propriété `mode` de `Lister` qui permettra de définir si les items sont des projets, des évènements (event normaux ou event script), des brins ou des personnages.
* S’assurer que les propriétés `created_at`/`ca` et `updated_at`/`ua` soient toujours enregisrées (backend)
* Des options générale de l’application
  * `open-with-project-list` : une option détermine si l’application doit s’ouvrir sur la liste des projets ou sur le dernier évènemencier travaillé.
* Console pour commander Eventer de l’intérieur « en ligne de console »
* Rendre la propriété `active` propre à `Project < Item` et à personne d’autre. Les autres, lorsqu’ils sont détruits, le sont vraiment (fichiers si nécessaire et dans les données)
* Ajouter les classes `ScriptLister < Lister` et `ScritptItem < Item` comme classes majeures. Noter qu’un évènemencier entier peut être un Lister, mais qu’on peut aussi se contenter de définir certains `Event`s comme des `ScriptItem`s qui permettront de définir le texte final. Noter aussi qu’il peut y avoir des `ScriptEvent`s intermédiaire pour les synopsis par exemple.
* les dates dans l’histoire (trouver le système)
* le climat (météo et « effet » comme on dit en scénario)







Grosse grosse déception quand même : avant, dans la toute première version de Eventer bricolée en vitesse, le panneau brin s’affichait et fonctionnait super bien, sans le moindre problème. Là, tu as implémenté un milliard de tests et rien ne fonctionne comme ça devrait !!! (MAIS QUE FONT CES TESTS ?????) : 

- Space devrait cocher (choisir) le brin (et l’attribuer à l’event courant ET ÇA DEVRAIT SE  VOIR)
- Cmd-Enter pour fermer devrait être dans l’aide footer, absolument pas dans la fenêtre ! (C’EST POURRI !!!)
- Tab ne permet pas de passer de propriété en propriété !
- le badge n’est pas calculé automatiquement (premières lettres si un seul mot ou première lettre de chaque mot si plusieurs)
- l’affichage d’un nouvel item (« n ») est super moche !!!! ALORS QU’IL DEVRAIT AVOIR LE MÊME ASPECT QU’UN BRIN AFFICHÉ
- On ne voit pas quel brin est sélectionné ALORS QUE ÇA DEVRAIT FONCTIONNER COMME TOUT LISTER !!!! Avec un fond bleu, des flèches haut/bas qui permettent de sélectionner. LÀ ON NE PEUT RIEN FAIRE !!!! ALORS QUE ÇA DEVRAIT ÊTRE STRICTEMENT LE MÊME COMPORTEMEN, PUTAIN !!!!!!!!!!!
- un brin devrait TOUJOURS avoir un badge
- les couleurs de brin devraient être différentes chaque fois. 
- Et je suis sûr qu’il y a d’autres choses que je n’ai pas vues…………

En tout cas, c’est HYPER décevant.
