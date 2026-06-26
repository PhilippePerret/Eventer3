// Origine: tests/specs/unit/models/brin/brin-badge.test.js
import test from 'node:test'
import assert from 'node:assert/strict'
import Brin from '../../../../../public/classes/models/core/Brin.js'

// ── generateBadge ─────────────────────────────────────────────────────────────

test('Brin.generateBadge — titre multi-mots : 3 premières lettres sans espaces', () => {
  assert.equal(Brin.generateBadge('Mon brin'), 'MON')
  assert.equal(Brin.generateBadge('Autre brin'), 'AUT')
  assert.equal(Brin.generateBadge('Intrigue principale'), 'INT')
})

test('Brin.generateBadge — titre court : 3 chars sans "-"', () => {
  const lu = Brin.generateBadge('Lu')
  assert.equal(lu.length, 3)
  assert.ok(!lu.includes('-'), `"${lu}" ne doit pas contenir "-"`)

  const x = Brin.generateBadge('X')
  assert.equal(x.length, 3)
  assert.ok(!x.includes('-'), `"${x}" ne doit pas contenir "-"`)
})

test('Brin.generateBadge — vide ou null : retourne null', () => {
  assert.equal(Brin.generateBadge(''), null)
  assert.equal(Brin.generateBadge(null), null)
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
