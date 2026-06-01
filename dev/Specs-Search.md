# Eventer3 - la Recherche

Contrairement au [filtrage](Specs-Filtre.md) qui permet de filtrer les **listes affichées** (tous type de `Lister`s confondus), la recherche permet de chercher des éléments dans tout un projet. Pour retrouver par exemple des `Item`s de type `Event` qui répondent à des conditions.

Si le filtrage est la recherche sons des choses différentes, elles répondent en revanche au même système de définition des conditions.

## La touche magique « $ »

De la même manière que `/` est la touche magique du filtre, `$` est la touche magique de la recherche.

Par exemple : 

~~~
$ t départ
~~~

… va chercher tous les évènements qui contiennent « départ » dans leur `title`.

Contrairement au filtre qui fonctionne en direct, pour la recherche, on doit définir les conditions et lancer la recherche.



### Combinaisons clavier

> Comme pour le filtrage, ces combinaisons doivent être renseignées dans l’aide footer en indiquant qu’il faut le préfixe `$` pour les exécuter.

| Combinaison   | Effet                                                        |
| ------------- | ------------------------------------------------------------ |
| `$`           | Passe en mode « recherche », c’est-à-dire affiche le panneau qui permet de définir les conditions. |
| `$`, `$`, `$` | Quitte le mode « recherche » et retourne dans le précédent affichage. |
| `$`, `t`      | Permet de définir la condition textuelle sur `title`. Si la condition commence et finit par « / », c’est une expression régulière. |
| `$`, `$`, `t` | Supprime la condition sur le `title`.                        |
| `$`, `b`      | Permet de définir la condition sur les brins. Affiche la fenêtre des brins avec les brins déjà choisis cochés et permet de cocher et décocher les brins pour les filtrer.<br />À chaque choix, le badge du brin s’affiche ou se masque de la boite de recherche. |
| `$`, `$`, `b` | Supprime toute condition sur les brins.                      |
| `$`, `p`      | Idem que pour les brins, mais pour les personnages.          |
| `$`, `$`, `p` | Supprime toute condition sur les personnages.                |

