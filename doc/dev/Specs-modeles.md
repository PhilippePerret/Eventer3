

#  Eventer(3)



[TOC]



## Item

~~~
classDiagram
	class Item {
		+string id
		+string title
		+string lister_id
		+Type[] type
		+string color
		+boolean checked
		+number duration
		+string path
		+Date created_at
		+Date updated_at
	}
	
	class State {
    0 : "---"
    1 : "ébauche"
    2 : "développement"
    3 : "premier jet"
    4 : "réécriture"
    5 : "achèvement"
    6 : "à corriger"
    7 : "correction"
    8 : "à relire"
    9 : "achevé"
  }
	
	class BrinType {
			mint : "Intrigue principale"
			aint : "Intrigue amoureuse"
			// à poursuivre
	}

	class EventType {
			dia : "Dialogue"
			act : "Action"
			des : "Description"
	}
	
	class Fonction {
    // (valeurs preset + custom)
    pro		: "Protagoniste"
    ant		: "Antagoniste"
    adj		: "Adjuvant/allié"
    men		: "Mentor"
    spr		: "Sprechhund"
    // (à poursuivre)
	}
	
	class Effet {
		j: jour
		m: matin
		o: midi
		s: soir
		n: nuit
	}
	
	class Event {
		+EventType type
		+string meteo
		+Effet effet 
		+string dyndate
		+State state
		+boolean isScript // version finale
	}
	
	class Project {
		+State state	
	}
	
	class Perso {
		+PersoType type
		+string2 badge // caps
		+string patronyme
		+string avatar
		+Fonction fonction	
	}
	
	class PersoType {
		p: "Protagonistes, Adjuvant…"
		a: "Antagonistes"
		b: "Ambivalent"
	}
	
	class Brin {
		+BrinType type
		+string3 badge // caps	
	}
	

	Item --> Type
	Item --> Perso
	Perso --> Fonction
	Perso --> PersoType
	Event --> State
	Event --> EventType
  Item --> Brin
  Brin --> BrinType
	Item --> Project
	Project --> State
	Item --> Event 
	Event --> Effet
	

~~~

#### Notes sur les propriétés de Item

Voir les [erreurs fréquentes](Erreurs-frequentes.md)

**`id`** devra être le plus court possible : `b+x` pour les brins (`b1`, `b2` etc.), `c+x`  pour les personnages, `i+x` pour les items, `l+x` pour les listers, etc.

**`color`** est la couleur hexadécimale de fond de l’item (qui déterminera aussi une couleur de police adaptée). sera surtout utile pour les brins dans un premier temps, mais devra être applicable à toutes les autres classes (Projets, Personnages, etc.).

**`checked`** permet de cocher l’item (coche en regard à gauche du title de l’item). C’est une donnée persistante.

**`duration`** est la durée en secondes.

**`title`** pour les `Perso`s sert de « pseudo », c’est-à-dire la valeur par défaut pour l’affichage.

**`meteo`**. Donnée propre aux évènements qui permet de définir la météo, c’est-à-dire le temps particulier qu’il fait au moment de l’event, si cela doit joue. Fonctionne de paire avec l’`effet` pour produire par exemple une couleur de fond.

**`effet`**. Comme dans un intitulé de scénario, le « nuit » ou « jour », étendu à « matin », « midi », « soir ».

