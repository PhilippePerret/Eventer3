# Manuel Eventer

NOTE POUR CLAUDE : TU N’AS PAS À LIRE CE FICHIER

[TOC]

## Présentation générale

### Gérer la structure de son histoire

***EventerX*** est un application permettant de gérer efficacement la structure de son film ou de son roman en gérant ses *évènements* ou *event*.

### De la structure au texte final

Et c’est justement l’imbrication de tous ces évènements qui permet de non seulement travailler la structure mais d’aller également, à l’intérieur même de l’application, jusqu’au texte final du roman ou du scénario, sans même s’en apercoir.

---

## Premiers pas

### Création du premier projet

Pour créer un nouveau projet dans *EventerX*, il faut un dossier de projet. Vous pouvez le créer à l’intérieur même de l’application, donc procédons ainsi.

- Lancer l’application,

  => La liste des projets s’ouvre (un seul si c’est le premier lancement)

- tapez « n » comme « nouveau »

  => une fenêtre vous permet de choisir votre dossier de projet.

- rejoignez le dossier dans lequel vous désirez développer votre projet,

- tapez « n » pour créer le dossier

  => un champ de saisie vous permet d’entrer le nom du projet

- tapez le nom puis ↩︎

  => Vous venez de créer votre premier projet dans *EventerX* !

Vous pouvez poursuivre la découverte ci-dessous.

### Premier évènemencier

On pourrait imaginer de n’avoir qu’un seul évènemencier par projet. Mais cela signifierait que pour un scénario, qui compte entre 2000 et 4000 évènements en moyenne, on aurait dans la même page ces 4000 évènements. Pourquoi pas ? mais difficile de s’y retrouver et difficile de procéder à des déplacements de pans entiers de l’histoire.

Nous allons plutôt tabler sur une imbrication raisonnable (il faut savoir composer entre trop d’imbrications et trop peu, vous vous en apercevrez vite). Nous allons adopter une grande découpe en actes (5 actes dans notre roman), une sous-découpe en chapitres et ensuite en scènes.

~~~
roman
	Acte I
		Séquence 1..5
	Acte II
		Séquence 6..9
	Acte III
		Séquence 10..14
	Acte IV
		Séquence 15
	Acte V
		Séquence 16..18
~~~

Chaque séquence, de 1 à 18, aura de la même manière ses propres scènes.

Nous allons par exemple créer les scènes de la séquence 8 de l’acte 2.

- Lancer l’application,

- entrer dans votre projet en sélectionnant son nom avec les flèches ↓↑ et en cliquant sur la flèche → (vous pouvez mémoriser ces touches car ce seront les mêmes pour tous les panneaux d’*EventerX*, qui se pilote entièrement au clavier, sans aucune nécessité de la souris),

  => votre premier event est en édition (fond vert) et attend son titre,

- tapez « Acte II » dans le champ puisque c’est l’acte que nous voulons travailler,

- tapez ↩︎ pour confirmer

  => vous venez de créer votre premier event !

- à nouveau, jouer → qui vous permettra d’entrer dans cet acte,

  => le premier *event* de l’acte se crée automatiquement

- tapez « Séquence 8 » puis ↩︎ puisque c’est cette séquence que nous voulons travailler,

- à nouveau, jouer → qui vous permettra d’entrer dans cet acte,

- jouez ← juste pour voir qu’on remonte d’un niveau avec cette touche,

-  →  et l’on crée la première scène voulue, qu’on appellera « Scène d ‘introduction de la séquence 8 », ↩︎ pour l’enregistrer

- jouez « n » pour en créer une autre en dessous et validez-la avec ↩︎,

- et puis « ⌥ + n » pour créer la prochaine scène au-dessus de la scène courante.

Bravo vous venez de créer votre premier évènemencier avec plusieurs items, plusieurs *events*.

<a name="events"></a>

---

## Les évènements

### Définition

Un *event*, c’est :

- un acte,
- un dialogue,
- une action,
- une séquence,
- une description,
- etc.

Tout est *event*, dans une histoire, ou « une histoire est une suite d’event » qui ont des échelles différentes. Les échelles, c’est par exemple :

