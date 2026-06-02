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
