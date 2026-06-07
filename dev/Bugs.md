# Eventer3 - Bugs

## MÉTA BUG

- Pourquoi hasLister est-il utilisé alors qu’on l’avait supprimé ???? En tout cas, on l’avait supprimé comme **donnée persistante**. Est-il nécessaire comme donnée virtuelle ?
- Le mapping de clé (`Mapper.js`) n’est aucune raison d’être utilisé !!! C’est un vieux reste de la conception avec fichiers JSON **QUI DOIT TOTALEMENT DISPARAITRE** !!!

## Bugs divers

* Il faudra bien regarder les raccourcis qui doivent être affichés dans la bande d’aide car pour le moment c’est un grand n’importe quoi sur ce qui doit être proposé. Chaque affichage devrait être adapté au mode courant, en sachant que le plus pratique serait de donner un nom très précis à chaque état possible (« affichage d’un évènemencier », « affichage de la liste des brins pour filtre », « affichage de la liste des brins pour affectation à un event », « affichage de la liste des personnages pour affectation aux brins », etc.) afin de pourvoir lister dans `config.js` les racccourics à afficher.
