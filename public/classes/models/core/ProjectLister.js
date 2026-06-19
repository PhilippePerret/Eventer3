import Lister from '../abstract/Lister.js'
import LOG from '../../../system/LOG.js'

import ProjectListerDom from '../dom/ProjectLister.js'

export default class ProjectLister extends Lister {
  static async init(){
    LOG.m(1, 'initialisation de la liste des projets.')
  }

  methodSeulementPourProjectLister(params){
    return ProjectListerDom.methodSeulementPourProjectLister(this, params)
  }
}

// OU, si c'est possible : 

ProjectLister.Dom.prototype.methodSeulementPourProjectLister = ProjectListerDom.methodSeulementPourProjectLister