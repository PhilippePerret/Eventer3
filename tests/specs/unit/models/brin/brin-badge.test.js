import test from 'node:test'
import assert from 'node:assert/strict'
import Brin from '../../../../../public/classes/models/Brin.js'

test('Brin.generateBadge retourne toujours exactement 3 caractères', () => {
  assert.equal(Brin.generateBadge('Mon brin').length, 3)
  assert.equal(Brin.generateBadge('Lu').length, 3)
  assert.equal(Brin.generateBadge('X').length, 3)
  assert.equal(Brin.generateBadge('').length, 3)
  assert.equal(Brin.generateBadge(null).length, 3)
})

test('Brin.generateBadge — titre multi-mots : 3 premières lettres concaténées', () => {
  assert.equal(Brin.generateBadge('Mon brin'), 'MON')
  assert.equal(Brin.generateBadge('Autre brin'), 'AUT')
  assert.equal(Brin.generateBadge('Intrigue principale'), 'INT')
})

test('Brin.generateBadge — titre court : complété avec "-"', () => {
  assert.equal(Brin.generateBadge('Lu'), 'LU-')
  assert.equal(Brin.generateBadge('X'), 'X--')
})

test('Brin.generateBadge — titre vide ou null : retourne "---"', () => {
  assert.equal(Brin.generateBadge(''), '---')
  assert.equal(Brin.generateBadge(null), '---')
})
