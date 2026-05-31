export class ItemDataMapper {

  static TO_RUNTIME = {
    ac: 'active',
    bg: 'badge',
    bi: 'brin_ids',
    ca: 'created_at',
    ch: 'checked',
    co: 'color',
    du: 'duration',
    fi: 'file',
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

  static toPersistence(item) {
    const persistenceData = {}
    Object.entries(this.TO_PERSISTENCE).forEach(([longKey, shortKey]) => {
      if (item[longKey] !== undefined) persistenceData[shortKey] = item[longKey]
    })
    return persistenceData
  }

}