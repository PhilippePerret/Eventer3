# TODO — Eventer3

## PRINCIPES À APPLIQUER AUX TODOS

- dans les tests, migrer progressivement `locator.press` → `press(page,key)`
  Cf. [feedback/tests-focus-reel-page-keyboard.md].
- **IMPÉRATIF** : si on rencontre le même échec **après trois essais de correction**, ON MET DES LOG(s) pour voir où ça coince.
- **IMPÉRATIF** : 

## **WORKFLOW DE TEST À RESPECTER À LA LETTRE**

1. Voir le PULL de tests suivants dans le lisying "Ordre de traitement des tests" ci-dessous
2. S'assurer qu'ils ont leur entête "//Origine: /emplacement/canonique.js
3. Déplacer les tests dans `e2e/_tdd/` (MOVE !!! PAS COPY !!!)
4. Dire à l'user que c'est prêt (NE PAS DONNER D'ORDRE !!!)
5. Recevoir le résultat actuel des tests
6. Corriger SEULEMENT ce qui peut l'être rapidement (SI ET SEULEMENT SI des choses peuvent être corrigées rapidement)
7. Corriger TEST APRÈS TEST :
  1. Le mettre en test.only
  2. Chercher le problème en respectant IMPÉRATIVEMENT la règle suivante : INTERROMPRE TOUTE RECHERCH EXCÉDANT LES 2 MINUTES ; METTRE DES LOGS pour localiser le problème. Informer l'user que c'est prêt à être joué. Recevoir le résultat. Reprendre ce 2.
  3. Après 2 tentatives de correction sans résultat : METTRE DES LOGS pour comprendre.
  4. test.only -> test
  5. Passer au test suivant.
8. Dire à l'user qu'on est prêt pour un ultime run de tous les tests pour s'assurer qu'ils passent tous au vert
9. Supprimer de `memory/tests-a-faire-passer.txt` tous les résultats des tests qu'on vient de faire passer au vert
10. Renseigner le fichier memory/CHANGELOG.md
11. Remettre les fichiers _tdd à leur emplacement canonique
12. On ne pollue pas ce fichier ! On retire ce qui a été fait quand ça a été corrigé : On retire tout ce qui a été ajouté le cas échéant pour les tests courants
13. On recommence à 1 ci-dessus.

**[LIRE TOUJOURS AVANT TOUT TRAVAIL SUR LES TESTS]**
- S'inspirer de `doc/xArchives/public-old` pour le fonctionnement anciennement implémenté (ne pas hésiter à reprendre du code, si valide, surtout s'il ne concerne pas la gestion des keyboard events, radicalement différente dans la nouvelle architecture).
- Les tests existants, malgré les nombreuses migrations déjà effectées, ne respectent peut-être pas la nouvelle architecture — les corriger (au besoin seulement).


<a name="current"></a>

## En cours

**Tâche principale (multi-jours) : faire passer tous les tests**

- Résultats complets dans `memory/tests-a-faire-passer.txt` (fichier ~10000 lignes DANS SA PREMIÈRE VERSION) (Lire 100 lignes à la fois max)
- Supprimer du fichier les tests traités au fur et à mesure

---

### Ordre de traitement des tests

(cet ordre n'est pas celui du fichier tests-a-faire-passer.txt)

**IMPORTANT** : Ne pas oublier d'ajouter "//Origine: ..." en haut des fichiers de test qui n'ont pas cette marque

PULL Markdown 
- specs/e2e/texte/markdown-editing.spec.js
- specs/e2e/texte/token-replace.spec.js
PULL Constants Panel
- specs/e2e/texte/constants-panel.spec.js
PULL Confirme dialogu
- specs/e2e/ui/confirm-dialog-tab.spec.js
PULL 20 (quand split fenêtre opérationnelle)
- specs/e2e/event/link-go-navigate.spec.js
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

