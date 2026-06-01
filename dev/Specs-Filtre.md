# Réflexion sur le filtre

Le ***filtre*** est une fonctionnalité très puissante d’Eventer et essentiel. C’est elle, par exemple qui va permettre de se concentrer sur un brin particulier de l’histoire (p.e. une intrigue).

Le filtre fonctionne sur deux modes de listing : 

a. le mode normal (ou « imbriqué »)

b. le mode par niveau (ou « complet »)

### Les modes de fonctionnement

### Le mode normal

C’est le mode avec un listing tel qu’il est affiché dans le mode d’utilisation normal de l’application, c’est-à-dire sur un Lister d’Item event. Il fonctionne donc en général sur un petit nombre d’items.

### Le mode par niveau

Le *Mode par niveau* est un mode d’affichage qui permet d’afficher tous les `Event`s d’un projet correspondant au même « niveau ». Quand on parle de « niveau » ici, on parle de niveau d’imbrication. Voir la description de [Niveau d’imbrication dans les specs](Specs-modeles.md#niveaux-imbrication).

### La touche « / »

La touche `/` est la touche principale du filtre. Dès qu’elle est jouée, on rentre en mode filtrage (nouveau `onkeydown`).

Les combinaisons sont : 

| Combinaison | Effet                                                        |
| ----------- | ------------------------------------------------------------ |
| `/`         | On rentre en mode filtrage, un nouvelle ligne se crée au-dessus de tout affichage Lister (Projet, Event, Brin, Perso) qui va permettre de spécifier ou d’indiquer le filtre. |
| `/`,`t`     | Filtrage « fuzzy » par le `title` (pseudo pour les personnage, on peut penser à « t » pour « texte »)<br />Un champ au-dessus de la colonne permet de rentrer le texte. |
|             |                                                              |
|             |                                                              |

