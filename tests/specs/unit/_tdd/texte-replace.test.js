import test from 'node:test'
import assert from 'node:assert/strict'
import Texte from '../../../../public/system/Texte.js'

// Texte.replaceTokens(text, { constants, persos })
//   constants : [{ name, value }]  — utilisés comme /NAME/ dans le texte
//   persos    : [{ badge, title }] — badge 2 lettres, remplacé avec \b

// ─── Constantes ───────────────────────────────────────────────────────────────

test('replaceTokens : /VILLE/ remplacé par sa valeur', () => {
  const result = Texte.replaceTokens('/VILLE/ est belle', {
    constants: [{ name: 'VILLE', value: 'Paris' }]
  })
  assert.equal(result, 'Paris est belle')
})

test('replaceTokens : constante absente du texte → texte inchangé', () => {
  const result = Texte.replaceTokens('Bonjour', {
    constants: [{ name: 'VILLE', value: 'Paris' }]
  })
  assert.equal(result, 'Bonjour')
})

test('replaceTokens : plusieurs constantes remplacées', () => {
  const result = Texte.replaceTokens('/VILLE/ et /PAYS/', {
    constants: [{ name: 'VILLE', value: 'Lyon' }, { name: 'PAYS', value: 'France' }]
  })
  assert.equal(result, 'Lyon et France')
})

// ─── Badges ───────────────────────────────────────────────────────────────────

test('replaceTokens : badge PP → prénom du personnage', () => {
  const result = Texte.replaceTokens('PP arrive', {
    persos: [{ badge: 'PP', title: 'Philippe' }]
  })
  assert.equal(result, 'Philippe arrive')
})

test('replaceTokens : badge PP avec \\b — ne remplace pas PP dans PPAPP', () => {
  const result = Texte.replaceTokens('PPAPP et PP', {
    constants: [{ name: 'PPAPP', value: 'MonApp' }],
    persos:    [{ badge: 'PP', title: 'Philippe' }]
  })
  assert.equal(result, 'MonApp et Philippe')
})

test('replaceTokens : constante APPAPP — PP badge ne touche pas APPAPP', () => {
  const result = Texte.replaceTokens('/APPAPP/', {
    constants: [{ name: 'APPAPP', value: 'AutreApp' }],
    persos:    [{ badge: 'PP', title: 'Philippe' }]
  })
  assert.equal(result, 'AutreApp')
})

test('replaceTokens : tout ensemble — badge PP, constante /PPAPP/, constante /APPAPP/', () => {
  const result = Texte.replaceTokens('/PPAPP/ puis /APPAPP/ et PP', {
    constants: [{ name: 'PPAPP', value: 'App1' }, { name: 'APPAPP', value: 'App2' }],
    persos:    [{ badge: 'PP', title: 'Philippe' }]
  })
  assert.equal(result, 'App1 puis App2 et Philippe')
})

test('replaceTokens : constante plus longue d\'abord pour éviter sous-match', () => {
  const result = Texte.replaceTokens('/AB/ et /ABC/', {
    constants: [{ name: 'AB', value: 'deux' }, { name: 'ABC', value: 'trois' }]
  })
  assert.equal(result, 'deux et trois')
})

test('replaceTokens : texte null ou vide → chaîne vide', () => {
  assert.equal(Texte.replaceTokens(null, {}), '')
  assert.equal(Texte.replaceTokens('', {}), '')
})
