---
name: fichiers-dans-appli-uniquement
description: AUCUN fichier Claude en dehors du dossier de l'application
metadata:
  type: feedback
---

INTERDIT de créer des fichiers ou dossiers en dehors du dossier de l'application (`/Users/philippeperret/Programmes/Eventer3/`). Mémoires, notes, fichiers temporaires — TOUT va dans `./memory/feedback/` ou les sous-dossiers appropriés de l'application.

**Why:** Le dossier global `~/.claude/projects/` est détruit en fin de session. Tout ce qui y est mis est perdu.

**How to apply:** Toujours écrire les fichiers mémoire dans `./memory/feedback/` (feedbacks), `./memory/` (autres types). Jamais dans `~/.claude/` ou ailleurs.
