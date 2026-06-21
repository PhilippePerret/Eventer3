# TODO — Eventer3

<a name="current"></a>

## En cours

⚠️ REPRISE EN COURS — LAISSÉ DANS UN ÉTAT DÉGRADÉ PAR CLAUDE (session 2026-06-20)

### 0. RATIONALISATION CSS PANNEAUX [EN COURS]
**Objectif** : deux classes génériques seulement — `.kpanel` (KeyboardablePanel) et `.ftpanel` (floating-panel).
- Toutes classes spécifiques à supprimer : `.confirm-dialog`, `.confirm-dialog__*`, et toute classe propre à un panneau particulier
- Récupérer le style utile de ces classes → l'intégrer dans `.kpanel` ou `.ftpanel`
- `.panel-btn` et consorts : rassembler avec les classes de panneaux
- **RÈGLE ABSOLUE** : Claude n'invente plus aucune classe propre à un panneau de l'appli
- Vérifier que `.kpanel` gère : footer buttons aspect
- Vérifier que `.ftpanel` gère : tout ce qui relève des panneaux flottants

### 1. KeyboardablePanel.js — BOUTON PRÉ-FOCUSÉ
Pas implémenté. Piste validée par l'utilisateur : flag `default: true` dans les objets retournés par `_getFooterButtons()`, lu dans `open()` depuis `_footerBtns` (pas via DOM ni via re-appel de `_getFooterButtons()`).

### 3. ConfirmDialog — visuels à tester en live
CSS modifié ce jour : `padding: 0`, `width: 500px`, separator caché, zone `min-height: auto`.
Labels nettoyés (sans ↩︎/⇥), titre "Projet existant" ajouté.
**Non testé.**

### 4. Tests _tdd/open-existing-project.spec.js
Tests 1, 3, 4 : passent. Test 2 (ArrowRight → event-list) : **non implémenté**.

<a name="todo"></a>

## À faire

- [ ] Création nouveau projet avec dossier existant : dialogue de confirmation
- [ ] `→` pour rentrer dans le projet
- [ ] `⌘↓` / `⌘↑` pour déplacer les projets
- [ ] `Enter` pour éditer les évènements (event)

<a name="done"></a>

## Fait

- [x] 2026-06-21 — KeyboardablePanel.js : listener keydown corrigé (bon élément)
- [x] 2026-06-20 — FilePicker : bug frappe nouveau dossier
- [x] 2026-06-20 — FilePicker : portage nouvelle architecture (tabindex, createNew, project_order)
- [x] 2026-06-20 — Édition projet : Correction bugs relevés en live
- [x] 2026-06-19 — Liste des projets s'affiche au lancement avec données leurs PROPS
- [x] 2026-06-19 — Navigation ↑/↓ pour sélectionner un projet
