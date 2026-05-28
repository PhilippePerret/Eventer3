import test from 'node:test'
import assert from 'node:assert/strict'
import Texte from '../../../../public/system/Texte.js'

test('Texte.normalize supprime les accents', () => {
  assert.equal(Texte.normalize('Ça c’est un Été Super !'), 'Ca c’est un Ete Super !')
})

test('Texte.slugify produit un identifiant logique', () => {
  assert.equal(Texte.slugify('Ça c’est un Été Super !'), 'ca-cest-un-ete-super')
})

test('Texte.slugify nettoie les séparateurs multiples', () => {
  assert.equal(Texte.slugify('  Bonjour --- le monde  '), 'bonjour-le-monde')
})

test('Texte.slugify retourne une chaîne vide pour null', () => {
  assert.equal(Texte.slugify(null), '')
})