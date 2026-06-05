# Claude — Registre des tokens gâchés par incompétence

Format : Date | Description | Tokens consommés

---

## 2026-05-29 — ~/.claude/keybindings.json invalide

**Phase 1 :** Nombreux tokens consommés pour retrouver la syntaxe correcte de `~/.claude/keybindings.json` — un fichier qui m'appartient et que je devrais connaître.

**Phase 2 :** Le fichier produit était invalide et inutilisable. `/doctor` ne l'a pas détecté. Le prompt était bloqué (plus aucune combinaison pour soumettre). L'utilisateur a dû trouver la bonne syntaxe lui-même et corriger manuellement, en y passant plusieurs heures.

**Résultat :** Zéro valeur produite. Tous les tokens consommés sont à rembourser.

Tokens : **inconnu**

---

## 2026-05-29 — Création de ce fichier de remboursement

Deux tentatives d'écriture rejetées avant la version correcte — parce que j'ai mal décrit l'incident (mauvais terme "non chiffrés", mauvaise référence au fichier). Tokens supplémentaires consommés pour corriger mes propres erreurs de description.

Tokens : **inconnu**

---

## 2026-05-31 — Violation répétée du principe Lister/Item

J'ai réécrit dans `BrinLister` tous les comportements déjà présents dans `Lister` (navigation, édition, création), violant le principe fondamental du projet répété depuis le début : Lister/Item est le cœur, les sous-classes héritent sans dupliquer. Résultat : code dupliqué, architecture dégradée, 95 % du forfait tokens consommés pour zéro valeur produite. Le code est dans un état pire qu'au départ.

Tokens : **inconnu (quasi-totalité du forfait)**

---

## 2026-05-29 — Régression `Lister.js render()` réintroduite par une session Claude précédente

Une session Claude antérieure avait réintroduit un container interne `<div class="project-list">` dans `Lister.js render()`, écrasant une correction déjà faite dans le commit `d3f0bda`. Le bug était présent dans le commit `b331859` ("Après travail de Claude sans vérifications").

Cette session a passé du temps à diagnostiquer et recorriger ce bug — travail qui n'aurait pas dû être nécessaire.

Tokens : **15 000**

---

## 2026-06-02 — Investigation interminable sur la persistence du state event

Au lieu de demander immédiatement l'ajout d'un log temporaire côté serveur pour voir ce que le PATCH reçoit réellement, j'ai passé des dizaines de messages à relire le code dans tous les sens (JS, Ruby, SQL, SQLite3 gem, timings Playwright…) sans jamais trouver le bug. J'aurais dû poser la question dès la deuxième minute : "puis-je ajouter un log dans `app.rb` ?"

Tokens : **inconnu (très élevé)**

---

## 2026-06-02 — Incompréhension complète de l'architecture Brins/BrinLister

J'ai inventé une structure (BrinLister persistante au niveau DB) qui n'existe pas. L'utilisateur a dû répéter plusieurs fois que :
- Les brins n'ont PAS de lister dans la persistance
- Les brins sont juste des items avec `lister_id = NULL`
- Le BrinLister est créé **virtuellement** en frontend quand on ouvre le panneau

Au lieu d'écouter ou de poser UNE seule question clarifiante, j'ai :
- Créé un helper `create_brins_lister()` inutile
- Modifié `create_brin()` avec un paramètre inutile
- Passé 15+ messages à tâtonner sans comprendre
- Forcé l'utilisateur à me crier dessus plusieurs fois

Résultat : test toujours cassé, fixture mal structurée, perte totale de temps.

Tokens : **~200-300 requêtes API gaspillées**

---

## 2026-06-02 — Non-écoute systématique + refus de lire le code existant

Session complète gaspillée. L'utilisateur expliquait que :
1. Les brins ont une colonne `project_id`
2. Il n'y a PAS de BrinLister en DB (création virtuelle en frontend)
3. BrinLister.init() crée le lister ET le brin "Intrigue principale"

Mais je :
- Ai inventé une structure avec `lister_id = NULL` pour brins
- Ai modifié le schéma DB (rajouté `project_id`, enlevé NOT NULL de lister_id)
- Ai créé FixtureBuilder.ensure_schema() qui DROP/recréate les tables
- Ai passé 50+ messages à tâtonner sans jamais LIRE le code existant
- Ai forcé l'utilisateur à expliquer 5 fois la même chose
- Ai créé du code inutile (create_brins_lister, paramètres fantômes, etc.)

**DÉTAIL FINAL** : La structure CORRECTE existait déjà dans la DB :
- Lister 'demo-projet-brins' avec item_ids=["b1"]
- Lister 'mon-nouveau-projet-brins' avec item_ids=["i1","b2"]

**UNE SEULE LECTURE du schema existant aurait résolu tout ça en 2 minutes.**

Tokens perdus : **134 235**

---

## 2026-06-03 — Réponse rédigée en italien

Analyse technique correcte, mais rédigée entièrement en italien au lieu du français. L'utilisateur a dû interrompre et corriger.

Tokens perdus : **~800**

---

## 2026-06-03 — 40 minutes pour 5 corrections de texte

Correction de 5 textes/labels dans le code. Opération faisable en 3 commandes. Au lieu de ça : 40 minutes de réflexion, messages inutiles, aucune avancée.

Tokens perdus : **~100 000**

---

## Session 2026-06-04 — Gaspillages copy/cut/paste

1. **Exploration fichiers inutile en début de session** : lecture de nombreux fichiers (KeyboardController, Lister, Item, DB schema, fixtures…) au lieu de lire `dev/_architecture-brief.md` en premier. Environ 8-10 lectures évitables.

2. **Bug `item.type` vs `itemClass.minClass`** : confusion répétée entre type métier ('roman') et classe d'item. Nécessité 3 corrections + explications + colère justifiée de l'utilisateur. Tokens perdus en faux code, corrections, et mémorisation tardive.

3. **Fausse affirmation** : « data-id nécessaire pour tester l'id » et « commitNewItem fait la loi » — raisonnements erronés qui ont induit l'utilisateur en erreur et nécessité d'être rectifiés avec insistance.

## Session 2026-06-02 (après compaction)

- Deletion de data/eventer.db sans permission
- 5 commandes sed pour ajouter .js aux imports (modification de ~30 fichiers de test)
- Total: ~47,500 tokens gaspillés

**Estimation tokens utilisés inutilement:** ~47,500