# TODO — Eventer3

## PRINCIPES À APPLIQUER AUX TODOS

- dans les tests, migrer progressivement `locator.press` → `press(page,key)`
  Cf. [feedback/tests-focus-reel-page-keyboard.md].
- **IMPÉRATIF** : si on rencontre le même échec **après trois essais de correction**, ON MET DES LOG(s) pour voir où ça coince.

**[LIRE TOUJOURS AVANT TOUT TRAVAIL SUR LES TESTS]**
- Déplacer les tests dans `e2e/_tdd/` avant de travailler dessus
- S'inspirer de `public-old` pour le fonctionnement anciennement implémenté (ne pas hésiter à reprendre du code, si valide, surtout s'il ne concerne pas la gestion des keyboard events, radicalement différente dans la nouvelle architecture).
- Les tests existants, malgré les nombreuses migrations déjà effectées, ne respectent peut-être pas nouvelle architecture — les corriger (au besoin seulement).


<a name="current"></a>

## En cours

**Tâche principale (multi-jours) : faire passer tous les tests**

- INDISPENSABLE AVANT DE REPRENDRE LA SUITE : Trouver les tests e2e concernant les cibles (liens vers d'autres items event, brin, project, persos, mémorisés avec 'k', qu'on choisit en ouvrant le panneau des cibles avec 'cmd+k' et qui sont ajoutés aux titles de n'importe quel item, comme des liens qu'on passe en revue avec Tab/Maj+Tab en mode display)
- Résultats complets dans `memory/tests-a-faire-passer.txt` (fichier ~10000 lignes DANS SA PREMIÈRE VERSION)
- Lire 100 lignes à la fois max
- Supprimer du fichier les tests traités au fur et à mesure
- Migrer `locator.press` → `press(page,key)` AU FUR ET À MESURE (jamais en global)

---

### Ordre de traitement des tests