- L’histoire, c’est une exposition (event 1), une première partie de développement (event 2), une deuxième partie de développement  (event 3) et un dénouement (event4).
- L’histoire, c’est une première séquence (event 1), une seconde séquence (event 2), une séquence 3 (event 3), une séquence 4 jusqu’à une séquence 32 (event 32).
- L’histoire c’est la scène 1, la scène 2, … la scène 68, qui sont chacune des events à l’échelle de la scène.
- L’histoire, c’est aussi chaque paragraphe, qui peut être un *event* lui aussi.
- Ou l’histoire c’est chaque ligne du scénario, donc chaque action, chaque description et chaque dialogue.

***EventerX*** permet de gérer tous ces évènements par imbrication, comme des dossiers dans des dossiers dans des dossiers.



L’affichage le plus naturel de *EventerX*, c’est l’affichage d’un évènemencier, donc d’une liste d’*events*.

### Déplacement des events

On se sert de `⌘↓` et `⌘↑`  comme dans tout panneau.

### Définition des brins de l’event

* sélectionner l’*event*

* presser « b » (comme « brin »)

  => le [panneau des brins][] s’ouvre.

* dans la fenêtre des brins, cocher les brins à prendre, décocher ceux à retirer (si l’*event* en possédait déjà),

* pour créer de nouveaux brins, voir [Création d’un brin][].

<a name="brins"></a>

---

## Les brins

<a name="brin-definition"></a>

---

### Définition

Le type de *brin* le plus simple à comprendre est le type « intrigue ». Une histoire, la plus simple soit-elle, mêle, autour d’une intrigue principale (et souvent une intrigue amoureuses) de multiples intrigues plus ou moins importantes. Chacune est appelée un « brin » dans le cadre d’*EventerX*.

Pourquoi le terme « brin » au lieu d’« intrigue » ? Tout simplement parce que le terme d’intrigue est trop limitatif. Un brin peu concerner bien d’autres choses qui se développent dans une histoire. Par exemple : 

- l’évolution de la relation entre deux personnages peut faire l’objet d’un *brin*,
- l’utilisation d’un accessoire particulier peut faire l’objet d’un *brin*,
- le développement de tous les thèmes de l’histoire peuvent aussi faire l’objet de *brins*,
- etc.

Vous voyez que leur usage est multiple. 

---

### Avantage des brins

L’avantage des [brins][] dans *EventerX* est de permettre de se concentrer spécifiquement sur un aspect de l’histoire en l’isolant de tout le reste. Vous pouvez par exemple : 

- afficher toutes les scènes qui concernent la relation entre deux personnages,
- afficher toutes les moments de scènes où un certain accessoire est utilisés,
- afficher tous les dialogues où le thème principal de l’histoire est développé,
- etc.

Mais si vous utilisez aussi les brins pour prendre des notes ou des choses à faire, vous pouvez obtenir une liste complète ou partielle de ces points.

<a name="brins-panel"></a>

---

### Panneau des brins

Lorsque le panneau des brins est affiché, on peut continuer de choisir les évènements en dessous à l’aide du raccourci ⌥+↑ et ⌥+↓.

<a name="brin-create"></a>

---

### Créer un brin

- Ouvrir la [fenêtre des brins][] en pressant « b » (comme « brin ») sur un event,

  => la fenêtre des brins s’ouvre

- sélectionner le brin après lequel mettre le nouveau brin,

