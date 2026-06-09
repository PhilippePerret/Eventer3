import Item from './Item.js'
import { EVENT_STATE, EVENT_METEO, EVENT_EFFET, EVENT_LIEU, EVENT_METEO_EXLUSIONS } from '../../constants.js'

export default class Event extends Item {

  static get thingName() {
    return { thing: 'évènement', THING: 'ÉVÈNEMENT', Thing: 'Évènement', things: 'évènements', THINGS: 'ÉVÈNEMENTS', Things: 'Évènements', the: 'l’', THE: 'L’', The: 'L’', of: 'de l’' }
  }


  constructor(data = {}) {
    super(data)
    this.brin_ids = data.brin_ids ?? []
    this.meteo = data.meteo ?? null
    this.effet = data.effet ?? null
    this.lieu  = data.lieu  ?? null
    this.css = Array.isArray(data.css) ? [...data.css] : []
  }


  static get idPrefix() {
    return 'e'
  }

  static get stateOptions() {
    return EVENT_STATE
  }

  static get meteoOptions() {
    return Object.entries(EVENT_METEO).map(([k, v]) => ({ value: k, label: v.trim() }))
  }

  static get effetOptions() {
    return Object.entries(EVENT_EFFET).map(([k, v]) => ({ value: k, label: v }))
  }

  static get lieuOptions() {
    return Object.entries(EVENT_LIEU).map(([k, v]) => ({ value: k, label: v }))
  }

  render(div) {
    const stateOpt = Event.stateOptions.find(o => o.value === this.state)
    const stateLabel = stateOpt ? stateOpt.label : ''
    const meteoLabel = this.meteo ? (EVENT_METEO[this.meteo] ?? '').trim() : ''
    const effetLabel = this.effet ? (EVENT_EFFET[this.effet] ?? '') : ''
    const lieuLabel  = this.lieu  ? (EVENT_LIEU[this.lieu]   ?? '') : ''
    div.innerHTML = `
      <div class="event-check-gutter"><span class="event-check">${this.checked ? '✓' : ''}</span></div>
      <div class="event-body">
        <div class="event-col1"><span class="event-text">${this.title}</span></div>
        <div class="event-col2">
          <span class="event-state">${stateLabel}</span>
          <span class="event-meteo">${meteoLabel}</span>
          <span class="event-effet">${effetLabel}</span>
          <span class="event-lieu">${lieuLabel}</span>
        </div>
        <div class="event-meta">
          <span class="event-brins-badges"></span>
          <span class="event-persos-marks"></span>
        </div>
      </div>
    `
  }

  getEditorFields(type, itemElement) {
    return [
      { name: 'title',  property: 'title',  selector: '.event-text',  placeholder: this.constructor.newItemPlaceholder },
      { name: 'state',  property: 'state',  type: 'popup-select', selector: '.event-state',  options: Event.stateOptions },
      { name: 'meteo',  property: 'meteo',  type: 'popup-select', selector: '.event-meteo',  options: Event.meteoOptions,
        getDisabledValues: (item) => Object.entries(EVENT_METEO_EXLUSIONS)
          .filter(([, effets]) => effets.includes(item.effet))
          .map(([k]) => k) },
      { name: 'effet',  property: 'effet',  type: 'popup-select', selector: '.event-effet',  options: Event.effetOptions,
        getDisabledValues: (item) => EVENT_METEO_EXLUSIONS[item.meteo] ?? [] },
      { name: 'lieu',   property: 'lieu',   type: 'popup-select', selector: '.event-lieu',   options: Event.lieuOptions },
    ]
  }

}
