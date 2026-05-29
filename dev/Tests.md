# Eventer - tests à faire

## Classe abstraite Lister

- [x] S’assurer que la classe JS `Lister` existe et qu’on peut instancier un objet d’une classe qui en hérite.

- [x] S’assurer que la classe JS `Item` existe et qu’on peut instancier un objet d’une classe qui en hérite.

- [x] S’assurer que la méthode `Lister.sortItems` existe et qu’elle classe bien les items fournis

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

- [ ] S’assurer que la flèche droite permet de RENTRER dans le projet (c’est-à-dire de voir son premier évènemencier — qui correspond à ses `events`) (idem = valable pour n’importe quel lister)

- [ ] S’assurer qu’un nouveau projet créé entraine bien aussi la création d’un premier évènemencier (`i1`), un premier brin (`b1` de title « Intrigue principale ») et un premier personnage (`p1` de title « Protagoniste »).

- [ ] S’assurer que la flèche gauche permet de revenir à la liste des projets (idem = valable pour n’importe quel lister)

- [ ] S’assurer que le déplacement des projets est persistant (idem = valable pour n’importe quel lister)

- [ ] S’assurer que la touche Enter permet de modifier le titre du projet courant ((idem = valable pour n’importe quel lister))

- [ ] S’assurer que la modification du titre est bien persistante (Ça doit être le cas pour tous les lister)

- [ ] S’assurer que lorsqu’un item ne peut pas être placer entre deux items de `pos` consécutifs (ex : `pos:123` et `pos:124`), tous les `pos` (où seulement ceux qui posent problème ?) sont re-initialisés à une valeur correcte.

## Évènemencier

- [ ] S'assurer qu'un évènemencier s'affiche bien en fonction des `pos` de ses items.
- [ ] S'assurer que le premier item d'un évènemencier est toujours sélectionné
- [ ] S'assurer que les flèches haut/bas permettent de sélectionner les évènements successifs
- [ ] S'assurer que la touche Space permette de cocher plusieurs évènement.
- [ ] S'assurer que la coche est persistante (cocher plusieurs évènements et recharger l'évènemencier : les mêmes évènements doivent être cochés)
- [ ] Création d'un nouvel item. S'assurer que "n" permet de mettre un nouvel évènement en édition (sans le créer vraiment encore). Puis taper du texte et s'assurer que Enter permet de créer vraiment l'item. S'assurer que la donnée est bien enregistrée.
- [ ] Annulation de la création d'un nouvel item. S'assurer que "n", pause, Enter, ne crée pas un nouvel item.