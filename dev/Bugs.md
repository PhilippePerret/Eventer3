# Eventer3 - Bugs

NOTE POUR CLAUDE : TU N’AS PAS À LIRE CE FICHIER

## MÉTA BUG

- Pourquoi hasLister est-il utilisé alors qu’on l’avait supprimé ???? En tout cas, on l’avait supprimé comme **donnée persistante**. Est-il nécessaire comme donnée virtuelle ?
  - Revenir quand même sur le mensonge (supprimé) de Claude dans le fichier remboursement, qui disait que c’était la suppression de cette donnée qui était en cause dans le bug alors que ça suppression s’est faite après 3 heures de ces errances, quand je n’en pouvais plus d’attendre et que je me suis mis à regarder un peu le code pour voir toutes les horreurs qui avaient été conservées.
- IL faut vraiment trouver le moyen de travailler de façon « locale » dans le code pour ne pas avoir à tout charger et tout comprendre à chaque fois. Comment est-ce possible ?
- Le mapping de clé (`Mapper.js`) n’est aucune raison d’être utilisé !!! C’est un vieux reste de la conception avec fichiers JSON **QUI DOIT TOTALEMENT DISPARAITRE** !!!

## Bugs divers

* Il faudra bien regarder les raccourcis qui doivent être affichés dans la bande d’aide car pour le moment c’est un grand n’importe quoi sur ce qui doit être proposé. Chaque affichage devrait être adapté au mode courant, en sachant que le plus pratique serait de donner un nom très précis à chaque état possible (« affichage d’un évènemencier », « affichage de la liste des brins pour filtre », « affichage de la liste des brins pour affectation à un event », « affichage de la liste des personnages pour affectation aux brins », etc.) afin de pourvoir lister dans `config.js` les racccourics à afficher.
