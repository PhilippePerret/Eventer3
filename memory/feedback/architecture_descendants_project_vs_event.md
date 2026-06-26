---
name: architecture_descendants_project_vs_event
description: Comment trouver les events descendants d'un Project vs d'un Event — project_meta vs event_props
metadata:
  type: project
---

Pour trouver les events descendants :

- **Event** → `event_props.lister_id` : si défini, pointe vers le Lister contenant ses events enfants
- **Project** → `project_meta.lister_id` : si défini, pointe vers le Lister de niveau 1 du projet (toujours défini en pratique)

La distinction est uniquement la table source : `event_props` pour un Event, `project_meta` pour un Project.

**Why:** Les deux sont des Items qui possèdent des Events enfants, mais leurs métadonnées sont stockées dans des tables différentes.

**How to apply:** Pour `countDescendants` d'un projet, aller chercher `project_meta.lister_id` — pas `event_props`.
