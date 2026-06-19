import Lister from '../abstract/Lister.js'
import LOG from '../../../system/LOG.js'

export default class ProjectLister extends Lister {
  static async init(){
    LOG.m(1, 'initialisation de la liste des projets.')
  }
}