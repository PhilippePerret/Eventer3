import test from 'node:test'
import assert from 'node:assert/strict'

const { default: Texte } = await import('../../../../public/system/Texte.js')

test('renderMarkdown: **gras** → <strong>', () => {
  assert.equal(Texte.renderMarkdown('un **mot** gras'), 'un <strong>mot</strong> gras')
})

test('renderMarkdown: *italique* → <em>', () => {
  assert.equal(Texte.renderMarkdown('un *mot* en italique'), 'un <em>mot</em> en italique')
})

test('renderMarkdown: **gras** prioritaire sur *italique*', () => {
  assert.equal(Texte.renderMarkdown('**gras** et *italique*'), '<strong>gras</strong> et <em>italique</em>')
})

test('renderMarkdown: ~~barré~~ → <s>', () => {
  assert.equal(Texte.renderMarkdown('~~barré~~'), '<s>barré</s>')
})

test('renderMarkdown: __souligné__ → <u>', () => {
  assert.equal(Texte.renderMarkdown('__souligné__'), '<u>souligné</u>')
})

test('renderMarkdown: ^exposant^ → <sup>', () => {
  assert.equal(Texte.renderMarkdown('1^er^ rang'), '1<sup>er</sup> rang')
})

test('renderMarkdown: [texte](url) → <a>', () => {
  assert.equal(
    Texte.renderMarkdown('[voir](https://example.com)'),
    '<a href="https://example.com" target="_blank" rel="noopener">voir</a>'
  )
})

test('renderMarkdown: MA_CONSTANTE non transformée (__ seul signe absent)', () => {
  assert.equal(Texte.renderMarkdown('MA_CONSTANTE'), 'MA_CONSTANTE')
})

test('renderMarkdown: texte sans markup → inchangé', () => {
  assert.equal(Texte.renderMarkdown('texte simple'), 'texte simple')
})

test('renderMarkdown: texte vide → chaîne vide', () => {
  assert.equal(Texte.renderMarkdown(''), '')
})

test('renderMarkdown: null → chaîne vide', () => {
  assert.equal(Texte.renderMarkdown(null), '')
})
