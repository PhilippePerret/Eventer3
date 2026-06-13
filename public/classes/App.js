import ProjectLister from './models/ProjectLister.js'
import LOG from '../system/LOG.js'

export default class App {

  async start() {
    LOG.on(0)
    // LOG.on(1)

    LOG.m(1, 'Start application')

    const projectLister = await ProjectLister.init()

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
    const kc = projectLister.keyboardController
    if (!projectId) {
      // projectId null = revenir à la liste projets, sélectionner le projet targetId
      projectLister.render()
      const projectItem = projectLister.items.find(item => item.id === targetId)
      if (projectItem) projectLister.selectItemAt(projectLister.items.indexOf(projectItem))
      return
    }
    const lister = kc.activeLister
    if (!lister) return
    if (typeof lister.navigateToItem === 'function') {
      await lister.navigateToItem(targetId)
    } else {
      // ProjectLister : entrer d'abord dans le bon projet
      const projectItem = lister.items.find(item => item.id === projectId)
      if (!projectItem) return
      lister.selectItemAt(lister.items.indexOf(projectItem))
      await lister.enterSelectedItem()
      await kc.activeLister.navigateToItem(targetId)
    }
  }

}