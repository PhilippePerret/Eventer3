import KeyDispatcher from '../models/abstract/KeyDispatcher.js'
import PopupSelect from './PopupSelect.js'
import Notification from './Notification.js'
import { getErr } from '../../system/Error.js'
import { stopEvent } from '../utils/events.js'

export default class Windows extends KeyDispatcher {

  // ─── Keyboard dispatch ────────────────────────────────────────────────────────

  static LISTENERS = {
    '0':        { alt:  'closeSplit'  },
    '1':        { alt:  'focusPane1'  },
    '2':        { alt:  'openSplit'   },
    r:          { alt:  'rotateSplit' },
    ArrowRight: { meta: 'cyclePanes'  },
    ArrowLeft:  { meta: 'cyclePanes'  },
    Tab:        { ctrl: 'cyclePanes'  },
  }

  static init() {
    const win = new Windows()
    win.attach(document.body)
    // Numpad Alt+2/1/0 : ev.key varie selon NumLock → on teste ev.code en capture
    document.addEventListener('keydown', (ev) => {
      if (!ev.altKey || ev.metaKey || ev.ctrlKey) return
      if      (ev.code === 'Numpad2') { stopEvent(ev); win.openSplit()  }
      else if (ev.code === 'Numpad1') { stopEvent(ev); win.focusPane1() }
      else if (ev.code === 'Numpad0') { stopEvent(ev); win.closeSplit() }
    }, { capture: true })
    return win
  }

  openSplit() {
    if (Windows.isSplitActive()) {
      window.parent.postMessage({ type: 'shell-action', action: 'focus-pane-2' }, '*')
    } else {
      Windows.openSplitChoice()
    }
  }

  focusPane1() {
    if (Windows.isSplitActive()) {
      window.parent.postMessage({ type: 'shell-action', action: 'focus-pane-1' }, '*')
    } else {
      Notification.show(getErr(6100))
    }
  }

  closeSplit() {
    if (!Windows.isSplitActive()) { Notification.show(getErr(6100)); return }
    const item         = document.activeElement?._activeKeyDispatcher
    const currentState = item?.id
      ? { targetId: item.id, projectId: item.parentLister?.project?.id ?? null }
      : null
    window.parent.postMessage({ type: 'shell-action', action: 'split-close', fromPaneId: window.frameElement?.id, currentState }, '*')
  }

  rotateSplit() {
    if (!Windows.doRotate()) Notification.show(getErr(6100))
  }

  cyclePanes() {
    Windows.doCyclePanes()
  }

  // ─── Static utilities (used by ItemTargets, onShiftTab, etc.) ─────────────────

  static isSplitActive() {
    if (window === window.parent) return false
    return !!window.parent.document.getElementById('pane-2')?.hasAttribute('data-split-active')
  }

  static openSplitChoice() {
    if (window === window.parent) return
    Windows._openPopup((value) => {
      window.parent.postMessage({ type: 'shell-action', action: 'split-open', direction: value }, '*')
    })
  }

  static openInOtherPane(targetId, projectId) {
    if (window === window.parent) return
    if (!Windows.isSplitActive()) {
      Windows._openPopup((value) => {
        window.parent.postMessage({
          type: 'shell-action', action: 'split-open-and-navigate',
          direction: value, targetId, projectId
        }, '*')
      })
      return
    }
    const myPaneId    = window.frameElement?.id
    const otherPaneId = myPaneId === 'pane-1' ? 'pane-2' : 'pane-1'
    window.parent.document.getElementById(otherPaneId)
      .contentWindow.postMessage({ type: 'app-action', action: 'navigate-to-item', targetId, projectId }, '*')
    window.parent.postMessage({ type: 'shell-action', action: `focus-${otherPaneId}` }, '*')
  }

  static doRotate() {
    if (!Windows.isSplitActive()) return false
    window.parent.postMessage({ type: 'shell-action', action: 'split-rotate' }, '*')
    return true
  }

  static doCyclePanes() {
    if (!Windows.isSplitActive()) return false
    const myPaneId = window.frameElement?.id
    window.parent.postMessage({ type: 'shell-action', action: myPaneId === 'pane-2' ? 'focus-pane-1' : 'focus-pane-2' }, '*')
    return true
  }

  static _openPopup(onSelect) {
    const anchor = {
      getBoundingClientRect: () => ({
        bottom: window.innerHeight / 2,
        left:   window.innerWidth  / 2 - 80,
        right:  window.innerWidth  / 2 + 80,
        top:    window.innerHeight / 2,
      })
    }
    new PopupSelect({
      options:    [
        { value: 'vertical',   label: 'Vertical'   },
        { value: 'horizontal', label: 'Horizontal' },
      ],
      title:      'Split fenêtre',
      showSearch: false,
      onSelect,
    }).open(anchor)
  }

}
