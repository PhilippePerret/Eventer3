export default class Item {
  constructor(data = {}) {
    this.id         = data.id ?? null
    this.title      = data.title ?? ''
    this.hasLister  = data.hasLister ?? false
    this.type       = data.type ?? []
    this.color      = data.color ?? null
    this.checked    = data.checked ?? false
    this.pos        = data.pos ?? 0
    this.state      = data.state ?? 0
    this.duration   = data.duration ?? null
    this.path       = data.path ?? null
    this.created_at = data.created_at ?? null
    this.updated_at = data.updated_at ?? null

    this.badge      = data.badge ?? null
    this.patronyme  = data.patronyme ?? null
    this.fonction   = data.fonction ?? null
  }
}
