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

### Point d'arrêt 2026-07-01

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
