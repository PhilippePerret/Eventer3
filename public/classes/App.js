import ListerProject from './models/core/ListerProject.js'
import ListerEvent from './models/core/ListerEvent.js'
import ToolsPanel from './ui/ToolsPanel.js'
import Windows from './ui/Windows.js'
import LOG from '../system/LOG.js'


export default class App {

  async start() {
    // LOG.on(4) // POUR METTRE EN ROUTE LES TESTS (NE PAS DUPLIQUER CETTE LIGNE !!!!)

    LOG.m(1, 'Start application')

    const projectLister = await ListerProject.init()

    Windows.init()

    document.addEventListener('keydown', (ev) => {
      if (ev.metaKey && !ev.ctrlKey && !ev.altKey && ev.key === 't') {
        let el = document.activeElement
        while (el) {
          if (el._activeKeyDispatcher?.getTools) {
            ev.preventDefault()
            ev.stopPropagation()
            new ToolsPanel().open(el._activeKeyDispatcher.getTools())
            return
          }
          el = el.parentElement
        }
      }
    }, { capture: true })

    window.addEventListener('message', async (event) => {
      if (event.data?.type !== 'app-action') return
      if (event.data.action === 'navigate-to-item') {
        await App.navigateToItem(projectLister, event.data.targetId, event.data.projectId)
      }
    })

    LOG.m(1, 'Application started, projets affichés')

    if (window !== window.parent) {
      window.parent.postMessage({ type: 'shell-action', action: 'pane-ready', paneId: window.frameElement?.id }, '*')
    }

  }

  static async navigateToItem(projectLister, targetId, projectId) {
    if (!projectId) {
      const idx = projectLister.items.findIndex(p => p.id === targetId)
      if (idx >= 0) projectLister.selectedIndex = idx
      document.getElementById(ListerEvent.PANEL_ID)?.classList.add('hidden')
      projectLister.build()
      projectLister.display(null)
      return
    }
    const projectIdx = projectLister.items.findIndex(p => p.id === projectId)
    if (projectIdx < 0) return
    projectLister.selectedIndex = projectIdx
    const projectItem = projectLister.items[projectIdx]
    projectLister.hideContainer()
    const rootLister  = await projectItem._initNewLister(ListerEvent, projectItem.lister_id)
    rootLister.build()
    rootLister.display(projectItem)
    await rootLister.navigateToItem(targetId)
  }

}