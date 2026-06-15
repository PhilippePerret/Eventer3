[TOC]

## Texte final

Comme on l’a dit en introduction, on peut se servir d’*EventerX* juste pour élaborer souplement la structure de son histoire.

Mais on peut également aller jusqu’à rédiger le texte final, c’est-à-dire le texte du manuscrit pour un roman ou le scénariot pour un film ou uneBD.

Pour ce faire, on doit déterminer :

- si le projet est un roman ou un film/BD,
- le niveau d’imbrication qui sera utiliser comme niveau naturel de texte final.

#### Déterminer la nature du projet

On peut le faire en jouant `t` sur le projet sélectionné dans la liste des projets. Notez qu’on peut le faire aussi tout simplement au moment de déterminer quel évènemencier va servir de texte final.

#### Déterminer l’évènemencier « final »

Ce qu’on appelle « évènemencier final » ici, c’est l’évènemencier qui sera en fait le texte lui-même, c’est-à-dire soit le texte du manuscrit, paragraphe par paragraphe, soit le texte du scénario, ligne par ligne.

- créer ses imbrications (acte, séquence, scène…) jusqu’à atteindre le niveau voulu,

- créer un premier *event* dans ce niveau voulu,

- taper `t`

- dans la fenêtre qui s’ouvre, choisissez la nature du projet si nécessaire,

- choisissez « Manuscrit » ou « Scénario » en fonction de la nature du projet,

  => l’application vous demande si ce niveau sera toujours celui du texte final

- répondez « oui » si vous voulez que tous les évènemenciers de ce niveau soient automatiquement considérés comme les textes finaux. Cela vous épargnera d’avoir à le définir pour chaque évènemencier. Et vous pourrez toujours, au cas par cas, indiquer qu’un évènemencier doit être considéré comme le texte final, même s’il n’est pas du niveau indiqué.

Vous noterez que l’affichage de votre roman ou de votre film/BD change du tout au tout, vous donnant déjà une idée de ce à quoi il ressemblera, sur une page A4 de scénario ou une page de livre.

#### Exemple concret

Imaginons que nous ayons décidé de fonctionner avec l’imbrication suivante : 

~~~
Actes → Séquences → Scènes → Temps de scène → Manuscrit
~~~

- Nous créons notre acte I en partant du projet (projet → premier évènemencier/premier *event* « Acte I »).

- nous créons sa première séquence avec `→` : « Seq A1-1 »
- nous créons sa première scène avec `→` : « Sc. A1-SQ1-1 »
- nous créons le premier temps de cette scène avec `→` : « T. A1-SQ1-S1 »
- nous créons enfin la version manuscrite de ce temps avec `→` : « C’est la toute première scène de mon roman. »
- nous allons maintenant indiquer que ce niveau sera toujours celui des versions manuscrites des évènements :
  - nous pressons  `t`
  - nous choisissons la nature « Roman » pour le projet,
  - nous choissons la nature « Manuscrit » pour cette évènencier
  - nous répondons « oui » à la question du niveau par défaut.

Nous voyons que l’affichage est alors modifié et correspond bien à celui d’un livre.

Maintenant poursuivons pour voir que le niveau est bien considéré comme le niveau des versions manuscrites en créant la première scène de l’acte 2 : 

- on remonte jusqu’à l’évèmencier des actes (affichant « Acte I »),
- nous tapons `n` pour créer un nouvel *event* en dessous de « Acte I »,
- nous tapons « Acte II »,
- `→` puis « SQ.1 A2 »
- `→` puis « SC.1 A2-SQ1 »
- `→` puis « T.1 A2-SQ1-S1 »
- `→` puis « C’est la première scène de l’acte 2 de mon roman »

Vous noterez que ce dernier texte s’est automatiquement mis en version manuscrit.

Poursuivons en imaginant un cas, dans notre roman, où nous devons fonctionner autrement : nous avons une scène tellement courte qu’elle ne nécessite pas de 