(cet ordre n'est pas celui du fichier tests-a-faire-passer.txt)

**IMPORTANT** : Ne pas oublier d'ajouter "//Origine: ..." en haut des fichiers de test qui n'ont pas cette marque

PULL Project
(rassembler au maximum, dans un même fichier, les tests apparentés)
- specs/e2e/event/new-event-virtual-lister.spec.js
- specs/e2e/lister/lister-nature.spec.js
- specs/e2e/project/edit-project.spec.js
- specs/e2e/project/new-project-initial-data.spec.js
- specs/e2e/project/new-project-existing-db.spec.js
- specs/e2e/project/new-project-under-selection.spec.js
- specs/e2e/project/open-existing-project.spec.js
- specs/e2e/project/project-listing-content.spec.js
- specs/e2e/project/regression-project-id.spec.js
- specs/e2e/project/seed-projet-complet.spec.js
- specs/e2e/ui/popup-select-current-value.spec.js
PULL Perso
- specs/e2e/perso/perso-from-brin.spec.js
PULL Search
- specs/e2e/filter/panel-search.spec.js
PULL Styles
- specs/e2e/apparence/style-panel.spec.js
- specs/e2e/panels/panel-move.spec.js
PULL FilePicker
- specs/e2e/filesystem/filepicker.spec.js
PULL Filtre
- specs/e2e/filter/filter-bar.spec.js
- specs/e2e/filter/filter-brin.spec.js
- specs/e2e/filter/filter-text.spec.js
- specs/e2e/filter/filter-ux.spec.js
PULL Targets
- specs/e2e/links/broken-links.spec.js
PULL Tools Panel
- specs/e2e/panels/tools-panel.spec.js
PULL Markdown 
- specs/e2e/texte/markdown-editing.spec.js
- specs/e2e/texte/token-replace.spec.js
PULL Constants Panel
- specs/e2e/texte/constants-panel.spec.js
PULL Confirme dialogu
- specs/e2e/ui/confirm-dialog-tab.spec.js
PULL 20 (quand split fenêtre opérationnelle)
- specs/e2e/event/link-go-navigate.spec.js
- specs/e2e/_tdd/link-open-shortcuts.spec.js
PULL (affichage par niveau)
- specs/e2e/eventer/level-mode-edit.spec.js
PULL Double fenêtre
(ici aussi : rassembler dans moins de fichiers)
- specs/e2e/ui/split-rotate.spec.js
- specs/e2e/ui/split-pane.spec.js
- specs/e2e/ui/split-open-target.spec.js
- specs/e2e/ui/split-focus-visible.spec.js
- specs/e2e/ui/split-direction.spec.js
- specs/e2e/ui/split-close-focused.spec.js
- specs/e2e/ui/split-arrow-nav.spec.js


**`_tdd/lister-nature.spec.js`** : en cours (session 2026-07-02).
- Tests 1–22 passent SAUF test 16 (mis en `test.skip`).
- Test 16 échoue : race condition — quand `_apply()` est lancé (Appliquer) et que l'utilisateur navigue vers un lister frère et ouvre un nouveau NaturePanel, l'ancien `_apply()` peut encore tourner et ouvrir son ConfirmDialog en même temps. Fix partiel appliqué (`void Promise.all` pour les saves, `close()+activate()` avant saves), mais le problème persiste — à investiguer.
- `_apply()` dans `NaturePanel.js` : saves en fire-and-forget (`void Promise.all`).
- Bug persos.load (`existingBadges` null) : contourné avec try/catch dans `Project.enterInside()` — à vraiment corriger.
- **SURVEILLER** : pollution de données entre tests — `saveProjectMeta` écrit dans la DB de test et peut affecter `project-create.spec.js` (4 items créés au lieu de 3).
- `_tdd/project-create.spec.js` : problème connu (4 items au lieu de 3), pas encore traité.
- `_tdd/project-edit.spec.js` et `_tdd/project-navigation.spec.js` : statut inconnu (pas encore lancés en session récente).

Tests 60-74 (`event-fields.spec.js`) : **toujours dans `_tdd/`**, 14/16 passent.
2 échecs restants : TAB depuis `effet` ne focus pas `lieu` et persistance `lieu`.
Piste : remplacer `tabindex='0'` par `tabindex='-1'` sur les trigger spans dans `DOM.buildEditSelectField`.

Tests liens (`links-tab-open.spec.js`, `link-open-shortcuts.spec.js`) : **dans `_tdd/`**, 0 passent.
- Fixtures `with-links` et `with-broken-links` migrées (lister `type='event'` → `'events'`).
- `#events-panel` toujours invisible après ArrowRight → **cause non identifiée**.
  Piste : vérifier depuis quel `cwd` Playwright lance les tests (impact sur `path.resolve('fixtures', name)` dans `installFixtures`).
- `listen/Event.js` : Tab/o/g/a/c déjà ajoutés à `ListerEventLi`.
- `DOM.js` : import `Texte` déjà ajouté.
- Reste : implémenter `cycleLink`/`cycleLinkBack`/`openActiveLink`/`goLink`/`splitLink`/`cardLink` dans `ListerEvent`, créer `LinkOpenPopup.js`, rendre titre en markdown dans `buildTextField`.


<a name="todo-after"></a>

## À faire après


## Fonctionnalités à implémenter

- bouton/raccourci pour "cocher tous les visibles" (surtout utile quand on filtre la liste des events) — raccourci : Maj+Space (toggle)

- édition de tous les cochés en même temps (pour tout Item, projet, brin, event, etc.) : Maj + Enter pour entrer en édition dans l'item sélectionné (=> indication dans barre d'état que les changements seront appliqués à tous les items cochés + marque sur tous les cochés, classe .pseudo-editing, moins verte que l'item édité). Comme pour le fonctionnement normal, les propriétés sont persistées tout de suite, MAIS SEULEMENT pour le sélectionné. Et elles sont mémorisées pour les autres. En sortant -> demande de confirmation et si oui, tous les changements (ET SEULEMENT LES CHANGEMENTS) sont appliqués aux items cochés en plus du sélectionné (ATTENTION : le sélectionné peut ne pas être coché )

- PANNEAU DES OPTIONS 
  C'est un panneau KeyboardPanel qui permet de régler les options a) de l'application b) du projet (et plus tard si nécessaire c) de l'évènemencier)
  Titre : "Options de <propriétaire>"
  Body  : les items des options pour réglage
  Footer : bouton "Fermer" seulement
  - Les options sont enregistrées à chaque changement (mais débounce)
  - Chaque item est :
    - une phrase ("Aspect des évènements")
    - soit un menu de valeurs, soit une case à cocher
  - on se déplace d'item en item avec "↑"/"↓"
  - "↩︎" permet d'entrer "en édition" — le select ou la cb se met aussitôt en édition

