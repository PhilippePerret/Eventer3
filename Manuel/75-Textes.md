[TOC]

## Les Textes

### Aspect

On peut déterminer l’aspect général du texte des évènemenciers en modifiant le style par défaut des *event*. Pour le moment, ça se fait en éditant le fichier `data/themes/default.css`. Vous pouvez modifier la police et la taille des *events.*

On peut également, dans ce dossier `data/themes`, définir tous les styles que l’on veut, qui seront applicable ensuite sur les *events*. Noter ici que l’application s’écarte à ce niveau des traitements de texte conventionnels où l’on ne peut appliquer qu’un seul style à un paragraphe. Ici, on peut en appliquer autant qu’on veut, en sachant que le dernier a toujours raison concernant les caracéritiques communes : si deux styles définissent la taille de la police, c’est toujours la taille du dernier style appliqué qui l’emportera. C’est la raison pour laquelle on peut définir l’order des styles.

#### Appliquer un style à un event

- Ouvrir la fenêtre des styles en tapant `s` alors que l’*event* est sélectionné,
- choisir les styles voulus en les cochant/décochant (avec `␣` ou `↩︎`),
- déplacer si nécessaire les styles avec `⌘↓` et `⌘↑`
- confirmer en fermant la fenêtre avec `⌘ + ↩︎`

---

### La constantes

Vous pouvez utiliser des constantes dans le texte qui permettront de remplacer automatiquement un texte par un autre. Par exemple, typiquement, si vous ne connaissez pas encore le nom de la ville où se déroule l’histoire, plutôt que d’avoir à la remplacer partout une fois que vous l’avez trouvée, utiliser le texte « VILLE » dans les textes, dans les constantes, dites que « VILLE » doit être remplacé provisoirement par « Amiens ». Il sera écrit « Amiens » chaque fois, mais une fois que vous aurai opté pour la ville, il vous suffira de remplacer la valeur de la constante « VILLE » pour la changer dans tous les textes.

Une autre utilisation classique que la constante permet de se simplifier l’écriture. Au lieu d’écrire « le Capitaine de Gendarmerie » partout, on définit que la lettre « C » toute seule dans le texte sera remplacé par « le Capitaine de Gendarmerie » et le tour est joué. On tape partout « C » et le texte sera le bon.

> Notez cependant que cette utilisation n’est pas pertinente dans le sens où cette fonctionnalité existe déjà pour les personnages grâce aux [badges](05-Persos.md#badge).

### Panneau des constantes

Presser la touche ` q` pour ouvrir le panneau

Définissez toutes les constantes que vous voulez et leur valeur.

#### Expressions rationnelles

Si vous connaissez les expression rationnelles (ou « régulières ») vous pouvez les utiliser ici, simplement en entourant la consante de « / ». Vous pouvez faire référence aux groupes de captures avec « $ ».

Par exemple :

~~~
Constante				Remplacer par…

/ville(s?)/			village$1				"des villes" => "des villages"
																"ville" => "village"
~~~



Sans vous y connaitre en expressions régulières, vous pouvez essayer de les utiliser juste en sachant que :

- un point veut dire « n’importe quel caractère »
- un point d’interrogation signifie « avec ou sans ce qui précède (la lettre ou le groupe entre parenthèses »
- quand vous mettez quelque chose entre parenthèses, vous créez un groupe que vous pouvez utiliser ensuite dans le groupe de remplacement avec la lettre « $ »

Par exemple, imaginons qu’il y ait des « X23 » dans les textes (toujours avec deux chiffres seulement) et qu’on veuille les remplacer par « A23 » (« A » avec le nombre qu’on trouve avec « X »). 

On va alors mettre en constante et en valeur : 

~~~
Constante 		Remplacer par…
/X(..)/				A$1
~~~

- les deux « / » au début et à la fin indiquent que c’est une expression rationnelle (obligatoire)
- elle va commencer par chercher un segment de texte qui commence par « X »
- un X suivi de deux caractères quelconques (les deux points) qui seront capturés.

Et enfin, « A$1 » signifie : « écrire A et remplacer $1 par le premier groupe entre parenthèses ».

Alors bien sûr, cette expression est fragile car elle replacera « EXTRÊME » par « EATRÊME »