import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ERRORS } from '../../../../public/system/Locales.js'

test('ERRORS est un objet', () => {
  assert.equal(typeof ERRORS, 'object')
})

test('ERRORS[5200] = "Aucune cible n\'est sélectionnée"', () => {
  assert.equal(ERRORS[5200], "Aucune cible n'est sélectionnée.")
})
