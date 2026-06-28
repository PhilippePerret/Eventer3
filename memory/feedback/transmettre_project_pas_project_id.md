---
name: feedback-project-object
description: "Transmettre l'objet project, jamais project_id ; pas de propriété dupliquée"
metadata:
  type: feedback
---

Transmettre **`project`** (l'objet Project), jamais `project_id`, aux
constructeurs de listers/items. L'id se dérive via `this.project.id`. Le
paramètre d'URL `?project_id=` reste (contrat serveur), mais aucune propriété
`this.project_id` ne doit exister sur les objets.

Point d'entrée panneaux : **`project.listerBrins.openPanel(item)`** /
`project.listerPersos.openPanel(item)` — PAS de wrapper `openBrinPanel()` sur
l'item.

**Why:** l'utilisateur a horreur des doublons (« JUSTE project »). Une propriété
`project_id` à côté de `project` est un doublon ; l'objet est la source unique.
**How to apply:** quand un constructeur reçoit `project`, ne jamais ajouter
`project_id` en parallèle. Voir aussi [[feedback-panel-methods]].
