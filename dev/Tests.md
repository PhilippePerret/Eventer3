# Eventer - tests à faire

[TOC]

## Classe abstraite Lister

- [x] S’assurer que la classe JS `Lister` existe et qu’on peut instancier un objet d’une classe qui en hérite.

- [x] S’assurer que la classe JS `Item` existe et qu’on peut instancier un objet d’une classe qui en hérite.

- [x] S’assurer que la méthode `Lister.sortItems` existe et qu’elle classe bien les items fournis.

- [ ] Dans un lister quelconque, on peut cocher les éléments (Projets, Brins, Events, Persos…). Mais quand on fait un couper ou un coller, il y a deux comportemen différents : SI des éléments sont cochés, ce sont eux ET SEULEMENT EUX (pas l’item sélectionné) qui sont considérés. SI en revanche aucun item n’est coché, c’est l’item sélectionné qui est considéré/traité. Faire l’essai par exemple avec couper-coller

- [ ] En revanche, supprimer (`Delete` sans la touche `Shift`) supprime seulement l’item sélectionné. Deux essais : 1) `Delete` seul => supprimer l’item sélectionné. 2)  `Shift`+`Delete` => supprime les items cochés (mais PAS celui sélectionné, SAUF s’il est coché, évidemment !

- [ ] La touche ← permet de revenir au Lister « parent » (s’il existe évidemment, donc un test avec un Lister qui a un parent et un avec un Lister qui n’a pas de parent.

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

- [x] S’assurer que la touche « n » permet de créer (provisoirement juste dans le DOM) un nouveau projet SOUS la sélection (LIRE LES FICHIERS DE SPECS POUR VOIR LES CARACTÉRISTIQUES DES CRÉATIONS D’UN ITEM, RADICALEMENT DIFFÉRENT ENTRE LES PROJETS ET LES EVENTS, BRINS OU PERSOS).

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

- [ ] S'assurer que le premier item d'un évènemencier est toujours sélectionné
- [ ] S'assurer que les flèches haut/bas permettent de sélectionner les évènements successifs
- [ ] S'assurer que la touche Space permette de cocher plusieurs évènement.
- [ ] S'assurer que la coche est persistante (cocher plusieurs évènements et recharger l'évènemencier : les mêmes évènements doivent être cochés)

## Event

- [ ] Un event affiche : son `title`, les badges de ses brins, les badges de ses personnages (personnages propres + personnages de ses brins) et le menu `state`
  \+ glisser la souris sur les badges (perso et brin) affiche leur `title` complet (avec un système propre à l’application, plus gros et plus rapide que l’attribut `title` de l’objet DOM.
- [ ] On doit pouvoir mettre un Event en édition pour modifier de façon persistante sont `title` et son `state`.
- [ ] La combinaison ⌘+`c` permet de copier l’item (toutes ses propriétés SAUF son id)
- [ ] La combinaison ⌘+`x` permet de couper l’item (toutes ses propriétés MÊME son id)
- [ ] La combinaison ⇧+⌘+`c` permet de copier tous les items cochés (toutes leurs propriétés sauf leur id). Faire un test avec l’élément sélectionné coché (il est pris aussi) et un test avec l’élément sélectionné non coché (il n’est pas pris).
- [ ] La combinaison ⇧+⌘+`x` permet de couper tous les items cochés (toutes leurs propriétés MÊME leur id). Faire un test avec l’élément sélectionné coché (il est coupé aussi et pris) et un test avec l’élément sélectionné non coché (il n’est pas considéré.
- [ ] La combinaison ⌘+`v` permet de coller l’item (toutes ses propriétés MÊME son id) au-dessus de l’item sélectionné. Faire aussi le test avec **plusieurs** items copiés ou coupés.
- [ ] La combinaison ⌘+`v` permet de coller l’item au-dessus de l’item sélectionné **même dans un autre panneau** (essayer forcément avec les évènemenciers). Faire aussi le test avec **plusieurs** items copiés ou coupés.
- [ ] Un event peut définir sa météo (`meteo` ☀️🌤️🌦️☁️💨⛈️🌪️🌨️) dans un mini panneau qui contient aussi l’effet.
- [ ] Un event peut définir son effet (`effet`) pami « jour », « nuit, etc. Voir les valeus possibles et les vraies valeurs dans la données `EFFETS`.
- [ ] La météo et l’effet d’un event influence son apparence (si l’option du Lister le demande => flag du Lister)
- [ ] Un event peut définir sa date `dyndate` de façon fixe (en lui donnant un nom fixe).
- [ ] Test unitaire du calcul de la date dynamique.
- [ ] Un event peut définir sa date `dyndate`de façon dynamique.
- [ ] Si on choisit pour l’Event un personnage qui lui appartient déjà par le biais d’un brin, on signale une erreur et on ne le permet pas.

### Brin

- [ ] En édition, avec la touche `Tab`, on doit pouvoir modifier, dans l’ordre : le `title`, le `badge`, le `type` et la `color` du brin.
- [ ] Le choix de la couleur du brin doit modifier l’affichage des events qui l’ont en premier brin si l’option de l’EventLister le demande (choix entre fond = premier brin ou fond = climat).

### Panneau des brins

- [ ] À l’ouverture du panneau, seuls les brins de l’event sélectionné devraient être cochés.



### Project

- [ ] On ne peut plus redéfinir un `id` de projet une fois qu’il a été défini(i.e. une fois que son `Lister` existe (et donc une fois que son dossier `lof` existe.



## Options application

- [ ] S’assurer que si l’option `open-with-project-list` est active, c’est la liste des projets qui est affichée. S’assurer que si l’option `open-with-project-list` est `false`, c’est la dernier évènemencier qui est ouvert OU la liste des projets si aucun dernier évènemencier n’est défini.

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