# Eventer3 — Import/export

On doit définir la forme des imports et des exports pour pouvoir créer de façon programmatique des projets.

Il faut simplement un moyen de définir la sortie/entrée, en adoptant tous les formats possibles : 

*Quand je parle de « données du projet » ci-dessous, je parle des events, brins, personnages, styles, etc.), de tout ce qui se trouve dans la base `eventer.db` du projet* 

- JSON
- YAML
- CSV
- Une base sqlite conforme (c’est la forme actuelle, pour tous les projets).
- format propre, simplifié ?

### Essai format

Note : les imbrications peuvent se définir très simplement, par imbrication :

~~~yaml
---
# -- Données générales du projet
title: Mon projet à importer
type: roman
# -- Tous ses events --
events:
	- title: "Acte I"
		type:	action
		brins: [b1, b3]
		persos: [p2]
		events:
			- title: "Séquence 1"
			- title: "Séquence 2"
				events: 
				- title: "Première scène de seq1"
				- brins: [] # hérite forcément de b1 et b3
	- title: "Acte II"
	- title: "Acte III"
# -- Définition de tous les brins du projet --
brins:
	b1:
		title: "Mon premier brin
		persos: [p1]
		badge: "BR1"
# -- Définition de tous les personnages du projet --
persos:
	p1:
		pseudo: "Mon protagoniste"
		patronyme: "Marion MICHEL"
		avatar: "🕵🏻‍♀️"
		badge: "MM"
		
~~~

### Essai de format propre léger

*(la force de ce format tient à la définition personnalisée des propriétés définies, comme dans un fichier csv (c’est d’ailleurs un fichier CSV avec des délimiteurs « | »)*

~~~
PROJECT
#id-projet|title|type
mon-projet|Mon beau projet|roman
#-----------------------------------------
EVENTS
#-----------------------------------------
# Liste customisable des propriétés
# title|brins|persos|meteo|effet|lieu|date
#-----------------------------------------
Acte I|b1,b2|p1,p2|ps|jr
	Séquence 1 de acte I|p2
		Scène 1 de Seq1 de Acte I
		Scène 2 de Seq1 de Acte I|b4
	Séquence 2 de acte I
Acte II
	Séquence 1 de acte II
	Séquence 2 de acte II
# ------------------------------------------#
PERSOS
# ------------------------------------------#
# Liste cusomisable des propriétés
# id|pseudo|badge|
# ------------------------------------------#
p1|Marion|MM
p2|Phil|PH
# ------------------------------------------#
BRINS
# ------------------------------------------#
# Données des brins
# ------------------------------------------#
# Liste customisable des propriétés
# id|title|type|color
# ------------------------------------------#
b1|Mon premier brin|intrigue|ffffff
b2|Autre brin accessoire|accessoire|CCFFFF
# ------------------------------------------#
STYLES
# ------------------------------------------#
# Liste customsable des propriétés
# id|font-size|color|margin-left
# ------------------------------------------#
gros|42px|brown|10vw
note|9px|blue|50%
note!|11px|red|10%

~~~

Sans autre précision de titre (PROJET, BRINS, EVENTS) le fichier est considéré comme définissant seulement des events. Par exemple :

~~~
#-----------------------------------------
# Liste customisable des propriétés
# title|brins|persos|meteo|effet|lieu|date
#-----------------------------------------
Acte I|b1,b2|p1,p2|ps|jr
	Séquence 1 de acte I|p2
		Scène 1 de Seq1 de Acte I
		Scène 2 de Seq1 de Acte I|b4
	Séquence 2 de acte I
Acte II
	Séquence 1 de acte II
	Séquence 2 de acte II

~~~



### Import partiel

*Partiel* a deux sens ici :

- seulement les brins, ou les styles d’un autre eventer,
- seulement un segment d’event, un lister d’events.

On doit pouvoir importer partiellement n’importe quelle donnée. À commencer par les styles, qu’on pourra imporer d’autres projets.

On peut fonctionner alors directement avec la base `eventer.db` du projet (possibilité de choisir son dossier — l’eventer est par défaut à sa racine, sinon on fouille le dossier).

Comme pour un traitement de texte, il faudra décider ce qu’on fait des doublons, les écraser ou les garder en changeant le nom.

#### Import partiel des events

Possible ? Par exemple en « i » sur un event sélectionné permet d’importer dedans un fichier définissant des events ou un lister particulier d’un fichier `eventer.db` ? Est-ce que c’est vraiment une situation qui peut exister ? À voir plus tard. Pour le moment, l’import peut se limiter à des fichiers qu’on fait à la main, plus rapidement qu’avec l’interface.

### Export partiel

Est-ce que l’export doit être lui aussi partiel ?
