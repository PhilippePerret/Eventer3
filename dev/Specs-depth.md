# Depth des EventListers — Étude de cas et plan d'implémentation

## Décision architecturale

**Ne pas stocker `depth` en DB.** Le calculer dynamiquement par traversée top-down lors du chargement du projet. Avantage principal : le déplacement d'un Event ne nécessite que la mise à jour des `item_ids` des deux listes concernées — aucune cascade récursive sur `depth`.

---

## Convention de profondeur

- `ProjectLister` (liste des projets) → `depth = 0`
- `EventLister` racine d'un projet (niveau "Actes") → `depth = 1`
- Chaque niveau imbriqué supplémentaire → `depth + 1`

---

## Algorithme de calcul (top-down)

```
traverser(eventListe, profondeur):
  eventListe.depth = profondeur          ← assigné en mémoire uniquement
  pour chaque itemId dans eventListe.item_ids:
    item = charger(itemId)
    si item.lister_id existe:
      traverser( getListe(item.lister_id), profondeur + 1 )
```

Appel initial depuis le chargement du projet : `traverser(project.lister_id, 1)`

---

## Structure de la fixture

### Notation
- **Liste #N** = lister avec id=N en DB
- **eNN** = event avec id='eNN' en DB (toujours > e10, discontinu)

### Arbre

```
Liste #1  (type='projects', depth=0)
  └── project-a
        └── Liste #2  (type='events', depth=1)  ← niveau "Actes"
              ├── e14  [event_props.lister_id = 3]  ← "Acte 1"
              │     └── Liste #3  (type='events', depth=2)  ← "Séquences de l'Acte 1"
              │           ├── e31  [event_props.lister_id = 4]  ← "Séquence 1"
              │           │     └── Liste #4  (type='events', depth=3)  ← "Scènes de Séquence 1"
              │           │           ├── e57  ← "Scène 1"  (pas d'enfant)
              │           │           └── e68  ← "Scène 2"  (pas d'enfant)
              │           └── e45  ← "Séquence 2"  (pas d'enfant)
              └── e23  [event_props.lister_id = 5]  ← "Acte 2"
                    └── Liste #5  (type='events', depth=2)  ← "Séquences de l'Acte 2"
                          └── e88  ← "Séquence 3"  (pas d'enfant)
```

### État initial en DB

| Table         | id  | item_ids / lister_id |
|---------------|-----|----------------------|
| listers       | #1  | item_ids = ["project-a"] |
| listers       | #2  | item_ids = ["e14","e23"] |
| listers       | #3  | item_ids = ["e31","e45"] |
| listers       | #4  | item_ids = ["e57","e68"] |
| listers       | #5  | item_ids = ["e88"] |
| project_props | project-a | lister_id = 2 |
| event_props   | e14 | lister_id = 3 |
| event_props   | e23 | lister_id = 5 |
| event_props   | e31 | lister_id = 4 |
| event_props   | e45 | lister_id = NULL |
| event_props   | e57 | lister_id = NULL |
| event_props   | e68 | lister_id = NULL |
| event_props   | e88 | lister_id = NULL |

---

## Les trois cas de déplacement à tester

### Cas 1 — Déplacement sans enfant, même profondeur

**Action** : déplacer e45 ("Séquence 2", sans enfant) de Liste #3 vers Liste #5.

Avant :
- Liste #3 item_ids = ["e31","e45"]
- Liste #5 item_ids = ["e88"]

Après :
- Liste #3 item_ids = ["e31"]
- Liste #5 item_ids = ["e88","e45"]

Depths après traversée :
- Liste #2 → 1, Liste #3 → 2, Liste #4 → 3, Liste #5 → 2

Aucun depth ne change. Cas trivial.

---

### Cas 2 — Déplacement avec enfant, même profondeur

**Action** : déplacer e31 ("Séquence 1", propriétaire de Liste #4) de Liste #3 (depth=2) vers Liste #5 (depth=2).

Avant :
- Liste #3 item_ids = ["e31","e45"]
- Liste #5 item_ids = ["e88"]

Après :
- Liste #3 item_ids = ["e45"]
- Liste #5 item_ids = ["e88","e31"]

Depths après traversée :
- Liste #2 → 1
- Liste #3 → 2 (e14 est toujours dans Liste #2)
- Liste #5 → 2 (e23 est toujours dans Liste #2)
- **Liste #4 → 3** (e31 est dans Liste #5 depth=2, donc 2+1=3)

Liste #4 reste à depth=3. Pas de changement de depth visible ici, mais la structure est correctement recalculée.

---

### Cas 3 — Déplacement avec enfant, profondeur différente

**Action** : déplacer e31 ("Séquence 1", propriétaire de Liste #4) de Liste #3 (depth=2) vers Liste #2 (depth=1). On "monte" une séquence au niveau des actes.

Avant :
- Liste #3 item_ids = ["e31","e45"]
- Liste #2 item_ids = ["e14","e23"]

Après :
- Liste #3 item_ids = ["e45"]
- Liste #2 item_ids = ["e14","e23","e31"]

Depths après traversée :
- Liste #2 → 1
- Liste #3 → 2
- Liste #5 → 2
- **Liste #4 → 2** ← était 3, devient 2 (e31 est dans Liste #2 depth=1, donc 1+1=2)
- e57 et e68 sont dans Liste #4 → ils sont maintenant à depth=2

**C'est le cas critique.** Avec depth stocké : cascade récursive obligatoire. Avec depth calculé : seulement les deux item_ids mis à jour suffisent.
