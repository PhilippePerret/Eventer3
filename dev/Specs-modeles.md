# Eventer(3)



[TOC]



---

## Description

Eventer est une application qui permet de gérer les **évènemenciers** de projets de film ou de roman. 

### Qu’est-ce un « évènemencier » ?

Un *évènemencier* est une suite d’évènements au sens anglo-saxon du terme, c’est-à-dire au sens de « quelque chose qui se passe » d’importance quelconque. Une action (*remplir un verre d’eau*) est un évènement, un dialogue est un évènement, un morceau de ce dialogue est un évènement, une séquence (*suivre une journée de cours*) est un évènement.

Un évènement a une échelle déterminé (`scale`). Par exemple, l’échelle d’un évènemencier de premier niveau est l’acte. Donc **chaque acte est un évènement** (de longue durée).

---

## Specs

### `Lister` et `Item`

`Lister` et `Item` sont à la base de tout dans l’application. Il suffit de bien décrire leur comportement pour gérer l’ensemble des types d’éléments, *projets*, *évènemenciers*, *brins* et *personnages* (pour le moment). Mais ce sont **des classes abstraites** dont vont hériter les autres classes.

IL EST CAPITALE DE BIEN COMPRENDRE CE QUI EST DIT CI-DESSUS, que **`Lister`** et **`Item`** sont le cœur et que tout le reste n'est que classes spécialisées.

* Les projets (`ProjectLister`) est une classe spécialisée de `Lister` qui affiche les projets au départ.

  Chaque projet (`Project`) est une classe spécialisée de `Item` pour gérer chaque projet individuellement.

* Les évènemenciers (`EventLister`) est une classe spécialisée de `Lister` qui gère les évènemenciers (imbriqués ou non)

  Chaque évènemencier (`Event`) est une classe spécialisée de `Item` pour gérer chaque évènement (event).

* Les brins (`BrinLister`) est une classe spécialisée de `Lister` qui gère les brins (brins-groupe ou brins seuls)

  Chaque brin seul (ou brin-groupe) (`Brin`) est une classe spécialisée de `Item` pour gérer chaque brin.

* Les personnages (`PersoLister`) est une classe spécialisée de `Lister` qui gère les personnages (personnages-groupe ? ou personnages seuls)

  Chaque personnage seul (ou personnage-groupe ?) (`Brin`) est une classe spécialisée de `Item` pour gérer chaque personnage.

> Les brins-groupe et les personnages-groupe viennent simplement du fait que puisque toutes les listes peuvent être imbriquées, on peut avoir des imbrications aussi dans les brins et les personnages. Un brin ne serait pas un brin mais possèderait un lister de brins, donc deviendrait un « brin-groupe », par exemple le brin-groupe « Personnages » qui s’occuperait de chaque personnage — attention la confusion ici : aucun rapport entre ces personnages et les personnages de `PersoLister`).
>
> C’est plus difficile de l’imaginer pour les personnages, même si on pourrait très bien avoir un personnage-groupe « Protagonistes » avec tous les personnages qui aident le protagoniste, un personnage-groupe « Antagonistes » avec les antagonistes et un personnage-groupe « Ambivalents » avec ceux qui sont adjuvants et antagonistes.

TODO : Définir l’affichage propre à chaque type d’élément (note : c’est déjà fait dans le programme avec les projets).

##### Affichage

Sur une ligne

à gauche : `title` 

à droite : `badge`s des brins + `badge`s des persos à droite + menu `state`

#### Les brins

`BrinLister` < `Lister`

`Brin` < `Item`

#### Les personnages

`PersoLister` < `Lister`

`Perso` < `Item`

---

### `Lister`

~~~mermaid
classDiagram
	class Lister {
		+string id
		+boolean active
		+string type
		// Parmi "project", "eventer", "manuscript"
		+string nature // parmi 'roman', 'film', 'none'
		+Scale scale
		+string[] item_ids
		+string[] brin_ids
		+string[] perso_ids
		+LastsId   lasts_id
		+Options options
		+string path
		+Date created_at
		+Date updated_at
	}
	
	class LastsId {
		+number item
		+number brin
		+number perso
	}
	
	class Options {
		+boolean colorizeItemsWithFirstBrin
	}
	
	class Scale {
		<<enumeration>>
		acte
		metasequence
		sequence
		scene
		scenebeat
		atom
		text
	}
	
	Lister --> LastsId
	Lister --> Options
	Lister --> Scale
~~~

#### Notes sur les propriétés de Lister

`active` ne sert que pour les projets, pour les activer et les activer. Pour les autres *Lister*, ils sont toujours actifs

**`path`** est le chemin d’accès absolu au lister, pour le décrire plus précisément. 

<span style="color:#FF0000;">**ATTENTION : CE CHEMIN N’A RIEN À VOIR AVEC LE CHEMIN D’ACCÈS AU FICHIER DANS `/data` !!!! C’EST UN FICHIER QUELCONQUE, N’IMPORTE OÙ, DÉFINI OU PAS, QUI CONTIENT DES RENSEIGNEMENTS SUPPLÉMENTAIRES SUR L’ITEM. **</span>

ATTENTION : pour les *Lister* de type `project`, ça correspond au chemin d’accès au dossier principal du projet. Tous les autres `path` (de *Lister* ou d’*Item*) pourront être estimé par rapport à lui.

