export function raise(message, data = null) {
  // TODO Traiter les arguments :
  // $1, $2 etc. dans les textes, sinon : en console
  console.error(message, data)
  throw new Error(message)
}

export class Error {
  
}