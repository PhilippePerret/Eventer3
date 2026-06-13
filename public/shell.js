const pane1El = document.getElementById('pane-1')
const pane2El = document.getElementById('pane-2')

pane1El.addEventListener('load', function() { this.focus() })
pane2El.addEventListener('load', function() { this.focus() })

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
      }
      break
    case 'split-close':
      pane2El.removeAttribute('data-split-active')
      pane1El.focus()
      break
    case 'focus-pane-1':
      pane1El.focus()
      break
    case 'focus-pane-2':
      if (isSplitActive()) pane2El.focus()
      break
  }
})
