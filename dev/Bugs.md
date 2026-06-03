# Eventer3 - Bugs en Live

* Le contenu de la base de données par défaut, qui est créée quand `data/eventer.db` n’existe pas PROUVE QUE CLAUDE N’A ENCORE RIEN COMPRIS À L’ORGANISATION DES DONNÉES. Voilà les seules données que devraient contenir la base : [Table initiale](Schema-SQLite.md#table-ini). Et voir aussi l’[exemple de table au cours du travail](Schema-SQLite.md#exemple-table) en dessous.
  
* Les BRIN d’un Event ne semblent absolument pas être enregistrés. OU : ils ne sont pas affichés lorsque l’évènemencier est affiché.

* La touche `b` sur un event ouvre bien le panneau des brins MAIS les brins cochés DEVRAIENT correspondre aux brins et seulement aux brins de l’event. <= FAIRE UN TEST (rouge -> vert)

* Un évènemencier vide (`EventLister`) ne devrait JAMAIS pouvoir être enregistré. FAIRE UN TEST pour : Si on utilise La touche `→` sur un Event, => un évènement doit être automatiquement créé (PROVISOIREMENT) MAIS si on `Escape` (édition de l’évènement annulé) et qu’on revient `←`, le ListerEvent de l’event initial NE DEVRAIT PAS être créé. FAIRE UN TEST pour : la même chose mais en faisant `Enter` sur l’event en édition, qui ne devrait pas l’enregistrer puisque ON NE DOIT PAS POUVOIR ENREGISTRER UN EVENT AVEC `title` vide.

* Quand on supprime un Brin en mettant son `title` à vide, le brin avant ou après DEVRAIT ÊTRE SÉLECTIONNÉ. <= FAIRE LE TEST

* La touche `Space` sur un event sélectionné DEVRAIT LE COCHER/DÉCOCHER. <= FAIRE LE TEST

NE RÉPÈTE PAS CETTE LISTE EN CONSOLE.

RESPECTE LE TDD : 1) Tu écris un test qui doit échouer 2) je joue ce test et je te donne le résultat, 3) tu codes l’application pour que le test passe au vert.

TU COMMENCES ÉVIDEMMENT PAR CORRIGER LE PREMIER, PUIS LE SUIVANT, ETC.