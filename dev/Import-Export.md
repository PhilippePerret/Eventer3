# Eventer3 — Import/export

On doit définir la forme des imports et des exports pour pouvoir créer de façon programmatique des projets.

Il faut simplement un moyen de définir la sortie/entrée, en adoptant tous les formats possibles : 

*Quand je parle de « données du projet » ci-dessous, je parle des events, brins, personnages, styles, etc.)*

- JSON définissant les données DU projet.
- YAML avec les mêmes données
- CSV
- Une base sqlite conforme (c’est la forme actuelle, pour tous les projets).

### Essai format

Note : les imbrications peuvent se définir très simplement, par imbrication :

~~~yaml
---
projet:
	title: Mon projet à importer
events:
	- title: Acte I:
		brins: [b1, b3]
		persos: [p2]
		events:
			- title: "Séquence 1"
			- title: "Séquence 2"
				events: 
				- title: "Première scène de seq1"
				- brins: [] # hérite forcément de b1 et b3
brins:
	b1:
		title: "Mon premier brin
		persos: [p1]
persos:
	p1:
		pseudo: "Mon protagoniste"
		
~~~

