# Schéma SQLite — Eventer3

## Tables

```mermaid
erDiagram
    listers {
        TEXT id PK
        TEXT type
        TEXT nature
        TEXT scale
        TEXT item_ids
        TEXT options
        TEXT path
        TEXT parent_item_id FK
        TEXT created_at
        TEXT updated_at
    }

    items {
        TEXT id PK
        TEXT lister_id FK
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
    }

    event_props {
        TEXT item_id PK
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

### `items.lister_id` remplace `has_lister`
Un item possède un lister si et seulement si il existe un enregistrement dans `listers` avec `parent_item_id = item.id`. La colonne `has_lister` est redondante et supprimée.

### `items.type`
La colonne `type` est commune à tous les items. Elle est interprétée différemment selon la classe spécialisée :
- **Event** : `dia` / `act` / `des`
- **Brin** : `mint` / `aint` / … (BrinTypes)
- **Perso** : `p` / `a` / `b` (protagoniste / antagoniste / ambivalent)
- **Project** : `scenario` / `roman`

### `items.depth`
Valeur dénormalisée pour accélérer les requêtes de vue par niveau.  
**À mettre à jour** lors de tout déplacement d'un item vers un autre lister.

### `counters` remplace `lasts_id`
SQLite ne génère pas nativement des IDs avec préfixe. La table `counters` stocke le dernier indice utilisé par type d'item et par projet. Lors de la création d'un brin dans le projet `mon-projet` : on incrémente `counters(mon-projet, brin)` et on préfixe avec `b` → `b3`.

### Persos d'un Event
Les personnages d'un event sont l'union de :
- `brin_props.perso_ids` pour chaque brin dans `event_props.brin_ids`
- `event_props.perso_ids` (persos directs, hors brins)

Des doublons sont possibles et gérés à l'affichage.
