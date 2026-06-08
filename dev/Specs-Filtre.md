# Eventer3 - Le Filtrage

Le ***filtre*** est une fonctionnalité très puissante d’Eventer et essentiel. C’est elle, par exemple qui va permettre de se concentrer sur un brin particulier de l’histoire (p.e. une intrigue).

Le filtre doit fonctionner pour tout : Project, Brin, Perso et Event (=> logique dans `Lister` et `Item`, pas dans les classes spécialisées, à part pour du détail).

Avec les `event`s, Le filtre fonctionne sur les deux modes d’affichage des listings : 

1. le mode normal (ou « imbriqué »)
2. le mode par niveau (ou « complet »)

Mais en fait, s’il est bien implémenté, il n’en aurait rien à faire : il s’appliquera à la listes des items affichée, c’est tout.

Pour en savoir plus sur les modes d’affichage : voir la description de [Niveau d’imbrication dans les specs](Specs-modeles.md#niveaux-imbrication).

### La touche magique « / »

La touche `/` est la touche principale du filtre. Dès qu’elle est jouée, on attend le ou les caractères suivants (un seul si ça n’est pas `/` le suivant).

Conformément à toute l’application, tous les `Lister`s (ProjectLister, EventLister/ScriptLister, BrinLister, PersoLister) doivent pouvoir être filtrés.

## Combinaisons clavier

> Ces combinaisons doivent être précisées dans l’aide du footer, en indiquant qu’il faut un préfixe `/` pour les exécuter.

(« *commulatif* » ci-dessous signifie que les conditions s’additionnent entre elles) 

| Combinaison     | Effet                                                        |
| --------------- | ------------------------------------------------------------ |
| `/`             | On rentre en mode filtrage, un nouvelle ligne se crée au-dessus de tout affichage Lister (Projet, Event, Brin, Perso) qui va permettre de spécifier ou d’indiquer le filtre. |
| `/`,`t`         | Filtrage cumulatif « fuzzy » par le `title` (pseudo pour les personnage, on peut penser à « t » pour « texte »)<br />Un champ au-dessus de la colonne permet de rentrer le texte. On focus dedans et à mesure qu’on tape le texte, les events se masque ou se révèlent. En tenant compte bien sûr des autres filtres actifs.<br />*Note : ce filtre est activable pour tous les types de Lister* |
| `/`, `/`, `t`   | Annulation de la condition sur le `tittle` dans le filtre cumulatif. le champ de saisie se vide et la liste est mise à jour en fonction des autres filtres. |
| `/`, `b`        | Filtrage cumulatif **par les brins**. La fenêtre des brins s’ouvre (avec cochés les brins déjà filtrés) et on coche/décoche les brins dont on veut voir/masquer tous les events. À mesure qu’on coche te décoche, les events apparaissent et disparaissent en fonction de tous les filtres actifs.<br />+ les badges s’ajoutent ou se retirent à la ligne de filtre au-dessus de la liste d’events.<br />*Note : ce filtre n’est applicable qu’aux ListerEvent, ScriptEvent* |
| `/`, `/`, `b`   | Annulation de la condition sur les brins dans le filtre cumulatif.<br />+ tous les badges se retirent de la ligne supérieure de filtre. |
| `/`, `p`        | Filtrage cumulatif **par les personnages**. La fenêtre des personnages s’ouvre (avec les personnages actuellement filtrés) et on coche/décoche les personnages dont on veut voir/masquer les events. À mesure qu’on coche te décoche, les events apparaissent et disparaissent en fonction de tous les filtres actifs.<br />+ les badges s’ajoutent ou se retirent à la ligne de filtre au-dessus de la liste d’events.<br />*Note : ce filtre n’est applicable qu’aux EventLister/ScriptLister et BrinLister* (les autres types ne contiennent pas de personnages ou les contiennent tous (projet). |
| `/`, `/`, `p`   | Annulation de la condition sur les personnages dans le filtrage cumulatif.<br />+ tous les badges se retirent de la ligne supérieure de filtre. |
| `/`,  `/`,  `/` | Annule toutes les conditions de filtrage : la liste complète des events est affichée. |

---

## Implémentation

Au niveau de l’implémentation du code, voir la grosse réflexion qui a été faite.

**Principe absolu : Aucun état ne doit être relevé dans le DOM.**
