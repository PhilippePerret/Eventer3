# Eventer(3)

## Description 

Eventer est une application qui permet de gérer les **évènemenciers** de projets de film ou de roman. 

### Qu’est-ce un « évènemencier » ?

Un *évènemencier* est une suite d’évènements au sens anglo-saxon du terme, c’est-à-dire au sens de « quelque chose qui se passe » d’importance quelconque. Une action (*remplir un verre d’eau*) est un évènement, un dialogue est un évènement, un morceau de ce dialogue est un évènement, une séquence (*suivre une journée de cours*) est un évènement.

Un évènement a une échelle déterminé (`scale`). Par exemple, l’échelle d’un évènemencier de premier niveau est l’acte. Donc **chaque acte est un évènement** (de longue durée).

---

## Specs

### `Lister` et `Item`

`Lister` et `Item` sont à la base de tout dans l’application. Il suffit de bien décrire leur comportement pour gérer l’ensemble des types d’éléments, *projets*, *évènemenciers*, *brins* et *personnages* (pour le moment). Mais ce sont **des classes abstraites** dont vont hériter les autres classes.

Ils seront utilisés pour :

#### Les projets

`ProjectListerer` < `Lister`

`Project` < `Item`

#### Les évènemenciers 

*(« évènemenciers » au sens strict du terme)*

`EventLister` < `Lister`

`Event` < `Item`

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
		+Scale scale
		+string[] item_ids
		+string[] brin_ids
		+string[] perso_ids
		+LastsId   lasts_id
		+Options options
		+Object[] breadcrumbs
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

**`path`** est le chemin d’accès absolu au lister, pour le décrire plus précisément. ATTENTION : pour les *Lister* de type `project`, ça correspond au chemin d’accès au dossier principal du projet. Tous les autres `path` (de *Lister* ou d’*Item*) pourront être estimé par rapport à lui.

### Item

~~~mermaid
classDiagram
	class Item {
		+string id
		+string title
		+boolean hasLister
		+string color
		+boolean checked
		+number pos
		+number duration
		+string path
		+Date created_at
		+Date updated_at
	}
	

~~~

#### Notes sur les propriétés de Item

**`id`** devra être le plus court possible : `b+x` pour les brins (`b1`, `b2` etc.), `c+x`  pour les personnages, `i+x` pour les items, `l+x` pour les listers, etc.

**`color`** est la couleur hexadécimale de fond de l’item (qui déterminera aussi une couleur de police adaptée). sera surtout utile pour les brins dans un premier temps, mais devra être applicable à toutes les autres classes (Projets, Personnages, etc.).

**`pos`** permet de gérer l’ordre des éléments. Voir [gestion de l’ordre](#gestion-ordre).

**`checked`** permet de cocher l’item (coche en regard à gauche du title de l’item). C’est une donnée persistante.

**`duration`** est la durée en secondes.

**`path`** est un chemin d’accès relatif (par rapport au dossier du projet) ou absolu qui conduit au fichier de l’item (pour le décrire, le travailler, etc.).

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

En partant du prince où `nextItem` est l’item qui se retrouvera après l’élément à déplacer après le déplacement et que `prevItem` est l’item qui se retrouvera avant l’élément après déplacement, le calcul de la nouvelle position est : 

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



