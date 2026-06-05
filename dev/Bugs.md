# Eventer3 - Bugs en Live

* [Bug « naturel »] Il faut gérer le cas de la flèche ← jouée sur un Event en édition lorsque le champ est vide (attention à toutes ces conditions). Je vais utiliser un cas concret pour le décrire [ci-dessous](#back-parent) Elle devrait :
  1. faire revenir au parent soit, la liste des projets (si eventer de niveau 1) soit au Lister supérieur (parent)
  2. ne pas créer de `Lister` pour l’event

* Un évènemencier vide (`EventLister`) ne devrait JAMAIS pouvoir être enregistré. FAIRE UN TEST pour : Si on utilise La touche `→` sur un Event, => un évènement doit être automatiquement créé (PROVISOIREMENT) MAIS si on `Escape` (édition de l’évènement annulé) et qu’on revient `←`, le ListerEvent de l’event initial NE DEVRAIT PAS être créé. FAIRE UN TEST pour : la même chose mais en faisant `Enter` sur l’event en édition, qui ne devrait pas l’enregistrer puisque ON NE DOIT PAS POUVOIR ENREGISTRER UN EVENT AVEC `title` vide.

* Quand on supprime un Brin en mettant son `title` à vide, le brin avant ou après DEVRAIT ÊTRE SÉLECTIONNÉ. <= FAIRE LE TEST

* La touche `Space` sur un event sélectionné DEVRAIT LE COCHER/DÉCOCHER. <= FAIRE LE TEST

NE RÉPÈTE PAS CETTE LISTE EN CONSOLE.

RESPECTE LE TDD : 1) Tu écris un test qui doit échouer 2) je joue ce test et je te donne le résultat, 3) tu codes l’application pour que le test passe au vert.

TU COMMENCES ÉVIDEMMENT PAR CORRIGER LE PREMIER, PUIS LE SUIVANT, ETC.



<a name="back-parent"></a>

### Cas concret d’usage pour le bug

#### Depuis la liste des projets

- je crée un nouveau projet « PA »

- je joue la touche → pour « entrer » dans le projet

  => Je me retrouve sur l’eventer de niveau 1 du projet, avec le premier Event en édition

- je devrais pouvoir faire ← pour 1) annuler la création de l’Event, 2) annuler la création du permier `ListerEvent` pour le projet et 3) revenir à la liste des projet avec le projet « PA » sélectionné

#### Depuis un Event de ListerEvent

