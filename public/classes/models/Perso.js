import Texte from '../../system/Texte.js'
import Item from './Item.js'

class Perso extends Item {

  static get thingName() {
    return { thing: 'personnage', THING: 'PERSONNAGE', Thing: 'Personnage', things: 'personnages', THINGS: 'PERSONNAGES', Things: 'Personnages', the: 'le', THE: 'LE', The: 'Le', of: 'du ' }
  }

 static get idPrefix() {
    return 'c'
  }
}