**`dyndate`**. La *date dynamique* pour pouvoir gérer les dates dans l’histoire. Permet de définir des dates comme « trois jours après l’explosion » ou « D1 + 10d ». À l’heure où ces lignes sont écrites, le format n’est pas encore défini, mais il y a de fortes chances que ce soit défini par « D1 = 30/05/2026 » puis des choses comme `D1-10d` ou `explosion=29/05/2026` puis `explosion+2w` (pour « deux semaines après l’explosion ».

<a name="niveaux-imbrication"></a>

---

## Niveaux d'imbrication de mode par niveau

Le *niveau d’imbrication* d’un item (pour le moment, seulement pour le `Item` de type `Event` dépend de sa profondeur à l’intérieur des `Lister`s du projet. Voilà ci-dessous un exemple de projet simple avec plusieurs imbrications :

~~~
		NIVEAU
			N1			N2		N3		N4

projet
	│
	├── Act 1
	│			│
	│			├── Seq 1.1
	│			│			│
	│			│			├── Scene 1.1.1
	│			│			│			│
	│			│			│			├── BScen 1.1.1.1
	│			│			│			└── BScen 1.1.1.2
	│			│			│			
	│			│			├── Scene 1.1.2
	│			│			└── Scene 1.1.3
	│			│
	│			├── Seq 1.2
	│			│			│
	│			│			└── Scene 1.2.1
	│			│
	│			├── Seq 1.3
	│			│			│
	│			│			├── Scene 1.3.1
	│			│			└── Scene 1.3.2
	│			│
	│			└── Seq 1.4
	│
	├── Act 2
	│			│
	│			├── Seq 2.1
	│			│			│
	│			│			└── Scene 2.1.1
	│			│
	│			└── Seq 2.2
	│			 			│
	│			 			└── Scene 2.2.1
	│
	├── Act 3
	│			│
	│			├── Seq 3.1
	│			│			│
	│			│			├── Scene 3.1.1
	│			│			└── Scene 3.1.2
	│			│
	│			├── Seq 3.2
	│			│
	│			├── Seq 3.3
	│			│			│
	│			│			└── Scene 3.2.1
	│			│
	│			├── Seq 3.4
	│			│
	│			├── Seq 3.5

~~~

On déduit de ce projet que : 

- tous les Actes (`Act x`) on un niveau d’imbrication de 1 (« premier niveau » d’imbrication)
- toutes les séquences (`sequence x.y`) ont un niveau d’imbrication de 2.
- tous les scènes (`scene x.y.z`) ont un niveau d’imbrication de 3.
- etc.

C’est simple comme ça parce qu’on a pris des noms évocateurs (acte, séquence, scène), mais on n’est obligé de rien dans ***Eventer***, on peut donc se retrouver avec des noms très différents de ceux-là.

#### Affichage normal (ou « par imbrication »)

Le mode d’affichage normal ou par imbrication fonctionne comme les dossiers et fichiers dans le Finder d’un Mac : on rentre dans un dossier et l’on voit ses éléments. Si un élément est un dossier, on peut alors entrer dedans de la même manière et l’on voit ses éléments.

> Dans Eventer, on « rentre dedans » avec la touche → comme cela est décrit dans la section [Fonctionnement spécial de « l’entrée dans »](#fonctionnement-entrer-dans).

#### Affichage en mode de niveau

Contrairement au mode d’affichage normal décrit ci-dessus, le l’affichage par mode de niveau (ou simplement ***affichage par niveau***) affiche l’intégralité des items s’un même niveau d’imbrication, avec la règle suivante : 

**RÈGLE : Si aucun item n’existe pour le niveau donné, c’est l’item du niveau supérieur (*) qui est affiché**

*(\*) donc de numéro d’imbrication inférieur.*

Cette règle est capitale pour que l’intégralité du projet soit représenté. 

> Une marque sur l’affichage de l’item indiquera cette exception (un signe particulier au début du nom.)

Par exemple, si nous reprenons le projet donné en exemple ci-dessus et que nous voulons afficher le Lister complet de niveau 3 (scène), nous obtiendrons la liste : 

~~~
Scene 1.1.1
Scene 1.1.2
Scene 1.1.3
Scene 1.2.1
Scene 1.2.1
Scene 1.3.2
+Seq 1.4
Scene 2.1.1
Scene 2.2.1
Scene 3.1.1
Scene 3.1.2
+Seq 3.2
Scene 3.2.1
+Seq 3.4
+Seq 3.5
~~~

#### Changement du mode d’affichage

On bascule d’un mode d’affichage à l’autre avec le raccourci ⌘ `m` (« m » comme « mode »).

Le mode est affiché en permanence dans la barre d’état en bas de fenêtre.

### Gestion de la profondeur

La facilité de l’affichage par niveau repose sur le fait que la profondeur (N1, N2, etc.) est persisté par la propriété `depth`.

Mais cette propriété a un cout : elle oblige à calculer cette profondeur `depth` à chaque changement de profondeur (ce qui peut arriver souvent en fonction de l’utilisation de l’Eventer.

1. `depth` doit devenir une propriété de `Lister` (table `listers`)

