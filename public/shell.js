const pane1El = document.getElementById('pane-1')
const pane2El = document.getElementById('pane-2')
let _pendingNavigation = null

function setFocused(paneEl) {
  pane1El.removeAttribute('data-focused')
  pane2El.removeAttribute('data-focused')
  paneEl.setAttribute('data-focused', '')
}

pane1El.addEventListener('load', function() { this.focus(); setFocused(this) })
pane2El.addEventListener('load', function() { if (!isSplitActive()) return; this.focus(); setFocused(this) })

function isSplitActive() {
  return pane2El.hasAttribute('data-split-active')
}

window.addEventListener('message', (event) => {
  if (event.data?.type !== 'shell-action') return
  switch (event.data.action) {
    case 'split-open':
      if (!isSplitActive()) {
        pane2El.setAttribute('src', '/app-frame.html')
        pane2El.setAttribute('data-split-active', '')
        document.body.style.flexDirection = event.data.direction === 'horizontal' ? 'column' : 'row'
      }
      break
    case 'split-open-and-navigate':
      if (!isSplitActive()) {
        _pendingNavigation = { targetId: event.data.targetId, projectId: event.data.projectId }
        pane2El.setAttribute('src', '/app-frame.html')
        pane2El.setAttribute('data-split-active', '')
        document.body.style.flexDirection = event.data.direction === 'horizontal' ? 'column' : 'row'
      }
      break
    case 'pane-ready':
      if (event.data.paneId === 'pane-2' && _pendingNavigation) {
        const nav = _pendingNavigation
        _pendingNavigation = null
        pane2El.contentWindow.postMessage({ type: 'app-action', action: 'navigate-to-item', ...nav }, '*')
        pane2El.focus()
        setFocused(pane2El)
      }
      break
    case 'split-rotate': {
      const current = document.body.style.flexDirection
      document.body.style.flexDirection = current === 'column' ? 'row' : 'column'
      break
    }
    case 'split-close':
      pane2El.removeAttribute('data-split-active')
      pane1El.focus()
      setFocused(pane1El)
      break
    case 'focus-pane-1':
      pane1El.focus()
      setFocused(pane1El)
      break
    case 'focus-pane-2':
      if (isSplitActive()) { pane2El.focus(); setFocused(pane2El) }
      break
  }
})
