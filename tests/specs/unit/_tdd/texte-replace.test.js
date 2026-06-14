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

test('replaceTokens : « VILLES? » ne remplace pas « VILLE » ', () => {
  const result = Texte.replaceTokens('VILLE est belle', {
    constants: [{ name: 'VILLE?', value: 'Paris' }]
  })
  assert.equal(result, 'VILLE est belle')
})

test('replaceTokens : « /VILLES?/ » remplace « VILLE » ', () => {
  const result = Texte.replaceTokens('VILLE est belle', {
    constants: [{ name: '/VILLES?/', value: 'Paris' }]
  })
  assert.equal(result, 'Paris est belle')
})

test('replaceTokens : « /(ville)/ » remplace et ajoute', () => {
  const result = Texte.replaceTokens('ville est belle', {
    constants: [{ name: '/(ville)/', value: 'Paris, la $1,' }]
  })
  assert.equal(result, 'Paris, la ville, est belle')
})

test('replaceTokens : « (ville) » remplace vraiment ce texte par la valeur brute', () => {
  let result = Texte.replaceTokens('ville est belle', {
    constants: [{ name: '(ville)', value: 'Paris, la $1,' }]
  })
  assert.equal(result, 'ville est belle')

  result = Texte.replaceTokens('(ville) est belle', {
    constants: [{ name: '(ville)', value: 'Paris, la $1,' }]
  })
  assert.equal(result, 'Paris, la $1, est belle')
})

test('replaceTokens : « /VILLES?/ » ne remplace pas « /VILLES?/ » ', () => {
  const result = Texte.replaceTokens('/VILLES?/ est belle', {
    constants: [{ name: '/VILLES?/', value: 'Paris' }]
  })
  assert.equal(result, '/VILLES?/ est belle')
})

test('replaceTokens : « /VILLES?/ » ne remplace pas « VILLES? » ', () => {
  const result = Texte.replaceTokens('VILLES? est belle', {
    constants: [{ name: '/VILLES?/', value: 'Paris' }]
  })
  assert.equal(result, 'VILLES? est belle')
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

// ─── Patronyme (badge + "pat") ────────────────────────────────────────────────

test('replaceTokens : KPpat → patronyme du personnage', () => {
  const result = Texte.replaceTokens('KPpat arrive en ville', {
    persos: [{ badge: 'KP', title: 'Gil', patronyme: 'Gillian Kaplan' }]
  })
  assert.equal(result, 'Gillian Kaplan arrive en ville')
})

test('replaceTokens : KP → title, KPpat → patronyme dans même texte', () => {
  const result = Texte.replaceTokens('KP alias KPpat', {
    persos: [{ badge: 'KP', title: 'Gil', patronyme: 'Gillian Kaplan' }]
  })
  assert.equal(result, 'Gil alias Gillian Kaplan')
})

test('replaceTokens : KPpatounet → pas remplacé (pas une limite de mot après "pat")', () => {
  const result = Texte.replaceTokens('KPpatounet', {
    persos: [{ badge: 'KP', title: 'Gil', patronyme: 'Gillian Kaplan' }]
  })
  assert.equal(result, 'KPpatounet')
})

test('replaceTokens : badge sans patronyme → KPpat non remplacé', () => {
  const result = Texte.replaceTokens('KPpat arrive', {
    persos: [{ badge: 'KP', title: 'Gil' }]
  })
  assert.equal(result, 'KPpat arrive')
})
