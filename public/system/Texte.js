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
