import Lister from './models/Lister.js'
import Project from './models/Project.js'

export default class App {

  constructor() {
    this.mainPanel = document.querySelector('#main-panel')
  }

  async start() {

    console.log("-> démarrage de l'application")

    const response = await fetch('/data/projects.json')

    console.log("-> réponse projects.json :", response.status)

    const data = await response.json()

    console.log("-> données projects :", data)

    const projects = new Lister(data)
    projects.itemClass = Project

    console.log("-> item_ids :", projects.item_ids)

    await projects.loadItems()

    console.log("-> items chargés :", projects.items)

    const rendered = projects.render()

    console.log("-> DOM listing :", rendered.outerHTML)

    this.mainPanel.appendChild(rendered)

    console.log("-> DOM injecté")

  }

}