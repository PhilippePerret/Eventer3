import { ERRORS } from '../locale/fr/ERRORS.js'

export function raise(message, data = null) {
  // TODO Traiter les arguments :
  // $1, $2 etc. dans les textes, sinon : en console
  console.error(message, data)
  throw new Error(message)
}

export function getErr(code, vars) {
  const msg = ERRORS[code]
  if (vars == null) return msg
  const list = Array.isArray(vars) ? vars : [vars]
  return list.reduce((m, v, i) => m.replace(`$${i + 1}`, v), msg)
}

export class Error {

}