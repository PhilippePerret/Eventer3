export default class Texte {

  static normalize(value) {
    return String(value ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '')
  }

  static slugify(value) {
    return this.normalize(value)
      .toLowerCase()
      .trim()
      .replace(/[‘’]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  static renderMarkdown(text) {
    if (!text) return ''
    return String(text)
      .replace(/\*\*(.+?)\*\*/g,       '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,           '<em>$1</em>')
      .replace(/~~(.+?)~~/g,           '<s>$1</s>')
      .replace(/__(.+?)__/g,           '<u>$1</u>')
      .replace(/\^(.+?)\^/g,           '<sup>$1</sup>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
  }

}
