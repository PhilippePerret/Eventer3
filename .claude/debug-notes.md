# Notes de débogage — session en cours

## Test 9 : `no-man` échoue (roman-man jamais appliqué après navigation)

Symptôme : après ArrowLeft→ArrowDown→ArrowRight depuis e14-sublister vers e23-sublister,
`#main-panel` reste à `data-depth="1"` avec `class="event-list"` (jamais roman-man).

### Ce qui est confirmé fonctionnel
- Test 8 (même navigation) PASSE — différence : test 8 a `await expect(...).toHaveClass(/event-list/)` entre les ArrowRight
- Sync point ajouté dans test 9 (`toHaveAttribute('data-depth', '2')`) → ne suffit pas

### Pistes non encore vérifiées
1. `activeLister` après fermeture des 3 popups = e14-sublister ? ou autre chose ?
2. `this.items[1].lister_id` sur root APRÈS re-render via leaveToParent = 5 ?
3. `enterSelectedItem` sur root — est-il bien appelé pour e23 ?
4. LOG.m() pour déboguer, PAS console.log

### Règle : déboguer avec LOG.m(), jamais console.log