### Item

~~~mermaid
classDiagram
	class Item {
		+string id
		+string title
		+boolean hasLister
		+Type[] type
		+string color
		+boolean checked
		+number pos
		+State state
		+number duration
		+string path
		+Date created_at
		+Date updated_at
		//--- seulement brin ---
		+string badge // 3 capitales
		//--- seulement perso ---
		+string badge // 2 capitales
		+string patronyme
		+Fonction fonction
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
	
	class Type {
		<<selon class fille>>
		Classe fille Event
			dia : "Dialogue"
			act : "Action"
			des : "Description"
		Classe fille Brin
			mint : "Intrigue principale"
			aint : "Intrigue amoureuse"
			// à poursuivre
	}
	
	class Fonction {
    // (valeurs preset + custom)
    prot		: "Protagoniste"
    anta		: "Antagoniste"
    adju		: "Adjuvant/allié"
    ment		: "Mentor"
    spre		: "Sprechhund"
    // (à poursuivre)
	}
	
	Item --> State
	Item --> Type
	Item --> Fonction
	

~~~

#### Notes sur les propriétés de Item

**`id`** devra être le plus court possible : `b+x` pour les brins (`b1`, `b2` etc.), `c+x`  pour les personnages, `i+x` pour les items, `l+x` pour les listers, etc.

**`color`** est la couleur hexadécimale de fond de l’item (qui déterminera aussi une couleur de police adaptée). sera surtout utile pour les brins dans un premier temps, mais devra être applicable à toutes les autres classes (Projets, Personnages, etc.).

**`pos`** permet de gérer l’ordre des éléments. Voir [gestion de l’ordre](#gestion-ordre).

**`checked`** permet de cocher l’item (coche en regard à gauche du title de l’item). C’est une donnée persistante.

**`duration`** est la durée en secondes.

**`path`** est un chemin d’accès relatif (par rapport au dossier du projet) ou absolu qui conduit au fichier de l’item (pour le décrire, le travailler, etc.).

**`title`** pour les `Perso`s sert de « pseudo », c’est-à-dire la valeur par défaut pour l’affichage.

---

## Gestion de l’ordre

L’ordre des `Item`s dans l’affichage d’un `Lister` se gère avec leur propriété `pos` en utilisant le *Lexicographic ordering*. On donne des positions de 100 en 100 au départ.

~~~
 id    	pos
---------------
 i1 		100
 i2			200
 i3			300
~~~

En partant du principe où `nextItem` est l’item qui se retrouvera après l’élément à déplacer après le déplacement et que `prevItem` est l’item qui se retrouvera avant l’élément après déplacement, le calcul de la nouvelle position est : 

~~~javascript

let prevPos, nextPos

if ( !prevItem ) {
  prevPos = 0
  nextPos = nextItem.pos
} else if ( !nextItem ) {
  prevPos = prevItem.pos
  nextPos = prevItem.pos + 50
} else {
  prevPos = prevItem.pos
  nextPos = nextItem.pos
}

// En cas d'espace insuffisant
if ( Math.abs(nextPos - prevPos) < 2 ) {
	// TODO Il faut rationnaliser les pos
  //      et revenir ici.
  return // ?
}

let newPos = ( prevPos + nextPos ) / 2
~~~

Par exemple, si on veut placer `i2` avant `i1` : 

~~~javascript
prevPos = 0 // pas de prevItem
nextPos = 100
/* => */ newPos  = (0 + 100) / 2
~~~

Si on veut déplacer `i1` après `i2` :

~~~javascript
prevPos = i2.pos = 200
nextPos = i3.pos = 300
/* => */ newPos  = (200 + 300) / 2 = 250
~~~

### Différer l’enregistrement

Pour ne pas multiplier les enregistrement en cas de déplacement en rafale, on différera l’enregistrement persistant de la nouvelle position de l’item.

---

### Interactions

Voir [Interactions dans les Specs](Specs-general.md#interactions).



## Persistance

Les données sont enregistrées dans des fichiers `JSON` (pour permettre les modifications manuelles et les productions automatiques de projets).

L’architecture de sauvegarde des données est la suivante :

~~~bash
data/
  projects.json // <-- premier Lister
  projects/
    ├── __items.json 	// définitions des Items
    ├── __brins.json	// définitions des brins
    │									// seulement pour projet
    ├── __persos.json // définitions des personnages
    │									// seulement pour projet
    //--- et ensuite, ci-dessous, les listers d’items
    ├── <id item1>.json	// <-- lister de l’item 1
    ├── <id item1>/
          ├── __items.json 	// définitions des Items
          │		//--- les lister des items
          │		etc.
    ├── <id item2>.json	//  <-- lister de l’item 2
    ├── <id item2>/
          ├── __items.json 	// définitions des Items
          │		//--- les lister des items
          │		etc.
    │ 		etc.
    └── <id item>.json
~~~

**Les imbrications sont infinies et fonctionnent toutes de la même façon** : un `Item` (défini dans le fichier `__items.json` d’un `Lister` quelconque) qui possède par exemple l’`id` `e2133` pourra toujours posséder un `Lister` qui aura pour nom `e2133.json` et pour dossier `e2133` (pour contenir la définition de ses propres `Item`s — dans `__items.json` — et des `Lister`s de ses `Item`s) etc.

---

## Données minimales



