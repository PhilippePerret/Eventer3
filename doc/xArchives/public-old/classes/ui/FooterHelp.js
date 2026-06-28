export default class FooterHelp {
  static update(modes, { canDelete = true } = {}) {
    const footer = document.querySelector('#shortcuts-footer')
    if (!footer) return
    const allModes = window.APP_UI_MODES ?? {}
    let shortcuts = modes.flatMap(mode => allModes[mode] ?? [])
    if (!canDelete) shortcuts = shortcuts.filter(([keys]) => keys !== '⌦')
    footer.innerHTML = shortcuts
      .map(([keys, label]) => `<span><kbd>${keys}</kbd> ${label}</span>`)
      .join('')
  }
}