- presser « n » (comme « nouveau »,

- entrer le titre du brin,

- se déplacer de propriété en propriété avec ⇥ pour les régler

- valider le nouveau brin avec ↩︎.

---

## Les personnages

### Créer un personnage

- Ouvrir le [panneau des personnages][] avec la touche « p » (comme « personnage »),



### Choisir les personnages du brin

---

### Choisir les personnages de l’event

Il est préférable d’associer des personnages aux brins (de cette manière, les *events* de ce brin contiennent automatiquement les personnages de leurs brins) mais il est tout à fait possible, exceptionnellement d’associer un personnage à un event isolé.

- sélectionner l’*event* en question,
- presser « p » pour ouvrir le [panneau des personnages][],
- cocher les personnages voulus et décocher ceux à retirer.



---

<a name="persos-panel"></a>

---

### Le panneau des personnages

Ce panneau présente et permet de gérer la liste des personnages du projet, en leur attribuant un pseudo, un badge de deux lettres (utilisable dans les textes pour les raccourcir et surtout se donner la possibilité de changer leur nom), un avatar, des fonctions, etc.

Pour ouvrir ce panneau, se placer sur un *event* quelconque, et presser la touche « p » (comme « personnage »).

Pour connaitre les choses possibles sur ce panneau, ouvrez-le et tapez la combinaison magique « 





---

## Aspect

### Aspect des items

L’application possède une grande variété de moyens pour modifier l’aspect de l’affichage des items. Cela donne le moyen d’utiliser les items non pas comme évènements mais comme système de notation. On peut par exemple régler facilement un style pour annoter un texte ou le questionner.

### Style des events

On peut styliser les events grâce aux fichiers se trouvant dans le dossier `data/theme`. Il suffit d’ajouter un fichier CSS dans ce dossier pour que ses classes puissent être appliquées aux évènements (*event*).

Propriétés sur lesquelles on peut jouer :

| Propriété     | Effet                                                        |
| ------------- | ------------------------------------------------------------ |
| `font-size`   | Modifie la taille du texte (12px, 7pt, 5em, etc.)            |
| <span style="white-space:nowrap;">`margin-left`</span> | Définit la marge gauche.                                     |
| `margin-top`  | Définit la marge haute (espace entre le paragraphe et le paragaphe précédent). |



---

## Références

### Liens vers d’autres éléments

*EventerX* a un système de cible très particulier et très souple. L’idée principale, c’est qu’on récolte les sources dont on a besoin et l’on colle ensuite, où on le désire, les liens vers ces sources.

Imaginons que j’ai un dossier « Notes » en dernier *event* de mon projet. J’organise souvent mes projets comme ça : 

~~~
Acte I
Acte II
Acte III
---------				<- c'est vraiment un event
Notes
~~~

Dans « Notes », je mets toutes les notes concernant le projet, que je peux classer en sous-dossiers si c’est un gros projet avec plein de notes :

~~~
Notes
	Notes sur personnages
	Notes sur intrigues
	Notes sur décors
	etc.
~~~

Et donc, à un moment donné, je peux avoir besoin de récupérer 4 notes (2 sur les personnages et 2 sur les intrigues) pour les placer dans un évènement où elles me seront utiles. Pour faire ça, c’est très simple : 

- je rejoins chaque note l’une après l’autre,

- quand je suis dessus, je clique sur « k » pour la mémoriser comme cible,

- je rejoins l’event où je veux faire un lien,

- j’édite sont texte (touche ↩︎),

- je place le curseur à l’endroit où je veux insérer les renvois,

- je joue ⌘+k

  => La fenêtre des cibles s’ouvre, où je peux voir mes derniers choix

- je me déplace avec les flèches pour choisir la première note,

- je joue ↩︎ pour l’insérer,

- je modifie le texte de la cible si nécessaire,

- je répète la même opération pour les 3 autres notes

- je valide l’édition avec ↩︎

  => le texte affiche maintenant mes liens vers les notes

### Rejoindre ou afficher une référence

À partir d’ici, j’ai trois moyens pour interagir avec ces liens :

- soit je ne fais qu’afficher la note (en jouant ⇥ jusqu’à sélectionner le lien puis sur « a » pour l’afficher)
- soit je rejoins la note (⇥ puis « g » comme « go ») — je quitte donc l’évènemencier dans lequel je me trouve, quand je dois par exemple éditer la note,
- soit j’affiche la note dans l’autre fenêtre (⇥ pour sélectionner le lien, « w » pour afficher dans l’autre fenêtre)

---

[Création d’un brin]: #brin-create
[fenêtre des brins]: #brins-panel
[ panneau des brins ]: #brins-panel
[panneau des personnages]: #persos-panel
[brins]: #brins
[brin]: #brins
[events]: #events
[event]: #events
[évènement]: #events
[évènements]: #events