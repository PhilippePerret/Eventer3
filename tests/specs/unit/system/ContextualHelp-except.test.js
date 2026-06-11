import test from 'node:test'
import assert from 'node:assert/strict'

const { default: ContextualHelp } = await import('../../../../public/classes/ui/ContextualHelp.js')

// ── _buildShortcuts : except ──────────────────────────────────────────

test('_buildShortcuts: project-list exclut ␣ de _shortcuts (except)', () => {
  ContextualHelp._stack = ['project-list']
  const h = Object.create(ContextualHelp.prototype)
  h._items = []; h._shortcuts = []
  h._buildShortcuts()
  assert.ok(!h._shortcuts.some(s => s.sc === '␣'), '␣ ne doit pas être dans _shortcuts')
})

test('_buildShortcuts: project-list exclut ␣ de _items (except)', () => {
  ContextualHelp._stack = ['project-list']
  const h = Object.create(ContextualHelp.prototype)
  h._items = []; h._shortcuts = []
  h._buildShortcuts()
  assert.ok(!h._items.some(s => s.sc === '␣'), '␣ ne doit pas être dans _items')
})

test('_buildShortcuts: project-list conserve ⌦ malgré except (seul ␣ exclu)', () => {
  ContextualHelp._stack = ['project-list']
  const h = Object.create(ContextualHelp.prototype)
  h._items = []; h._shortcuts = []
  h._buildShortcuts()
  assert.ok(h._shortcuts.some(s => s.sc === '⌦'), '⌦ doit rester dans _shortcuts')
})
