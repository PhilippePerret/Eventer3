import { ItemDataMapper } from '../repositories/Mapper.js'
import { raise } from '../../system/Error.js'

export default class ListerRepository {

  static async save(lister) {
    const response = await fetch(`/data/${lister.jsonPath}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_ids: lister.item_ids })
    })
    if (!response.ok) raise(`Impossible de sauver ${lister.id}`)
  }

  static async saveItems(lister) {
    const items = lister.items.map(item => ItemDataMapper.toPersistence(item))
    const response = await fetch(`/data/${lister.itemsPath}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    })
    if (!response.ok) raise(`Impossible de sauver les items de ${lister.id}`)
  }

}
