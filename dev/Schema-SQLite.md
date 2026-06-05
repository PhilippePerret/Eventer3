# Schéma SQLite — Eventer3

[TOC]

---

## Tables

```
    listers {
        INTEGER id PK
        TEXT type
        TEXT nature
        TEXT scale
        TEXT item_ids
        TEXT options
        TEXT path
        TEXT created_at
        TEXT updated_at
    }

    items {
        TEXT id PK
        TEXT title
        TEXT type
        TEXT color
        INTEGER checked
        INTEGER duration
        TEXT path
        INTEGER depth
        TEXT created_at
        TEXT updated_at
    }

    project_props {
        TEXT item_id PK
        INTEGER state
        INTEGER active
        INTEGER year
        TEXT lister_id FK // <== CHILD !!! NOT PARENT !!! 		      TEXT brin_ids
        TEXT perso_ids
    }

    event_props {
        TEXT item_id PK
        
        TEXT lister_id DEFAULT NULL FK
        --- CHILD !!! NOT PARENT !!! ---
        
        INTEGER depth
        INTEGER state
        TEXT brin_ids
        TEXT perso_ids
        TEXT meteo
        TEXT effet
        TEXT dyndate
        INTEGER is_script
    }

    brin_props {
        TEXT item_id PK
        TEXT badge
        TEXT perso_ids
    }

    perso_props {
        TEXT item_id PK
        TEXT badge
        TEXT patronyme
        TEXT avatar
        TEXT fonction
        TEXT genre
        INTEGER birthyear
    }

    counters {
        TEXT project_id FK
        TEXT item_type
        INTEGER last_val
    }

    listers ||--o{ items : contient
    items }o--o| listers : possede
    items ||--o| project_props : etend
    items ||--o| event_props : etend
    items ||--o| brin_props : etend
    items ||--o| perso_props : etend
    items ||--o{ counters : projet
```

---

## Notes

### `items.type`

La colonne `type` est commune à tous les items. Elle est interprétée différemment selon la classe spécialisée :
- **Event** : `dia` / `act` / `des`
- **Brin** : `mint` / `aint` / … (BrinTypes)
- **Perso** : `prota` / `anta` / `ambi` (protagoniste / antagoniste / ambivalent)
- **Project** : `scenario` / `roman`

### `items.depth`
Valeur dénormalisée pour accélérer les requêtes de vue par niveau.  
**À mettre à jour** lors de tout déplacement d'un item vers un autre lister.

### `counters` 

SQLite ne génère pas nativement des IDs avec préfixe. La table `counters` stocke le dernier indice utilisé par type d'item et par projet. Lors de la création d'un brin dans le projet `mon-projet` : on incrémente `counters(mon-projet, brin)` et on préfixe avec `b` → `b3`.

### Persos d'un Event

Les personnages d'un event sont l'union de :
- `brin_props.perso_ids` pour chaque brin dans `event_props.brin_ids`
- `event_props.perso_ids` (persos directs, hors brins)

~~Des doublons sont possibles et doivent être gérés à l'affichage.~~

Les doublons doivent être impossibles : quand on ajoute un Perso à un Event, il faut s’assurer qu’un brin ne l’ajoute pas déjà.



<a name="table-ini"></a>

---

## Table initiale

Cf. ci-dessous le contenu de toute table au lancement de l’application la toute première fois.


  ~~~sqlite
  table listers
  
  	id	|	type			| item_ids	|
  	-------------------------------
  	1		|	projects 	| ["model"] |
  	2		| events		| ["e1"]		|
  	
  --	C'EST TOUT !!!! Juste pour conserver l'ordre
  --  des projets dans l'affichage et connaitre le premier
  -- évènemencier du projet modèle. Voir l'exemple de
  -- table plus bas.
  
  	
  table items
  
  	id		| title 					| type 				|
  	--------------------------------------------
  	model	| "Projet modèle"	| "roman" 		|
    e1		| "Event modèle" 	| 	NULL			|
    b1		| "Brin modèle"		|	"intrigue"	|
    p1		| "Perso modèle"	| "adjuvant"	|
    
  -- La colonne lister_id a été définitivement retirées pour
  -- incompréhension complète par Claude. Maintenant, elle est
  -- devenu seulement une colonne des Event(s).
  -- Idem pour la colonne depth
  
  table event_props
  
  item_id	| depth | lister_id |
  --------------------------
  	e1		| 	1		| 	NULL		| 
  
  
  table project_props
  
  item_id |state|active|lister_id|brin_ids|perso_ids|
  -------------------------------------------------
  model		| 0   | 1		 | 	2 		 | ["b1"]	| ["p1"]  |
  
  -- C'est par le biais de cette table qu'on récupère
  -- les events, les brins et les personnages d'un projet
  -- précis (ET PAR AUCUN AUTRE MOYEN ***SURTOUT PAS***
  -- des lister.
  ~~~

<a name="exemple-table"></a>

---

## Exemple de table au cours du travail

*Ci-dessous le contenu d’une table au cours du travail.*

~~~sqlite
  table listers
  
  	id	|	type			| item_ids											|
  	-------------------------------------------------
  	1		|	projects	| ["projA", "projB"] 						|
  	2		|	events		| ["e1", "e2", "e3"] 						|
  	3		| events		| ["e7", "e4", "e12", "e13"]		|
  	4	 	| events		| ["e5", "e6"]									|
  	

  
  	
  table items
  
  	id		| title 					| ...
  	--------------------------------------------
  	projA	| "Projet A"			|
    projB | "Projet B"			|
    b1		| "Enquête"				|
    b2		| "Main plot"			|
    b3		| "La recherche"	|
    e1		| "Acte I" 				|
    e2		| "Acte II"				|
    e3		| "Acte III"			|
    e4		| "La rentrée"		|
    e5		| "Le repas"			|
    e6		| "Le bain"				|
    e7		| "Les vacances"	|
    e12		|	"L'école"				|
    e13		| "La récré"			|
    p1		| "Mon protago"		|
    p2		| "Perso modèle"	|
    
  -- La colonne lister_id a été définitivement retirées pour
  -- incompréhension complète par Claude. Maintenant, elle est
  -- devenu seulement une colonne des Event(s).
  -- Idem pour la colonne depth
  
  table event_props
  
  item_id	| depth | lister_id | ...
  ---------------------------------------------
  	e1		| 	1		| NULL			|
  	e2  	|		1		| 3					| -- CHILD ! NOT PARENT !
  	e3		|		1		| NULL			|
  	e4		|		2		| NULL			|
  	e5		|		3		| NULL			|
  	e6		|		3		| NULL
  	e7		|		2		| NULL			|
   	e12		|		2		| 4					| -- CHILD ! NOT PARENT !
  	e13		|		2		| NULL			|

  
  table project_props
  
  item_id	|state|active|lister_id	| brin_ids 		|perso_ids|
  ----------------------------------------------------------
  projA		| 0   | 1		| 	2 			| ["b3","b1"]	| ["p1"]  |
  projB		| 0	 	| 1		|		NULL		| ["b2"]	 		| ["p2"]	|
  
-- liste_id = NULL => Pas encore d'évènemencier pour ce
-- projet B.
-- Mais la création d'un projet lui crée toujours un brin
-- et un personnage par défaut.
~~~