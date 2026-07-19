---
name: dom-methods-proprietaires-de-leur-classe
description: Les méthodes DOM custom (value: dans PROPS, type no-edit) retournent elles-mêmes leur conteneur avec sa classe sémantique — découplé du :name du champ
metadata:
  type: feedback
---

Pour un champ `PROPS` de type `no-edit` avec `value: 'methodName'` (ex. `brinsMarks`, `persosMarks` dans `dom/Event.js`), c'est la méthode elle-même qui doit retourner son conteneur complet avec sa classe sémantique — pas le `:name` du champ qui ne sert qu'à la donnée réelle (`save()`).

Pattern de classe « pro » à deux niveaux : `class="brins-marks ${this.minClass}-brins-marks"` — une classe générique partagée (`brins-marks`) + une classe spécifique préfixée par la classe minuscule (`event-brins-marks`) pour cibler précisément par type d'item.

**Why:** Le `:name` d'un champ PROPS désigne la PROPRIÉTÉ réelle (cf. [[exploiter-pas-inventer]] — `:name` = la colonne, toujours exact). La classe CSS d'un conteneur custom n'a pas de lien direct avec ça : `_fieldEl`/`buildNoEditField` (`utils/DOM.js`) construisent un span générique autour du retour de la méthode, mais pour ces champs spéciaux la méthode reprend la responsabilité de son propre conteneur — ça évite que renommer une propriété réelle (ex. `brin_ids`) casse la classe CSS utilisée ailleurs (JS, CSS, tests).

**How to apply:** Toute méthode `value:` de ce type doit wrapper son contenu dans un conteneur avec les deux classes (générique + `${this.minClass}-xxx`). Le `:name` du champ PROPS reste libre de désigner la vraie propriété sans impact sur le rendu.
