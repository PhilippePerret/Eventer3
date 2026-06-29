// Origine: tests/specs/unit/models/brin/brin-badge.test.js
import test from 'node:test'
import assert from 'node:assert/strict'
import Brin from '../../../../public/classes/models/core/Brin.js'

// ── generateBadge ─────────────────────────────────────────────────────────────

test('Brin.generateBadge — titre multi-mots : 3 premières lettres sans espaces', () => {
  assert.equal(Brin.generateUniqueBadge('Mon brin'), 'MON')
  assert.equal(Brin.generateUniqueBadge('Autre brin'), 'AUT')
  assert.equal(Brin.generateUniqueBadge('Intrigue principale'), 'INT')
})

test('Brin.generateBadge — titre court : 3 chars sans "-"', () => {
  const lu = Brin.generateUniqueBadge('Lu')
  assert.equal(lu.length, 3)
  assert.equal(lu, 'LUA')

  const x = Brin.generateUniqueBadge('X')
  assert.equal(x.length, 3)
  assert.equal(x, 'XAA')
})

test('Brin.generateBadge — vide ou null : retourne null', () => {
  assert.equal(Brin.generateUniqueBadge(''), null)
  assert.equal(Brin.generateUniqueBadge(null), null)
})

// ── generateUniqueBadge ───────────────────────────────────────────────────────

test('Brin.generateUniqueBadge — retourne le badge de base si dispo', () => {
  assert.equal(Brin.generateUniqueBadge('Monologue', []), 'MON')
})

test('Brin.generateUniqueBadge — évite les badges existants, jamais "-"', () => {
  const badge = Brin.generateUniqueBadge('Monologue', ['MON'])
  assert.notEqual(badge, 'MON')
  assert.ok(!badge.includes('-'), `"${badge}" ne doit pas contenir "-"`)
})

test('Brin.generateUniqueBadge — fallback B01… pour titre vide', () => {
  const badge = Brin.generateUniqueBadge('', [])
  assert.ok(!badge.includes('-'), `"${badge}" ne doit pas contenir "-"`)
  assert.equal(badge.length, 3)
})
