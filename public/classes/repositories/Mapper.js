export class ItemDataMapper {

  static TO_RUNTIME = {
    bg: 'badge',
    ca: 'created_at',
    ch: 'checked',
    co: 'color',
    du: 'duration',
    fn: 'fonction',
    hl: 'hasLister',
    id: 'id',
    pa: 'patronyme',
    pt: 'path',
    st: 'state',
    tt: 'title',
    ty: 'type',
    ua: 'updated_at'
  }

  static TO_PERSISTENCE = Object.fromEntries(Object.entries(this.TO_RUNTIME).map(([shortKey, longKey]) => [longKey, shortKey]))

  static toRuntime(data) {
    const runtimeData = {}
    Object.entries(data).forEach(([key, value]) => runtimeData[this.TO_RUNTIME[key] || key] = value)
    return runtimeData
  }

  static toPersistence(data) {
    const persistenceData = {}
    Object.entries(data).forEach(([key, value]) => persistenceData[this.TO_PERSISTENCE[key] || key] = value)
    return persistenceData
  }

}