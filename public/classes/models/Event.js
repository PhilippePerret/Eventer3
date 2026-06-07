import Item from './Item.js'

export default class Event extends Item {

  static get thingName() {
    return { thing: 'évènement', THING: 'ÉVÈNEMENT', Thing: 'Évènement', things: 'évènements', THINGS: 'ÉVÈNEMENTS', Things: 'Évènements', the: 'l’', THE: 'L’', The: 'L’', of: 'de l’' }
  }


  constructor(data = {}) {
    super(data)
    this.brin_ids = data.brin_ids ?? []
  }


  static get idPrefix() {
    return 'e'
  }

  static get stateOptions() {
    return [
      { value: 0, label: '—' },
      { value: 1, label: 'ébauche' },
      { value: 2, label: 'développement' },
      { value: 3, label: 'premier jet' },
      { value: 4, label: 'réécriture' },
      { value: 5, label: 'achèvement' },
      { value: 6, label: 'à corriger' },
      { value: 7, label: 'correction' },
      { value: 8, label: 'à relire' },
      { value: 9, label: 'achevé' },
    ]
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
