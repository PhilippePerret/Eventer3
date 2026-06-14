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

  static toggleMark(val, start, end, before, after = before) {
    // Case 1: selection includes markers at its own boundaries
    if (
      val.slice(start, start + before.length) === before &&
      val.slice(end - after.length, end) === after &&
      end - start >= before.length + after.length
    ) {
      const inner = val.slice(start + before.length, end - after.length)
      return {
        value:    val.slice(0, start) + inner + val.slice(end),
        selStart: start,
        selEnd:   start + inner.length,
      }
    }
    // Case 2: markers just outside selection
    if (
      start >= before.length &&
      val.slice(start - before.length, start) === before &&
      val.slice(end, end + after.length) === after
    ) {
      const inner = val.slice(start, end)
      return {
        value:    val.slice(0, start - before.length) + inner + val.slice(end + after.length),
        selStart: start - before.length,
        selEnd:   start - before.length + inner.length,
      }
    }
    // No mark → add
    return {
      value:    val.slice(0, start) + before + val.slice(start, end) + after + val.slice(end),
      selStart: start + before.length,
      selEnd:   end   + before.length,
    }
  }

  static wrapSelection(before, after = before) {
    const el = document.activeElement
    if (!el) return
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      const start = el.selectionStart
      const end   = el.selectionEnd
      if (start === end) return
      const result = Texte.toggleMark(el.value, start, end, before, after)
      el.value = result.value
      el.setSelectionRange(result.selStart, result.selEnd)
      el.dispatchEvent(new Event('input', { bubbles: true }))
    } else {
      const sel = window.getSelection()
      if (!sel || sel.isCollapsed) return
      const range = sel.getRangeAt(0)
      const text  = range.toString()
      range.deleteContents()
      const node = document.createTextNode(before + text + after)
      range.insertNode(node)
      range.setStartAfter(node)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }

  static replaceTokens(text, { constants = [], persos = [] } = {}) {
    if (!text) return ''
    text = Texte._replaceConstants(String(text), constants)
    text = Texte._replaceBadges(text, persos)
    return text
  }

  static _replaceConstants(text, constants) {
    const escape        = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const REGEX_SPECIAL = /[?*+.{()\[\]\\^$|]/
    for (const { name, value } of constants) {
      if (name.startsWith('/') && name.endsWith('/') && name.length > 1) {
        const pattern = name.slice(1, -1)
        try {
          text = text.replace(new RegExp(pattern, 'g'), (match, ...args) => {
            const offset = args[args.length - 2]
            const str    = args[args.length - 1]
            if (REGEX_SPECIAL.test(str[offset + match.length] ?? '')) return match
            return value.replace(/\$(\d+)/g, (_, n) => args[parseInt(n) - 1] ?? '')
          })
        } catch (_) {}
      } else {
        text = text.replace(new RegExp(`/${escape(name)}/`, 'g'), value)
        if (/^\w+$/.test(name))
          text = text.replace(new RegExp(`\\b${escape(name)}\\b`, 'g'), value)
        else
          text = text.split(name).join(value)
      }
    }
    return text
  }

  static _replaceBadges(text, persos) {
    const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    for (const { badge, title, patronyme } of persos) {
      if (patronyme)
        text = text.replace(new RegExp(`\\b${escape(badge)}pat\\b`, 'g'), patronyme)
      text = text.replace(new RegExp(`\\b${escape(badge)}\\b`, 'g'), title)
    }
    return text
  }

  static renderMarkdown(text) {
    if (!text) return ''
    return String(text)
      .replace(/\*\*(.+?)\*\*/g,       '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,           '<em>$1</em>')
      .replace(/~~(.+?)~~/g,           '<s>$1</s>')
      .replace(/__(.+?)__/g,           '<u>$1</u>')
      .replace(/\^(.+?)\^/g,           '<sup>$1</sup>')
      .replace(/\[(.+?)\]\((.+?)\)/g, (_, text, url) => {
        if (/^https?:\/\//.test(url)) return `<a href="${url}" target="_blank" rel="noopener">${text}</a>`
        return `<span class="item-link" data-id="${url}">${text}</span>`
      })
  }

}
