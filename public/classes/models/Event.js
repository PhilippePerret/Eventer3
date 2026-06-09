import Item from './Item.js'
import { EVENT_STATE } from '../../constants.js'

export default class Event extends Item {

  static get thingName() {
    return { thing: 'évènement', THING: 'ÉVÈNEMENT', Thing: 'Évènement', things: 'évènements', THINGS: 'ÉVÈNEMENTS', Things: 'Évènements', the: 'l’', THE: 'L’', The: 'L’', of: 'de l’' }
  }


  constructor(data = {}) {
    super(data)
    this.brin_ids = data.brin_ids ?? []
    this.meteo = data.meteo ?? null
    this.effet = data.effet ?? 'jr'
    this.css = Array.isArray(data.css) ? [...data.css] : []
  }


  static get idPrefix() {
    return 'e'
  }

  static get stateOptions() {
    return EVENT_STATE
  }

  render(div) {
    const stateOpt = Event.stateOptions.find(o => o.value === this.state)
    const stateLabel = stateOpt ? stateOpt.label : ''
    div.innerHTML = `
      <div class="event-check-gutter"><span class="event-check">${this.checked ? '✓' : ''}</span></div>
      <div class="event-body">
        <div class="event-left"><span class="event-text">${this.title}</span></div>
        <div class="event-meta">
          <span class="event-brins-badges"></span>
          <span class="event-persos-marks"></span>
          <span class="event-state">${stateLabel}</span>
        </div>
      </div>
    `
  }

  getEditorFields(type, itemElement) {
    return [
      { name: 'title', property: 'title', selector: '.event-text', placeholder: this.constructor.newItemPlaceholder },
      { name: 'state', property: 'state', type: 'popup-select', selector: '.event-state', options: Event.stateOptions },
    ]
  }

}
