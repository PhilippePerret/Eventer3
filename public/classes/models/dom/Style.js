const PREVIEW = 'Il était une fois une histoire extraordinaire...'

export default {
  _buildContent(el) {
    el.classList.add('panel-row', 'style-row')
    el.dataset.name = this.name
    const idx = this.parentLister?.items.indexOf(this) ?? 0
    el.innerHTML = `<div class="panel-check"><span class="style-item__letter">${String.fromCharCode(97 + idx)}</span><span class="style-item__checkmark">✓</span></div>`
    const preview = document.createElement('div')
    preview.className = 'style-item__preview'
    preview.textContent = PREVIEW
    if (this.css) preview.style.cssText = this.css
    el.appendChild(preview)
  }
}
