import Texte from '../../../system/Texte.js'
import { stopEvent } from '../../utils/events.js'

const MARKDOWN_WRAP = { i: '*', g: '**', b: '~~', u: '__' }
const BLOCKED_KEYS  = { ArrowUp: true, ArrowDown: true }

function onTextEditKeydown(e) {
  if (BLOCKED_KEYS[e.key])               return stopEvent(e)
  if (e.metaKey && MARKDOWN_WRAP[e.key]) { stopEvent(e); Texte.wrapSelection(MARKDOWN_WRAP[e.key]) }
}

export function attachTextEdit(el) {
  el.addEventListener('keydown', onTextEditKeydown)
}

export function detachTextEdit(el) {
  el.removeEventListener('keydown', onTextEditKeydown)
}
