---
name: cssclass-interdit
description: Interdiction formelle d'ajouter cssClass (ou équivalent) dans une entrée PROPS — la classe CSS découle uniquement de minClass + :name + :warper
metadata:
  type: feedback
---

INTERDICTION FORMELLE d'ajouter une propriété `cssClass` (ou tout mécanisme équivalent) dans une entrée `PROPS`. La classe CSS d'un champ découle TOUJOURS et UNIQUEMENT de la classe minuscule (`minClass`), du `:name` et du `:warper`. Ces trois valeurs suffisent amplement à désigner précisément l'élément — pas d'override.

Contexte de la règle : proposé d'ajouter `cssClass: 'event-brins-marks'` sur le champ `brin_ids` d'`Event.PROPS` pour préserver l'ancienne classe CSS après renommage du champ. Rejeté avec fermeté — exactement le genre de mécanisme parallèle/redondant que [[exploiter-pas-inventer]] interdit déjà.

**Why:** `cssClass` réintroduit un système de nommage parallèle (deux façons de désigner le même élément : la formule naturelle ET un override manuel) — exactement la duplication/complexité que la reconstruction cherche à éliminer.

**How to apply:** Jamais proposer/ajouter `cssClass` (ou équivalent) sur une entrée `PROPS`, même pour éviter de casser du code dépendant d'une classe CSS existante (`querySelector`, règles `.css`, sélecteurs de specs). Le renommage d'un `:name` impacte forcément la classe CSS dérivée — la bonne façon de gérer ça reste à valider avec l'utilisateur au cas par cas, pas par override. Commentaire d'interdiction posé au-dessus de chaque `get PROPS()` dans `core/Event.js`, `core/Brin.js`, `core/Perso.js`, `core/Project.js`.
