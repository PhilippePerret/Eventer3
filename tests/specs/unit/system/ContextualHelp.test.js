import test from 'node:test'
import assert from 'node:assert/strict'
import { WORD_FORMS } from '../../../../public/constants.js'

const { default: ContextualHelp } = await import('../../../../public/classes/ui/ContextualHelp.js')

// ── _resolveTemplate ──────────────────────────────────────────────

test('_resolveTemplate: {wf.Thing} résolu avec WORD_FORMS.Project', () => {
  const ctx = { wf: WORD_FORMS.Project }
  assert.equal(ContextualHelp._resolveTemplate('{wf.Thing} précédent', ctx), 'Projet précédent')
})

test('_resolveTemplate: {wf.the}{wf.thing} résolu avec WORD_FORMS.Event', () => {
  const ctx = { wf: WORD_FORMS.Event }
  const expected = WORD_FORMS.Event.the + WORD_FORMS.Event.thing
  assert.equal(ContextualHelp._resolveTemplate('{wf.the}{wf.thing}', ctx), expected)
})

test('_resolveTemplate: {wf.Le} résolu', () => {
  const ctx = { wf: WORD_FORMS.Project }
  assert.equal(ContextualHelp._resolveTemplate('{wf.Le} Supprimer', ctx), 'Le Supprimer')
})

test('_resolveTemplate: {fields_order} résolu via clé directe du ctx', () => {
  const ctx = { wf: WORD_FORMS.Project, fields_order: 'titre → état → titre' }
  assert.equal(
    ContextualHelp._resolveTemplate('Champ suivant {fields_order}', ctx),
    'Champ suivant titre → état → titre'
  )
})

test('_resolveTemplate: clé wf inconnue → chaîne vide', () => {
  const ctx = { wf: WORD_FORMS.Project }
  assert.equal(ContextualHelp._resolveTemplate('{wf.inexistant}', ctx), '')
})

test('_resolveTemplate: sans ctx → placeholders supprimés', () => {
  assert.equal(ContextualHelp._resolveTemplate('{wf.Thing} texte', null), ' texte')
})

test('_resolveTemplate: texte sans placeholder → inchangé', () => {
  const ctx = { wf: WORD_FORMS.Project }
  assert.equal(ContextualHelp._resolveTemplate('Entrer dans le projet', ctx), 'Entrer dans le projet')
})

test('_resolveTemplate: mise en cache — résultat identique au second appel', () => {
  const ctx = { wf: WORD_FORMS.Brin }
  const r1 = ContextualHelp._resolveTemplate('{wf.Thing} suivant', ctx)
  const r2 = ContextualHelp._resolveTemplate('{wf.Thing} suivant', ctx)
  assert.equal(r1, 'Brin suivant')
  assert.equal(r1, r2)
})

// ── _buildShortcuts : structure items/shortcuts ───────────────────

test('_buildShortcuts: _shortcuts ne contient pas les en-têtes de section', () => {
  ContextualHelp._stack = ['project-list']
  const h = Object.create(ContextualHelp.prototype)
  h._items = []; h._shortcuts = []
  h._buildShortcuts()
  assert.ok(h._shortcuts.every(s => !s.__section))
})

test('_buildShortcuts: _shortcuts contient ↑ et ↓ (navigate-items, sans titre → pas de section)', () => {
  ContextualHelp._stack = ['project-list']
  const h = Object.create(ContextualHelp.prototype)
  h._items = []; h._shortcuts = []
  h._buildShortcuts()
  const scKeys = h._shortcuts.map(s => s.sc)
  assert.ok(scKeys.includes('↑'), '↑ absent')
  assert.ok(scKeys.includes('↓'), '↓ absent')
})

test('_buildShortcuts: navigate-items (sans titre) n\'insère pas d\'en-tête de section', () => {
  ContextualHelp._stack = ['project-list']
  const h = Object.create(ContextualHelp.prototype)
  h._items = []; h._shortcuts = []
  h._buildShortcuts()
  // navigate-items n'a pas de title → pas de section avant ses raccourcis (↑ est le premier item)
  assert.equal(h._items[0].sc, '↑', 'le premier item doit être ↑ (pas un en-tête)')
})

test('_buildShortcuts: with-selected (titre défini) insère un en-tête de section', () => {
  ContextualHelp._stack = ['project-list']
  const h = Object.create(ContextualHelp.prototype)
  h._items = []; h._shortcuts = []
  h._buildShortcuts()
  const sections = h._items.filter(i => i.__section)
  assert.ok(sections.length > 0, 'au moins un en-tête de section attendu (with-selected)')
  assert.ok(sections.some(s => s.title?.includes('{wf.Thing}')), 'titre de section avec template wf')
})

test('_buildShortcuts: _shortcuts contient ⌦ (depuis with-selected)', () => {
  ContextualHelp._stack = ['project-list']
  const h = Object.create(ContextualHelp.prototype)
  h._items = []; h._shortcuts = []
  h._buildShortcuts()
  assert.ok(h._shortcuts.some(s => s.sc === '⌦'), '⌦ absent de _shortcuts')
})
