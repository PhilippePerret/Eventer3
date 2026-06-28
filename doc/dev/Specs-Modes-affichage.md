# Eventer3 -  Affichage

Il existe TROIS modes d’affichage dans Eventer :

- le mode « par imbrication ». C’est le mode « naturel » où, comme dans le Finder d’un Mac en mode liste ou l’Explorer Windows, on peut « visiter » les dossiers, remonter, etc.
- le mode « par niveau ». C’est le mode où l’on voit tous les évènements (`Event`) d’un même niveau dans un listing unique.
- le mode « Total » qui permet de voir tous les events de tous les niveaux, avec une indentation indiquant l’imbrication.

Le mode courant est affiché dans la barre d’état en bas de fenêtre.

---

## Mode par imbrication

La flèche → permet « d’entrer » dans l’évènemencier de l’Event sélectionné, la flèche ← permet de « remonter » à l’évènemencier de l’event de départ.

---

Mode par niveau

Comme il n’existe pas toujours d’event du niveau demandé, l’application doit en crééer *virtuellement* pour l’affichage. On ne peut rien faire avec ces évènements qui affichent « Le title du dernier event trouvé +X » où « X » est le niveau supplémentaire qu’on a dû franchir pour aller au niveau voulu. 

Par exemple, si on : 

~~~
					NIV-1				NIV-2				NIV-3
projet 		 lister#4	 
						 e1			 lister#7
						 e2 ––––––– e8 			lister#8
						 |				  e10 ––––––	e12
						 |					e11
						 e3
						 e9
~~~

Avec l’exemple ci-cessus, si l’on demande l’affichage de niveau 1 (par exemple en sélectionnant l’event e1 et en jouant ⌘+m)

La liste des évènements affiche :

~~~
Affichage par niveau (niveau 1)
	e1
	e2
	e3
	e9
~~~

Il n’y a pas de problème ici puisque tous les events de ce niveau existe.

Mais imaginons maintenant que l’on « entre » dans l’event #2

> Note : dès qu’on « entre » dans un event, on rebascule automatiquement en mode par imbrication (par défaut). On doit donc faire à nouveau ⌘+m pour repasser en mode par niveau.

Cette fois, un problème se pose : l’event #2 possède un lister de niveau 2 (lister#7) l’évènement mais les autres évènements, e1, e3 et e9 n’en possèdent pas.

Dans ce cas-là, l’application crée des events virtuels au niveau voulu. Si les intitulés des events sont chaque fois « Event e1 », on se trouvera avec :

~~~
Affichage de niveau 2

"Event e1 +1"					<--- grisé, non sélectionnable
"Event e8"
"Event e10"
"Event e11"
"Event e3 +1"					<--- grisé, non sélectionnable
"Event e9 +1"					<--- grisé, non sélectionnable

~~~

Et si l’on passe à l’affichage de niveau 3, seul e10 possède un lister de ce niveau (lister#8), tous les autres events seront virtuels.

~~~
"Event e1  +2"					<--- grisé, non sélectionnable
"Event e8  +1"					<--- grisé, non sélectionnable
"Event e11 +1"					<--- grisé, non sélectionnable
"Event e3  +2"					<--- grisé, non sélectionnable
"Event e9  +2"					<--- grisé, non sélectionnable
~~~

> Noter le +2 pour les events qui ont dû être « montés » de deux niveau et +1 pour ceux qui se trouvaient un seul niveau en dessous.

Et si l’on monte au niveau 3, seul l’event e12 sera réel.

---

### Consolider le niveau

À tout moment, dans les situations décritent ci-dessus, l’outil « Consolider le niveau courant » permet de créer concrètement les *event*s manquants.

Si nous sommes au niveau 2 et que nous jouons l’outils « Consolider le niveau courant », des events (et des listers) sont créés pour produire ce résultat :


~~~
					NIV-1				NIV-2				NIV-3
projet 		 lister#4	 
						 |				lister#9
						 e1 –––––– e14			 
						 					lister#7
						 e2 ––––––– e8 			lister#8
						 |				  e10 ––––––	e12
						 |					e11
						 |
						 |				 lister#10
						 e3	–––––––– e15
						 |
						 |					lister#11
						 e9	––––––––– e16
~~~

Par défaut, les nouveaux events créés auront pour `title` le titre de l’event de référence avec « +x » au bout comme pour l’affichage virtuel.

L’affichage sera donc (avec tous les events éditables) :

~~~
"Event e1 + 1"
"Event e8"
"Event e10"
"Event e11"
"Event e3 + 1"
"Event e9 + 1"

~~~

Et si l’on consolide au niveau trois (*sans avoir consolider avant le niveau 2*), la table contiendra : 


~~~
					NIV-1				NIV-2				NIV-3
projet 		 lister#4	 
						 |				lister#9	lister#12
						 e1 –––––– e14	—————— e17
						 |					
						 |				lister#7 		lister#8
						 e2 ––––––– e8 ––––––– e18 			
						 |					|
						 |					|					lister#9
  					 |				  e10 ––––––	e12
						 |
						 |									lister#15
						 |					e11 ——————— e20
						 |
						 |				 lister#10	lister#13
						 e3	–––––––– e15 ——————	e18
						 |
						 |					lister#11	 lister#14
						 e9	––––––––– e16 —————— e19
~~~

Et l’affichage sera : 

~~~
"Event e1 +2"
"Event e8 +1"
"Event e12"
"Event e11 +1"
"Event e3 +2"
"Event e9 +2"

~~~

