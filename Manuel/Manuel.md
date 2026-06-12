# Manuel Eventer

NOTE POUR CLAUDE : TU N’AS PAS À LIRE CE FICHIER

[TOC]

---


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