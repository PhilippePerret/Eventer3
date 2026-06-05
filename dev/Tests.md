# Eventer - tests à faire

[TOC]

## Classe abstraite Lister

- [x] S’assurer que la classe JS `Lister` existe et qu’on peut instancier un objet d’une classe qui en hérite.

- [x] S’assurer que la classe JS `Item` existe et qu’on peut instancier un objet d’une classe qui en hérite.

- [x] S’assurer que la méthode `Lister.sortItems` existe et qu’elle classe bien les items fournis.

- [ ] Dans un lister quelconque, on peut cocher les éléments (Projets, Brins, Events, Persos…). Mais quand on fait un couper ou un coller, il y a deux comportement différents : SI des éléments sont cochés, ce sont eux ET SEULEMENT EUX (pas l’item sélectionné) qui sont considérés. SI en revanche aucun item n’est coché, c’est l’item sélectionné qui est considéré/traité. Faire l’essai par exemple avec couper-coller

- [ ] En revanche, supprimer (`Delete` sans la touche `Shift`) supprime seulement l’item sélectionné. Deux essais : 1) `Delete` seul => supprimer l’item sélectionné. 2)  `Shift`+`Delete` => supprime les items cochés (mais PAS celui sélectionné, SAUF s’il est coché, évidemment !

- [ ] La touche ← permet de revenir au Lister « parent » (s’il existe évidemment, donc un test avec un Lister qui a un parent et un avec un Lister qui n’a pas de parent.

- [ ] Un. Lister doit toujours posséder au moins un item. Tester :
  - [ ] Un event doit toujours posséder au moins un évènement. On ne doit pas pouvoir détruire le dernier, ni avec la touche `Delete`, ni en mettant son title à rien.
  - [ ] Un projet doit toujours posséder au moins un brin. => on ne doit pas pouvoir détruire le dernier brin, ni avec la touche `Delete`, ni en mettant son title à rien.
  - [ ] Un projet doit toujours posséder au moins un personnage. => on ne doit pas pouvoir détruire le dernier personnage, ni avec la touche `Delete`, ni en mettant son title à rien. 
  - [ ] on ne doit pas pouvoir détruire le dernier projet, ni avec la touche `Delete` ni en mettant son contenu à rien.


---

## Projets

- [x] S’assurer que des données minimales existent toujours (un dossier `data` qui peut avoir été détruit — ne pas le créer après l’avoir mis de côté avec son contenu en production pour qu’il n’existe pas au début)

- [x] S’assurer, en cas de données minimales manquantes, qu’un projet démo est bien créé, avec un brin minimal, un personnage minimal et un event minimal. S’assurer de ça en testant le DOM, ce projet doit être affiché.

- [x] S’assurer que les classes CSS soient bien affectées pour la liste des projets (bonnes classes `item` + `project_listing`, il y a `#main-panel.projects-listing .project-listing` à affecter, et `.project-listing__item `, `.project-listing__title`, `.project-listing__id`).

- [x] S’assurer que pour un projet (Project < Item), seul le titre (`title`) et l’identifiant (`id`) soient affichés dans la ligne de l’item (dans le DOM).

- [x] S’assurer que la liste complète des projets s’affiche après en avoir créé 3 actifs et 1 non actif qui ne doit pas s’afficher.

- [x] S’assurer que le style du listing des projets est propre à ce `Lister` et cet`Lister` seulement

- [x] S’assurer que le premier projet (en haut du listing — faire trois projets pour ce test) est bien sélectionné

- [x] S’assurer que les flèches haut/bas permettent de passer d’un projet à l’autre (Ça doit être le cas **pour tous les `Lister`s**, donc => ne pas implémenter un comportement qui ne fonctionnerait que pour les projets !!!!)

- [x] S’assurer que Cmd-flèche haut/bas permet de déplacer les projets (comportement de `Lister`).

- [x] S’assurer que la touche « n » permet de créer (provisoirement juste dans le DOM) un nouveau projet SOUS la sélection.

- [x] S’assurer que la touche « n » suivi de la touche Escape ne crée rien au final ni d’élément DOM, ni de projet en backend (données persistantes)

- [x] S’assurer que la touche « n » suivi de la touche Entrer sans avoir entré aucun title ne crée rien au final ni d’élément DOM, ni de projet en backend (données persistantes)

- [x] S’assurer que la touche « n » (création d’un nouvel item) désélectionne l’item courant.

- [x] S’assurer que le fait de taper un titre de projet, lorsqu’il est nouveau (ET SEULEMENT DANS CE CAS), crée en même temps l’identifiant logique et le met dans le champ visible. Attention : ça n’est valable QUE pour les Item de type Project, pas les autres.

- [x] S’assurer que la flèche droite permet de RENTRER dans le projet (c’est-à-dire de voir son premier évènemencier — qui correspond à ses `events`) (idem = valable pour n’importe quel lister)

- [x] S’assurer que dans un EventLister, la touche « n » permet de créer un nouvel Event (avant celui sélectionné).

- [x] S’assurer que tout de suite après avoir créer le tout premier event d’un EventLister, on puisse faire « n » pour en créer un nouveau.

- [x] S’assurer que la touche ← permette de revenir dans le « parent » (note : « revenir dans le parent » signifie revenir à l’EventLister supérieur et sélectionner l’Item du Lister dont on vient). Par exemple : si on est dans le tout premier EventLister d’un projet, la touche ← doit faire revenir à la liste des projets avec le projet en question sélectionné. Si on est dans le Lister d’un Event (donc dans l’évènemencier d’un Event qui appartient à l’évènemencier parent), la touche ← doit faire revenir à l’évènemencier parent, avec l’event sélectionné. Faire ces deux tests dans le fichier.

- [x] La touche `Enter` met l’édition en route et permet d’éditer le `title`. La couche `Escape`permet d’annuler l’édition.

  S’assurer que la touche Enter (quand on est en affichage de l’EventLister) permet de passer l’élément en édition (attention, « passer en édition » veut dire des choses différentes suivant la classe spécialisée, chaque classe possède ses propres attributs éditables — mais on commence toujours par `title`, la base de ton `item` — Project : `title` et `id`, Event : `title`, `state`, Brin : `title`, `badge` (automatique 3 lettres d’après title), `color`, Perso : `title`, `badge` (automatique sur title).

- [ ] S’assurer que la touche Space permet de checker (cocher) l’event. Et que cette donnée est persistante. 

- [ ] S’assurer que dans un EventLister quelconque, la combinaison «  Cmd-n » permet de créer un nouvel Event APRÈS celui sélectionné.

- [ ] S’assurer que l’aide footer s’affiche conformément aux modes et aux définitions de config.js. Les tester toutes précisément.

- [ ] S’assurer que lorsque l’Item n’a pas de Lister, quand on fait →, un premier Item fictif soit bien créé dans le Lister fictif. Le faire  — peut-être déjà fait — pour un Item Projet (dans e2e/projet). Le faire pour un Item Event (dans e2e/event). Le faire pour un item Brin (dans e2e/brin). Le faire pour un Item Perso (dans e2e/perso).

- [ ] S’assurer qu’une **fichier** Lister ne soit créé avant que ce lister ait vraiment un Item. Le faire pour un ProjectLister. Le faire pour un EventLister.

- [ ] S’assurer qu’un nouveau projet créé entraine bien aussi la création d’un premier évènemencier (`i1`), un premier brin (`b1` de title « Intrigue principale ») et un premier personnage (`p1` de title « Protagoniste »).

- [ ] S’assurer que la flèche gauche permet de revenir à la liste des projets (idem = valable pour n’importe quel lister)

- [ ] S’assurer que le déplacement des projets est persistant (idem = valable pour n’importe quel lister)

- [ ] S’assurer que la touche Enter permet de modifier le titre du projet courant ((idem = valable pour n’importe quel lister))

- [ ] S’assurer que la modification du titre est bien persistante (Ça doit être le cas pour tous les lister)

- [ ] S’assurer que lorsqu’un item ne peut pas être placer entre deux items de `pos` consécutifs (ex : `pos:123` et `pos:124`), tous les `pos` (où seulement ceux qui posent problème ?) sont re-initialisés à une valeur correcte.

- [ ] S’assurer que la destruction d’un projet qui a un évènemencier détruise bien cet évènemencier aussi. Idem pour un `Event` (on doit détruire aussi le fichier de son `Lister` s’il en a un)

## Évènemencier

- [ ] S'assurer que le premier item d'un évènemencier est toujours sélectionné (déjà testé ?)
- [ ] S'assurer que les flèches haut/bas permettent de sélectionner les évènements successifs (déjà testé ?)
- [ ] S'assurer que la touche Space permette de cocher plusieurs évènement. (déjà testé ?)
- [ ] S'assurer que la coche est persistante (cocher plusieurs évènements et recharger l'évènemencier : les mêmes évènements doivent être cochés)

## Event

- [x] La touche ⌦ permet de supprimer l’item sélectionné même s’il y a des items cochés mais SI ça n’est pas le dernier. Comportement identique pour les Project, les Brins et les Persos.

- [ ] Test de la suppression des Items cochés avec ⇧+ ⌦. Tester : un message de confirmation doit être validé (Enter). Tester : l’Item sélectionné n’est pas supprimé s’il n’est pas coché. NOTE : fonctionnement commun à TOUS LES TYPES D’ITEM.

- [ ] La combinaison ⇧+⌦ est documentée dans la fenêtre des raccourcis (`?`).

- [ ] Un event affiche : son `title`, les badges de ses brins, les badges de ses personnages (personnages propres + personnages de ses brins) et le menu `state`
  \+ glisser la souris sur les badges (perso et brin) affiche leur `title` complet (avec un système propre à l’application, plus gros et plus rapide que l’attribut `title` de l’objet DOM.
  
- [ ] On doit pouvoir mettre un Event en édition pour modifier de façon persistante sont `title` et son `state`.

- [ ] La combinaison ⌘+`c` permet de copier l’item sélectionné (toutes ses propriétés SAUF son id).

- [ ] La combinaison ⌘+`x` permet de couper l’item (toutes ses propriétés MÊME son id)

- [ ] Avec ⌘+`x`, on ne doit pas pouvoir couper le dernier item quelconque.

- [ ] La combinaison ⌘+`v` permet de coller l’item au-dessus de l’item sélectionné **même dans un autre panneau** (essayer forcément avec les évènemenciers). MAIS PAS dans un panneau d’un autre type : on ne peut pas coller un event dans le panneau des brins, dans le panneau des projets ou le panneau des personnages, etc.

- [ ] La combinaison ⌘+`v` permet de coller LES items copiés ou coupés (avec ⇧+⌘+`c`/`v`) même dans un autre panneau (de même type). Faire le test de coller un event dans plusieurs évènemenciers.

- [ ] Un item COUPÉ doit pouvoir être collé PLUSIEURS FOIS avec la combinaison ⌘+`v`, en gardant dans le même `id`, mais sans créer de nouveaux items persistants. 

- [ ] La combinaison ⇧+⌘+`c` permet de copier tous les items cochés (toutes leurs propriétés sauf leur id). Faire un test avec l’élément sélectionné coché (il est pris aussi) et un test avec l’élément sélectionné non coché (il n’est pas pris).

- [ ] La combinaison ⇧+⌘+`x` permet de couper tous les items cochés (toutes leurs propriétés MÊME leur id). Faire un test avec l’élément sélectionné coché (il est coupé aussi et pris) et un test avec l’élément sélectionné non coché (il n’est pas considéré.

- [ ] Avec la combinaison ⇧+⌘+`x`, on ne doit pas pouvoir couper tous les items d’un Lister (quand ils sont tous cochés) => message d’alerte disant qu’il faut au moins décocher un (1) élément.

- [ ] La touche `?` (⇧+,) permet d’afficher la liste de tous les raccoucis. La touche ⌘+↩︎ permet de fermer le panneau des raccourcis comme tout panneau)

- [ ] Un event peut définir sa météo (`meteo` ☀️🌤️🌦️☁️💨⛈️🌪️🌨️) dans un mini panneau qui contient aussi l’effet.

- [ ] Un event peut définir son effet (`effet`) pami « jour », « nuit, etc. Voir les valeus possibles et les vraies valeurs dans la données `EFFETS`.

- [ ] La météo et l’effet d’un event influence son apparence (si l’option du Lister le demande => flag du Lister)

- [ ] Un event peut définir sa date `dyndate` de façon fixe (en lui donnant un nom fixe).

- [ ] Test unitaire du calcul de la date dynamique.

- [ ] Un event peut définir sa date `dyndate`de façon dynamique.

- [ ] Quand le panneau des personnages d’un event est ouvert (avec `p`), la liste des personnages de ses brins doivent être : 

  - cochés
  - grisé/non éditable (on ne peut pas les décocher)

  De cette manière, il est impossible de choisir un personnage pour un event qui appartient déjà à un de ses brins.

## Perso

- [ ] On ne peut pas choisir le même avatar pour deux personnages
- [ ] On ne peut pas choisir le même badge pour deux personnages.

## Brin

### Généralités

- [ ] En édition, avec la touche `Tab`, on doit pouvoir modifier, dans l’ordre : le `title`, le `badge`, le `type` et la `color` du brin.
- [ ] Le choix de la couleur du brin doit modifier l’affichage des events qui l’ont en premier brin si l’option de l’EventLister le demande (choix entre fond = premier brin ou fond = climat).
- [ ] On ne doit pas pouvoir mettre un badge de plus de trois lettres. Et ça doit s’écrire toujours en capitales.
- [ ] On ne peut pas choisir le même badge pour deux brins (ATTENTION à la créataion automatique de badge, qui doit en tenir compte)

### Panneau des brins

- [ ] Le panneau des brins ne devrait jamais être vide. <= Un projet devrait TOUJOURS avoir au moins un brin « modèle ».
- [ ] À l’ouverture du panneau, seuls les brins de l’event sélectionné devraient être cochés.

---

### Panneau des personnages

- [ ] Le panneau des personnages ne devrait jamais être vide. <= Un projet devrait TOUJOURS avoir au moins un personnage « modèle ».



## Project

- [ ] On ne peut plus redéfinir un `id` de projet une fois qu’il a été défini(i.e. une fois que son `Lister` existe (et donc une fois que son dossier `lof` existe.

---

## Options application

- [ ] S’assurer que si l’option `open-with-project-list` est active, c’est la liste des projets qui est affichée. S’assurer que si l’option `open-with-project-list` est `false`, c’est la dernier évènemencier qui est ouvert OU la liste des projets si aucun dernier évènemencier n’est défini.
- [ ] S’assurer que l’option `do-not-confirm-delete` fonctionne : on la désactive et on détruit un event => message de confirmation (par `Enter`) 1) on conrfirme => l’event est détruit, on annule (`Escape`). On l’active => On détruit un event => pas de message de confirmation + l’event est bien supprimé.

---

## Affichage

- [ ] Le raccourci ⌘+`m` permet de basculer du mode « normal » au mode par « niveau ». Le basculement change la liste affichée.

### Page normale

- [ ] La première page affiche la liste des projets si les options de l’application sont réglées comme ça). La première page affiche la liste du dernier évènemencier.

### Barre d’état

- [ ] Une barre d’état est bien affichée en bas de la fenêtre (sous l’aide footer)
- [ ] La barre d’état affiche en tout premier le titre du projet.
- [ ] La barre d’état affiche la profondeur d’imbrication courante dans le projet.
- [ ] La barre d’état affiche le bon mode d’affichage (« NORMAL » ou « NIVEAU »).
- [ ] La barre d’état affiche le niveau d’imbrication (en chiffre)

---

## Filtre

- [ ] Le filtre s’applique toujours à la liste affichée (même si c’est une liste par niveau d’imbrication).

- [ ] On peut filtrer la liste par `title` avec le raccourci `/`,`t` .

- [ ] On peut filtrer la liste affichée par brin avec la combinaison `/`,`b`.

  \+ la ligne en haut de colonne indique le badge des brins filtrés
  \+ passer la souris sur le badge du brin fait apparaitre son `title` complet.

- [ ] On peut annuler le filtrage avec la combinaison `/`,`/`, `a` (« a » comme « all », « tout »).

---

## Recherche

- [ ] Les combinaisons avec la bouche `$` permettent de définir la recherche entièrement au clavier. L’aide Footer permet de visualiser les combinaisons.

---

## Test total

Ce test est censé passer tout en revue comme une seule visite. On met les différents fichiers tests dans un dossier `test-total` qui comportera des tests incrémentés de 100 en 100 pour pouvoir introduire des tests supplémentaires entre les tests déjà effectués.

On détruit toute base de données (fichier `data/eventer.db`)

- [ ] L’appel de l’application doit créer un premier projet modèle avec un brin, un personnage et un event. Vérifier dans la base de données.
  Le projet modèle doit être doit être affiché dans le panneau des projets avec la bonne apparence.
  Le panneau doit afficher « Liste des projets » 
- [ ] La flèche → doit permettre d’entrer dans le premier évènemencier du projet par défaut
- [ ] La flèche ← doit permettre de revenir à la liste des projets.
- [ ] La touche « n » doit permettre de créer un nouveau projet. TESTER AUSSI : doit lui créer un event, un brin et un personnage. TESTER AUSSI : en édition, le fond doit être VERT.
- [ ] Les flèches ↑ et ↓ doivent permettre de sélectionner (en boucle) les projets affichés.
- [ ] Sélectionner le dernier projet et taper ⌥+`n`. Un nouveau projet doit se créer SOUS le dernier projet.  Puis : 

  1. Lui donner le titre « Mon troisième projet ».

  2. La touche `Tab` doit permettre de rejoindre le champ `id` et de le modifier.

  3. La touche `Enter` doit permettre d’enregistrer le nouveau projet.

     TESTER AUSSI : l’identifiant du projet doit se calculer automatiquement.

     TESTER AUSSI : La donnée persistante est enregistrée.
- [ ] La combinaison ⌘+↑ et ⌘+↓ doit permettre de remonter le dernier projet tout en haut puis de le mettre en deuxième position. Puis de remonter le dernier projet tout en haut. TESTER AUSSI : L’ordrer des projets doit être conservé en base de données, dans lister#1.
- [ ] En relançant l’application, l’ordre des projets doit être conservé.
- [ ] La touche `Enter` met le projet en édition. TESTER AUSSI : on ne doit pas pouvoir modifier l’identifiant du projet.
- [ ] La flèche → permet d’entrer dans le premier évènemencier du premier projet.
- [ ] La touche `Enter` permet de passer le premier event en édition (TESTER FOND EN VERT). Puis : 

  1. On met « C’est l’incipit du roman en title ». 
  2. La touche `Tab` doit permettre de choisir l’état (state). Choisir « ébauche ».
  3. La touche `Enter` permet d’enregistrer (de façon persistane) les nouvelles données.
- [ ] La touche ⌥+`n` permet de créer un nouvel event sous le premier. On lui donne le titre « Une séquence de poursuite » avec le state « premier jet ».
- [ ] La touche `n` permet de créer un troisième event entre les deux autres, avec le titre « Une séquence de fouille » avec le state « ébauche ».

### Brins

- [ ] La touche `b` doit permettre d’ouvrir le panneau des brins, avec un seul brin pour le moment : le brin par défaut.
- [ ] La touche `Enter` doit permettre de mettre le premier brin en édition (fond vert) puis :

  1. on lui donne le titre « Mon enquête policière »
  2. la touche ⇥ doit permettre de rejoindre le badge et de mettre « ENQ »
  3. la touche ⇥ doit permettre de rejoindre le type et de choisir « Accessoire »
  4. la touche ↩︎ permet de valider les données et de les enregistrer de façon persistante.
- [ ] La touche ␣ permet de cocher le brin => Le brin s’ajoute à la liste des brins de l’event courant + son badge s’affiche en bout de ligne, avant le menu de l’état.
  *Note : un débounce devrait permettre de retarder un peu l’enregistrement des données de l’event car cocher/décocher peut être fait rapidement*
- [ ] La touche ␣ permet de décocher le brin => le brin se retire de la liste des brins de l’event courant + son badge est retiré de la ligne de l’event.
- [ ] La touche `n` permet de créer un nouveau brin au-dessus (avec les données « Renoncement progressif », « RPE » en badge et « thème » pour le type. On l’enregistre.
- [ ] On peut créer un autre brin avec les données « Le personnage étrange », de type « Personnages ». TESTER AUSSI : Le badge automatique doit être « LPE ».
- [ ] On coche les deux nouveaux brins => Ils doivent s’afficher dans la ligne de l’event et s’enregistrer en persistant dans l’event (avec un débounce).
- [ ] La touche ⌘+↩︎ permet de fermer la fenêtre des panneaux.
- [ ] On revient sur le panneau des brins avec `b`. L’aide du footer doit afficher « ⌥ ↓/↑ = sélection des évènements ».
- [ ] Les combinaisons ⌥ ↓ et ⌥ ↑ permettent de sélectionner les évènements en dessous. On doit voir : 

  - la sélection de l’event courant changé (classe selected)
  - les brins se cocher/décocher en fonction de l’évènement courant (un seul doit avec les deux derniers brins).

  *(note développement : ça implique que la sélection d’un event règle le panneau des brins même lorsqu’il est caché.)*

  On choisit
- [ ] 