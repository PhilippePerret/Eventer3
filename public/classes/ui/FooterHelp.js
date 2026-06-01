export default class FooterHelp {
  static update(modes) {
    const footer = document.querySelector('#shortcuts-footer')
    if (!footer) return
    const allModes = window.APP_UI_MODES ?? {}
    const shortcuts = modes.flatMap(mode => allModes[mode] ?? [])
    footer.innerHTML = shortcuts
      .map(([keys, label]) => `<span><kbd>${keys}</kbd> ${label}</span>`)
      .join('')
  }
}
