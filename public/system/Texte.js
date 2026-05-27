export default class Texte {

  static normalize(value) {
    return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  static slugify(value) {
    return this.normalize(value)
      .toLowerCase()
      .trim()
      .replace(/['’]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

}