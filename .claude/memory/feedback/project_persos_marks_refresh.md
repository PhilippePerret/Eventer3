---
name: project-persos-marks-refresh
description: Règle d'actualisation des marques de personnages selon le contexte (Event vs Brin) — direct vs différé
metadata:
  type: project
---

Actualisation des **marques de personnages** (persos-marks) selon le contexte d'ouverture du panneau persos. Acté par l'utilisateur (28/06).

## CAS 1 — touche `p` sur un Event
- Le panneau persos s'ouvre pour choisir les persos **DE L'EVENT**.
- **REQUIS** : actualisation **EN DIRECT** des marques persos de l'event contexte (au toggle).
- **WARNING** : un Event possède AUSSI les persos de ses brins → les marques persos d'un event = persos directs de l'event **+** persos hérités de ses brins (union). Le refresh direct recalcule donc l'ensemble pour CET event uniquement.

## CAS 2 — touche `p` sur un Brin (le panneau brins est déjà ouvert)
- Le panneau persos s'ouvre pour choisir les persos **DU BRIN**.
- **REQUIS** : actualisation **EN DIRECT mais seulement DU BRIN** (marques persos propres au brin contexte). Coût réduit.
- L'Event qui contient ce brin n'est **PAS** rafraîchi en direct : sinon confusion (l'user voit l'event bouger en direct puis ne comprend pas le message « actualisation des events » différé).
- Avec le panneau persos ouvert depuis un brin, on peut modifier les persos de **N'IMPORTE QUEL brin**, pas seulement ceux de l'event-contexte. Seule la **coche** des brins (dans le panneau brins) a un rapport avec l'event courant ; l'édition des persos d'un brin est libre.
- **REQUIS** : à la **fermeture du panneau PERSOS** → rien de plus.
- **MAIS** à la **fermeture du panneau BRINS** → **SI** des brins ont été modifiés → actualiser les marques persos **uniquement des Events qui possèdent ces brins modifiés** (pas tous les events du DOM, pas le viewport — exactement les events contenant un brin de la liste).

## Liste des brins modifiés (le mécanisme du différé)
- Le `ListerBrin` garde une **liste d'ids de brins modifiés**.
- Un brin entre dans la liste quand son **`perso_ids` OU sa `color`** est modifié (les autres props ne comptent pas pour ce refresh). → prévoir les DEUX déclencheurs (perso_ids et color).
- Liste **vidée** une fois l'actualisation opérée (à la fermeture du panneau brins).
- À la fermeture du panneau brins : pour chaque event affiché possédant ≥1 brin de la liste → recalcul de ses marques persos.
- **Notification** si beaucoup d'events à actualiser (incitation discrète à ne pas empiler des milliers d'events dans une imbrication).

## Invariant : persos directs d'un Event ∩ persos de ses brins = ∅
Un perso porté par un brin de l'event ne peut PAS être aussi ajouté en direct sur l'event. `_directIds` et `_inheritedIds` sont donc disjoints **par construction** (pas de guard nécessaire dans `openPanel`). À **garantir** à deux endroits (À FAIRE) :
1. Ajout d'un perso **directement à l'event** : s'il appartient déjà à un de ses brins → **alerte + ne rien faire** (refus).
2. Choix d'un **brin pour l'event** : si l'event contient en direct des persos que ce brin porte → **les retirer** des persos directs de l'event.

## Conséquence design
- Le refresh **n'est pas** « persos = toujours à la fermeture » (erreur précédente). C'est :
  - Event (CAS 1) : direct, sur l'event contexte **seul** (direct + hérités).
  - Brin (CAS 2) : direct sur le brin contexte **seul** ; refresh différé des **events contenant les brins modifiés** à la fermeture du panneau brins (liste d'ids `perso_ids`/`color`).
- Lié à [[project_db_architecture]] et au chantier centralisation Project (cf. TODO).
