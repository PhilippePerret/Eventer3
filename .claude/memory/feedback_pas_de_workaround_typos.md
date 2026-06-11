---
name: feedback_pas_de_workaround_typos
description: Ne jamais coder des workarounds/aliases pour des incohérences dans les données — corriger la source ou demander
metadata:
  type: feedback
---

Ne jamais créer des alias ou fallbacks pour compenser des typos/incohérences dans d'autres fichiers (ex: `_wfAliases` pour compenser des clés manquantes dans WORD_FORMS).

**Why:** Ça intègre des typos dans le code. L'utilisateur préfère corriger la source des données (constants.js, etc.).

**How to apply:** Quand on rencontre une incohérence entre le code et les données (clé absente, nom différent), DEMANDER à l'utilisateur avant de coder quoi que ce soit. Ne jamais "contourner" silencieusement.
